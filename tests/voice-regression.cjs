const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const dataWindow = {};
const dataContext = vm.createContext({ window: dataWindow, Object, Array, String, Number, Boolean, Map, Set });
vm.runInContext(fs.readFileSync('canonical-story.js', 'utf8'), dataContext);
vm.runInContext(fs.readFileSync('story-branches.js', 'utf8'), dataContext);

const characterInfo = {
  ...dataWindow.canonicalShadowplayData.characterInfo,
  ...dataWindow.shadowplayBranchData.characterInfo
};
const cast = JSON.parse(fs.readFileSync('voice-cast.json', 'utf8'));
const profiles = cast.characters;
const requiredCharacters = ['旁白', ...Object.keys(characterInfo)];
const actualCharacters = Object.keys(profiles).sort((left, right) => left.localeCompare(right, 'zh-CN'));
requiredCharacters.forEach(character => {
  assert.ok(profiles[character], `${character} needs a voice profile`);
});
['白骨村姑', '白骨老妇', '白骨老翁'].forEach(character => {
  assert.ok(profiles[character], `${character} needs a disguise voice that matches age and gender`);
});

const femaleCharacters = new Set(['观音', '白骨', '铁扇', '王母', '女王', '白骨村姑', '白骨老妇']);
const allowedVoices = new Set([
  'zh-CN-XiaoxiaoNeural',
  'zh-CN-XiaoyiNeural',
  'zh-CN-YunjianNeural',
  'zh-CN-YunxiNeural',
  'zh-CN-YunxiaNeural',
  'zh-CN-YunyangNeural'
]);
const signatures = new Set();
Object.entries(profiles).forEach(([character, profile]) => {
  assert.ok(allowedVoices.has(profile.voice), `${character} uses an unavailable Mandarin neural voice`);
  assert.match(profile.rate, /^[+-]\d+%$/, `${character} needs a valid neural rate`);
  assert.match(profile.pitch, /^[+-]\d+Hz$/, `${character} needs a valid neural pitch`);
  assert.match(profile.volume, /^[+-]\d+%$/, `${character} needs a valid neural volume`);
  assert.ok(profile.tone && Array.isArray(profile.browserVoices) && profile.browserVoices.length, `${character} needs casting notes and browser fallbacks`);
  assert.ok(profile.browserRate >= 0.5 && profile.browserRate <= 1.5, `${character} browser rate is out of range`);
  assert.ok(profile.browserPitch >= 0.5 && profile.browserPitch <= 1.5, `${character} browser pitch is out of range`);
  const expectedGender = character === '群猴' ? 'mixed' : femaleCharacters.has(character) ? 'female' : 'male';
  assert.equal(profile.gender, expectedGender, `${character} voice gender does not match the role`);
  signatures.add(`${profile.voice}|${profile.rate}|${profile.pitch}`);
});
assert.equal(signatures.size, actualCharacters.length, 'every role needs a distinct neural voice signature');
assert.equal(profiles.旁白.voice, 'zh-CN-YunyangNeural', 'narrator must use the professional, reliable male voice');
assert.ok(Number.parseInt(profiles.悟空.pitch, 10) >= 20 && profiles.悟空.browserPitch >= 1.3, 'Wukong needs a distinctly sharp, high monkey-king voice');
assert.ok(Number.parseInt(profiles.旁白.pitch, 10) <= -15 && profiles.旁白.browserPitch <= 0.7, 'the narrator must remain clearly lower than character dialogue');

const runtimeSource = fs.readFileSync('shadowplay-runtime.js', 'utf8');
assert.doesNotMatch(runtimeSource, /下一幕(?:即将)?(?:开始|展开)/, 'transitions must not announce that the next scene is starting');
const indexSource = fs.readFileSync('index.html', 'utf8');
assert.match(indexSource, /endpoint: '\/api\/tts'/, 'the game must use the same-origin neural voice endpoint');
assert.match(indexSource, /castUrl: 'voice-cast\.json'/, 'the browser and server must share the voice cast');
assert.match(fs.readFileSync('requirements-voice.txt', 'utf8'), /^edge-tts==7\.2\.8\s*$/, 'the voice gateway dependency must be pinned');

const endpointRequests = [];
const spoken = [];
let endpointSucceeds = false;
const browserVoices = [
  { name: 'Microsoft Yunyang Online (Natural)', lang: 'zh-CN', localService: false },
  { name: 'Microsoft Yunjian Online (Natural)', lang: 'zh-CN', localService: false },
  { name: 'Microsoft Yunxi Online (Natural)', lang: 'zh-CN', localService: false },
  { name: 'Microsoft Yunxia Online (Natural)', lang: 'zh-CN', localService: false },
  { name: 'Microsoft Xiaoxiao Online (Natural)', lang: 'zh-CN', localService: false },
  { name: 'Microsoft Xiaoyi Online (Natural)', lang: 'zh-CN', localService: false }
];
class SpeechSynthesisUtterance {
  constructor(text) { this.text = text; }
}
const voiceListeners = {};
const speechSynthesis = {
  getVoices: () => browserVoices,
  speak: utterance => spoken.push(utterance),
  cancel() {},
  addEventListener(type, handler) {
    (voiceListeners[type] ||= []).push(handler);
  }
};
async function fakeFetch(url, options = {}) {
  if (url === 'voice-cast.json') {
    return { ok: true, json: async () => cast };
  }
  endpointRequests.push({ url, body: JSON.parse(options.body) });
  if (endpointSucceeds) {
    return {
      ok: true,
      headers: { get: () => 'audio/mpeg' },
      blob: async () => new Blob(['neural-audio'], { type: 'audio/mpeg' })
    };
  }
  return { ok: false, status: 503, headers: { get: () => '' } };
}
class AudioPlayer {
  constructor(source) { this.source = source; }
  addEventListener() {}
  pause() {}
  removeAttribute() {}
  load() {}
  async play() {}
}
const voiceWindow = {
  speechSynthesis,
  SpeechSynthesisUtterance,
  SHADOWPLAY_VOICE_CONFIG: { endpoint: '/api/tts', castUrl: 'voice-cast.json' },
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval,
  addEventListener() {}
};
const voiceContext = vm.createContext({
  window: voiceWindow,
  fetch: fakeFetch,
  SpeechSynthesisUtterance,
  AbortController,
  Blob,
  URL,
  Audio: AudioPlayer,
  Date,
  Object,
  Array,
  String,
  Number,
  Boolean,
  Set,
  console
});
vm.runInContext(fs.readFileSync('voice-adapter.js', 'utf8'), voiceContext);

(async () => {
  const voice = voiceWindow.shadowplayVoice;
  await voice.ready;
  assert.equal(voice.castState, 'ready', 'voice cast must load before the first spoken line');
  assert.equal(voice.getProfile('悟空').voice, profiles.悟空.voice);
  assert.equal(voice.getProfile('观音').gender, 'female');

  await voice.speak({ enabled: true, text: '俺老孙来也。', speaker: '孙悟空', character: '悟空', narrator: false, kind: '角色对白' });
  assert.match(spoken.at(-1).voice.name, /Yunxi/, 'Wukong browser fallback must keep a young male voice');
  assert.equal(endpointRequests.at(-1).body.voice, profiles.悟空.voice);
  assert.equal(endpointRequests.at(-1).body.gender, 'male');

  await voice.speak({ enabled: true, text: '“俺也去去探路。”（悟空握紧金箍棒，留心前方动静。）', speaker: '孙悟空', character: '悟空', narrator: false, kind: '角色对白' });
  assert.equal(endpointRequests.at(-1).body.text, '俺也去去探路。', 'neural speech must remove parenthesized action and psychology notes');
  assert.equal(spoken.at(-1).text, '俺也去去探路。', 'browser speech must remove parenthesized action and psychology notes');

  await voice.speak({ enabled: true, text: '且听众生心声。', speaker: '观音菩萨', character: '观音', narrator: false, kind: '角色对白' });
  assert.match(spoken.at(-1).voice.name, /Xiaoxiao/, 'Guanyin browser fallback must keep a warm female voice');
  assert.equal(endpointRequests.at(-1).body.voice, profiles.观音.voice);
  assert.equal(endpointRequests.at(-1).body.gender, 'female');

  await voice.speak({ enabled: true, text: '花果山风云初起。', speaker: '旁白', character: null, narrator: true, kind: '旁白' });
  assert.match(spoken.at(-1).voice.name, /Yunyang/, 'narrator fallback must keep the professional male voice');
  assert.equal(endpointRequests.at(-1).body.voice, profiles.旁白.voice);

  const requestCount = endpointRequests.length;
  const spokenCount = spoken.length;
  await voice.speak({ enabled: true, text: '（悟空立于幕左。）', character: '悟空', narrator: false, kind: '演出提示' });
  assert.equal(endpointRequests.length, requestCount, 'stage directions must not reach the neural endpoint');
  assert.equal(spoken.length, spokenCount, 'stage directions must not reach browser speech');

  endpointSucceeds = true;
  const preloadCue = { enabled: true, text: '预取下一句台词。', speaker: '孙悟空', character: '悟空', narrator: false, kind: '角色对白' };
  const requestsBeforePreload = endpointRequests.length;
  await voice.preload(preloadCue);
  assert.equal(endpointRequests.length, requestsBeforePreload + 1, 'preloading must request one neural audio asset');
  await voice.speak(preloadCue);
  assert.equal(endpointRequests.length, requestsBeforePreload + 1, 'playback must reuse prefetched neural audio');

  const spokenBeforeNeuralHit = spoken.length;
  await voice.speak({ enabled: true, text: '预取下一句台词。', speaker: '孙悟空', character: '悟空', narrator: false, kind: '角色对白' });
  assert.equal(spoken.length, spokenBeforeNeuralHit, 'available neural audio must not fall back to browser speech');

  browserVoices.splice(0, browserVoices.length,
    { name: 'Samantha', lang: 'en-US', localService: true },
    { name: 'Chinese Male A', lang: 'zh-CN', localService: true },
    { name: 'Chinese Male B', lang: 'zh-CN', localService: true }
  );
  endpointSucceeds = false;
  await voice.speak({ enabled: true, text: '俺老孙来也。', speaker: '孙悟空', character: '悟空', narrator: false, kind: '角色对白' });
  const lockedWukong = spoken.at(-1).voice;
  assert.equal(lockedWukong.lang, 'zh-CN', 'browser fallback must ignore non-Chinese default voices');
  browserVoices.reverse();
  (voiceListeners.voiceschanged || []).forEach(handler => handler());
  await voice.speak({ enabled: true, text: '俺老孙去也。', speaker: '孙悟空', character: '悟空', narrator: false, kind: '角色对白' });
  assert.equal(spoken.at(-1).voice, lockedWukong, 'the same role must keep one browser voice after the voice list changes');

  console.log(JSON.stringify({
    profiles: actualCharacters.length,
    storyCharacters: Object.keys(characterInfo).length,
    maleProfiles: Object.values(profiles).filter(profile => profile.gender === 'male').length,
    femaleProfiles: Object.values(profiles).filter(profile => profile.gender === 'female').length,
    mixedProfiles: Object.values(profiles).filter(profile => profile.gender === 'mixed').length,
    distinctVoiceSignatures: signatures.size,
    testedBrowserCasting: ['悟空:Yunxi', '观音:Xiaoxiao', '旁白:Yunyang'],
    neuralPrefetchCache: true,
    stageDirectionsUnvoiced: true,
    nextSceneAnnouncements: 0
  }, null, 2));
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
