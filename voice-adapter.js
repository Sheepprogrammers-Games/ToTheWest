(() => {
  'use strict';

  const speech = window.speechSynthesis || null;
  const configured = window.SHADOWPLAY_VOICE_CONFIG || {};
  const fallbackProfiles = Object.freeze({
    narrator: Object.freeze({ voice: '', gender: 'male', tone: '沉稳旁白', browserVoices: ['Yunyang', 'Yunjian', 'Male'], browserRate: 0.78, browserPitch: 0.74, browserVolume: 1 }),
    male: Object.freeze({ voice: '', gender: 'male', tone: '沉稳男声', browserVoices: ['Yunxi', 'Yunjian', 'Yunyang', 'Male'], browserRate: 0.9, browserPitch: 0.86, browserVolume: 1 }),
    female: Object.freeze({ voice: '', gender: 'female', tone: '清晰女声', browserVoices: ['Xiaoxiao', 'Xiaoyi', 'Ting-Ting', 'Female'], browserRate: 0.88, browserPitch: 1.02, browserVolume: 1 }),
    youth: Object.freeze({ voice: '', gender: 'male', tone: '少年男声', browserVoices: ['Yunxia', 'Yunxi', 'Male'], browserRate: 1.06, browserPitch: 1.18, browserVolume: 1 })
  });
  const femaleCharacters = new Set(['观音', '白骨', '铁扇', '王母', '女王', '白骨村姑', '白骨老妇']);
  const youthCharacters = new Set(['石猴', '红孩', '哪吒']);
  const voiceGain = () => {
    const state = window.__shadowplayState;
    if (state && state.sound === false) return 0;
    const level = Number(state?.voiceVolume);
    return Number.isFinite(level) ? Math.max(0, Math.min(1, level)) : 0.92;
  };

  const wait = (ms, signal) => new Promise(resolve => {
    const timer = window.setTimeout(() => resolve('timeout'), ms);
    signal?.addEventListener('abort', () => {
      window.clearTimeout(timer);
      resolve('aborted');
    }, { once: true });
  });
  let resolver = typeof configured.resolver === 'function' ? configured.resolver : null;
  let bakedManifest = null;
  const bakedReady = Promise.resolve()
    .then(() => fetch(configured.bakedUrl || 'assets/voice/manifest.json', { cache: 'force-cache' }))
    .then(response => response && response.ok ? response.json() : {})
    .then(payload => { bakedManifest = payload && typeof payload === 'object' ? payload : {}; return bakedManifest; })
    .catch(() => { bakedManifest = {}; return bakedManifest; });
  let audio = null;
  let audioObjectUrl = null;
  let requestController = null;
  let generation = 0;
  let voices = [];
  let castProfiles = Object.freeze({});
  let castState = 'loading';
  const outputCache = new Map();
  const pendingPreloads = new Map();
  const outputCacheLimit = 18;
  const lockedBrowserVoices = new Map();

  function normalizeProfile(profile = {}) {
    return Object.freeze({
      voice: String(profile.voice || ''),
      gender: profile.gender === 'female' ? 'female' : profile.gender === 'mixed' ? 'mixed' : 'male',
      tone: String(profile.tone || ''),
      rate: String(profile.rate || '+0%'),
      pitch: String(profile.pitch || '+0Hz'),
      volume: String(profile.volume || '+0%'),
      browserVoices: Object.freeze(Array.isArray(profile.browserVoices) ? profile.browserVoices.map(String) : []),
      browserRate: Number.isFinite(Number(profile.browserRate)) ? Number(profile.browserRate) : 0.9,
      browserPitch: Number.isFinite(Number(profile.browserPitch)) ? Number(profile.browserPitch) : 1,
      browserVolume: Number.isFinite(Number(profile.browserVolume)) ? Number(profile.browserVolume) : 1
    });
  }

  async function loadCast() {
    try {
      let payload = configured.cast || null;
      if (!payload) {
        const response = await fetch(configured.castUrl || 'voice-cast.json', { cache: 'no-cache' });
        if (!response.ok) throw new Error(`Voice cast request failed: ${response.status}`);
        payload = await response.json();
      }
      const source = payload.characters || payload;
      const entries = Object.entries(source || {}).filter(([, profile]) => profile && typeof profile === 'object');
      if (!entries.length) throw new Error('Voice cast is empty.');
      castProfiles = Object.freeze(Object.fromEntries(entries.map(([character, profile]) => [character, normalizeProfile(profile)])));
      castState = 'ready';
    } catch (error) {
      castProfiles = Object.freeze({});
      castState = 'fallback';
    }
    return castProfiles;
  }

  const castReady = loadCast();

  function refreshVoices() {
    voices = speech?.getVoices?.() || [];
  }

  function releaseAudio(player = audio) {
    if (!player) return;
    const isCurrent = player === audio;
    try { player.pause(); } catch (error) {}
    try {
      player.removeAttribute('src');
      player.load();
    } catch (error) {}
    if (isCurrent) {
      audio = null;
      if (audioObjectUrl) {
        URL.revokeObjectURL(audioObjectUrl);
        audioObjectUrl = null;
      }
    }
  }

  function stop() {
    generation += 1;
    requestController?.abort();
    requestController = null;
    speech?.cancel();
    releaseAudio();
  }

  function fallbackProfile(character, narrator) {
    if (narrator) return fallbackProfiles.narrator;
    if (femaleCharacters.has(character)) return fallbackProfiles.female;
    if (youthCharacters.has(character)) return fallbackProfiles.youth;
    return fallbackProfiles.male;
  }

  function profileFor(cue = {}) {
    const key = cue.narrator ? '旁白' : cue.character;
    return castProfiles[key] || fallbackProfile(key, cue.narrator);
  }

  function voiceLockKey(profile) {
    return String(profile.voice || (profile.browserVoices || []).join('|') || profile.gender || 'zh');
  }

  function voiceFor(profile) {
    if (!voices.length) refreshVoices();
    const lockKey = voiceLockKey(profile);
    const locked = lockedBrowserVoices.get(lockKey);
    if (locked && voices.includes(locked)) return locked;
    const chinese = voices.filter(voice => /^zh(?:-|_)/i.test(voice.lang));
    for (const preferredName of profile.browserVoices || []) {
      const match = chinese.find(voice => voice.name.toLocaleLowerCase().includes(preferredName.toLocaleLowerCase()));
      if (match) {
        lockedBrowserVoices.set(lockKey, match);
        return match;
      }
    }
    const genderPattern = profile.gender === 'female'
      ? /Xiao|Ting|Meijia|Sin-ji|Female|女/i
      : /Yun|Kangkang|Li-mu|Liang|Ming|Male|男|Daniel|Aaron/i;
    const match = chinese.find(voice => genderPattern.test(voice.name)) || chinese.find(voice => voice.localService) || chinese[0] || null;
    if (match) lockedBrowserVoices.set(lockKey, match);
    return match;
  }

  function clean(text) {
    return String(text || '')
      .replace(/（[^（）]*）/g, ' ')
      .replace(/\([^()]*\)/g, ' ')
      .replace(/[“”「」『』]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  async function endpointResolver(cue, profile) {
    if (!configured.endpoint) return null;
    const selectedVoice = cue.narrator
      ? (configured.narratorVoice || profile.voice || 'narrator')
      : (configured.characterVoices?.[cue.character] || profile.voice || cue.character || 'character');
    const response = await fetch(configured.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(configured.headers || {}) },
      body: JSON.stringify({
        text: cue.text,
        speaker: cue.speaker,
        character: cue.character,
        narrator: cue.narrator,
        kind: cue.kind,
        voice: selectedVoice,
        gender: profile.gender,
        tone: profile.tone,
        rate: profile.rate,
        pitch: profile.pitch,
        volume: profile.volume
      }),
      signal: cue.signal
    });
    if (!response.ok) throw new Error(`TTS request failed: ${response.status}`);
    const type = response.headers.get('content-type') || '';
    if (type.includes('application/json')) {
      const payload = await response.json();
      return payload.audioUrl || payload.url || null;
    }
    return response.blob();
  }

  function outputKey(cue, profile) {
    return JSON.stringify([cue.text, cue.narrator ? '旁白' : cue.character, profile.voice, profile.rate, profile.pitch, profile.volume]);
  }

  function readCachedOutput(key) {
    const output = outputCache.get(key);
    if (output) {
      outputCache.delete(key);
      outputCache.set(key, output);
    }
    return output || null;
  }

  function rememberOutput(key, output) {
    if (!output) return null;
    outputCache.delete(key);
    outputCache.set(key, output);
    while (outputCache.size > outputCacheLimit) outputCache.delete(outputCache.keys().next().value);
    return output;
  }

  function bakedKey(cue, profile) {
    const character = cue.narrator ? '旁白' : cue.character;
    return JSON.stringify([cue.text, character, profile.voice, profile.rate, profile.pitch, profile.volume]);
  }

  async function bakedOutput(cue, profile) {
    const manifest = bakedManifest || await bakedReady;
    const file = manifest[bakedKey(cue, profile)];
    if (!file) return null;
    const response = await fetch(file, { cache: 'force-cache' });
    if (!response.ok) return null;
    return response.blob();
  }

  async function outputForPlayback(cue, profile) {
    const key = outputKey(cue, profile);
    const cached = readCachedOutput(key);
    if (cached) return cached;
    if (pendingPreloads.has(key)) return pendingPreloads.get(key);
    return rememberOutput(key, await endpointResolver(cue, profile));
  }

  async function preload(input = {}) {
    if (input.enabled === false || input.kind === '演出提示') return null;
    const text = clean(input.text);
    if (!text) return null;
    await castReady;
    const profile = profileFor(input);
    const cue = { ...input, text, signal: undefined, voiceProfile: profile };
    const key = outputKey(cue, profile);
    const cached = readCachedOutput(key);
    if (cached) return cached;
    if (pendingPreloads.has(key)) return pendingPreloads.get(key);
    const pending = bakedOutput(cue, profile)
      .then(output => output || (configured.endpoint ? endpointResolver(cue, profile) : null))
      .then(output => rememberOutput(key, output))
      .catch(() => null)
      .finally(() => pendingPreloads.delete(key));
    pendingPreloads.set(key, pending);
    return pending;
  }

  function browserSpeak(cue, profile, hooks = {}, token = generation) {
    if (!speech || !window.SpeechSynthesisUtterance) {
      if (token === generation) hooks.onEnded?.();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(cue.text);
    utterance.lang = 'zh-CN';
    utterance.rate = profile.browserRate;
    utterance.pitch = profile.browserPitch;
    utterance.volume = profile.browserVolume * voiceGain();
    utterance.voice = voiceFor(profile);
    const pace = Number(profile.browserRate) > 0 ? Number(profile.browserRate) : 0.9;
    const estimated = Math.max(1600, cue.text.length * (230 / pace));
    let finished = false;
    let begun = 0;
    let lastChar = 0;
    const live = () => token === generation;
    const finish = () => {
      if (finished) return;
      finished = true;
      if (typeof window.clearInterval === 'function') window.clearInterval(ticker);
      if (!live()) return;
      hooks.onProgress?.(1);
      hooks.onEnded?.();
    };
    const report = () => {
      if (!live() || !begun) return;
      const timed = Math.min(0.98, (Date.now() - begun) / estimated);
      hooks.onProgress?.(Math.max(timed, lastChar));
    };
    const ticker = typeof window.setInterval === 'function' ? window.setInterval(report, 50) : 0;
    utterance.onstart = () => {
      begun = Date.now();
      report();
    };
    utterance.onboundary = event => {
      if (!live() || !Number.isFinite(event.charIndex) || !cue.text.length) return;
      const next = Math.min(0.98, event.charIndex / cue.text.length);
      if (next + 0.02 < lastChar) return;
      lastChar = Math.max(lastChar, next);
      if (!begun) begun = Date.now();
      report();
    };
    utterance.onend = finish;
    utterance.onerror = () => {
      if (!live()) {
        finished = true;
        if (typeof window.clearInterval === 'function') window.clearInterval(ticker);
        return;
      }
      finish();
    };
    speech.speak(utterance);
    window.setTimeout(finish, estimated + 1200);
  }

  function playPrepared(output, hooks = {}, token = generation) {
    const source = output instanceof Blob ? URL.createObjectURL(output) : String(output);
    const player = new Audio(source);
    player.volume = voiceGain();
    audio = player;
    audioObjectUrl = output instanceof Blob ? source : null;
    const live = () => token === generation && player === audio;
    const finish = () => {
      if (!live()) {
        releaseAudio(player);
        return;
      }
      hooks.onProgress?.(1);
      hooks.onEnded?.();
      releaseAudio(player);
    };
    const report = () => {
      if (!live() || !player.duration) return;
      hooks.onProgress?.(Math.min(0.99, player.currentTime / player.duration));
      if (!player.paused && !player.ended) window.requestAnimationFrame(report);
    };
    player.addEventListener('playing', () => window.requestAnimationFrame(report));
    player.addEventListener('timeupdate', report);
    player.addEventListener('ended', finish, { once: true });
    player.addEventListener('error', finish, { once: true });
    const playback = player.play();
    if (playback?.catch) playback.catch(() => finish());
  }

  async function speak(input = {}, hooks = {}) {
    stop();
    const onReady = typeof hooks.onReady === 'function' ? hooks.onReady : () => {};
    const onProgress = typeof hooks.onProgress === 'function' ? hooks.onProgress : () => {};
    const onEnded = typeof hooks.onEnded === 'function' ? hooks.onEnded : () => {};
    if (input.enabled === false || input.kind === '演出提示') {
      onReady({ hasAudio: false });
      onEnded();
      return;
    }
    const text = clean(input.text);
    if (!text) {
      onReady({ hasAudio: false });
      onEnded();
      return;
    }
    const token = generation;
    let lastProgress = 0;
    const reportProgress = progress => {
      const next = Math.max(lastProgress, Math.max(0, Math.min(1, Number(progress) || 0)));
      lastProgress = next;
      onProgress(next);
    };
    await castReady;
    if (token !== generation) return;
    const profile = profileFor(input);
    requestController = typeof AbortController === 'function' ? new AbortController() : null;
    const controller = requestController;
    const cue = { ...input, text, signal: controller?.signal, voiceProfile: profile };
    try {
      const key = outputKey(cue, profile);
      let baked = resolver ? null : readCachedOutput(key);
      if (!resolver && !baked && pendingPreloads.has(key)) baked = await pendingPreloads.get(key);
      if (!resolver && !baked) baked = await bakedOutput(cue, profile);
      if (token !== generation) return;
      if (baked && baked !== 'timeout' && baked !== 'aborted') rememberOutput(key, baked);
      const pending = baked
        ? Promise.resolve(baked)
        : resolver
          ? resolver(cue)
          : (configured.endpoint ? outputForPlayback(cue, profile) : Promise.resolve(null));
      const output = await Promise.race([pending.catch(() => null), wait(baked ? 20000 : 12000, controller?.signal)]);
      if (token !== generation) return;
      if (output && output !== 'timeout' && output !== 'aborted') {
        onReady({ hasAudio: true });
        playPrepared(output, { onProgress: reportProgress, onEnded }, token);
        if (requestController === controller) requestController = null;
        return;
      }
    } catch (error) {
      if (token !== generation) return;
      releaseAudio();
    }
    if (requestController === controller) requestController = null;
    if (token !== generation) return;
    onReady({ hasAudio: false });
    await wait(40);
    if (token !== generation) return;
    browserSpeak(cue, profile, { onProgress: reportProgress, onEnded }, token);
  }

  refreshVoices();
  if (speech && typeof speech.addEventListener === 'function') speech.addEventListener('voiceschanged', refreshVoices);
  else if (speech && 'onvoiceschanged' in speech) speech.onvoiceschanged = refreshVoices;
  window.addEventListener('pagehide', stop);
  window.shadowplayVoice = Object.freeze({
    get available() { return Boolean(speech || resolver || configured.endpoint || bakedManifest); },
    get castState() { return castState; },
    ready: castReady,
    getProfile(character = '旁白') { return profileFor({ character, narrator: character === '旁白' }); },
    setResolver(nextResolver) { resolver = typeof nextResolver === 'function' ? nextResolver : null; },
    preload,
    speak,
    stop
  });
})();
