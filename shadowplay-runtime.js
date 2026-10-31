(() => {
  'use strict';

  const $ = selector => document.querySelector(selector);
  const app = $('#app');
  const stageBackdrop = $('#stageBackdrop');
  const leftActor = $('#actorLeft');
  const rightActor = $('#actorRight');
  const interlude = $('#interlude');
  const interludeAdvance = $('#interludeAdvance');
  const sceneCurtain = $('#sceneCurtain');
  const dialogueRegion = $('#dialogueDeck');
  const dialogueDeck = $('.dialogue-inner');
  const storageKey = 'xixing-stage-save';
  const runtimeVersion = 16;
  const narrativeVersion = 7;
  const canonical = window.canonicalShadowplayData;
  if (!canonical) throw new Error('Missing canonical story data.');
  const branch = window.shadowplayBranchData || {};
  const data = window.__shadowplayData = Object.freeze({
    ...canonical,
    characterInfo: Object.freeze({ ...(canonical.characterInfo || {}), ...(branch.characterInfo || {}) })
  });

  const defaultArt = {
    石猴: 'assets/characters/stone-monkey-bust-neutral.png',
    悟空: 'assets/characters/wukong-bust-neutral.png',
    玄奘: 'assets/characters/tang-bust-neutral.png',
    八戒: 'assets/characters/bajie-bust-neutral.png',
    悟净: 'assets/characters/sha-bust-neutral.png',
    妖: 'assets/characters/black-bear-bust-neutral.png',
    菩提: 'assets/characters/bodhi-bust-neutral.png',
    观音: 'assets/characters/guanyin-bust-neutral.png',
    如来: 'assets/characters/tathagata-bust-neutral.png',
    白骨: 'assets/characters/white-bone-bust-sly.png',
    红孩: 'assets/characters/red-boy-bust-defiant.png',
    铁扇: 'assets/characters/iron-fan-bust-angry.png',
    牛魔: 'assets/characters/bull-demon-bust-angry.png',
    群猴: 'assets/characters/monkey-clan/water-curtain-cheering-portrait.png',
    龙王: 'assets/characters/dragon-king/audience-worried-portrait.png',
    阎王: 'assets/characters/yama/alarmed-ledger-portrait.png',
    太白: 'assets/characters/taibai-jinxing/diplomatic-portrait.png',
    玉帝: 'assets/characters/jade-emperor/concerned-court-portrait.png',
    王母: 'assets/characters/queen-mother/stern-command-portrait.png',
    哪吒: 'assets/characters/nezha/battle-ready-portrait.png',
    李靖: 'assets/characters/li-jing/command-portrait.png',
    二郎: 'assets/characters/erlang-shen/tactical-guard-portrait.png',
    老君: 'assets/characters/taishang-laojun/empty-gourd-portrait.png',
    唐王: 'assets/characters/tang-emperor/court-worried.png',
    魏征: 'assets/characters/wei-zheng/dream-duty-stern-portrait.png',
    白龙: 'assets/characters/white-dragon/eagle-sorrow-defiant-portrait.png',
    金池: 'assets/characters/jinchi/relic-greed-portrait.png',
    女王: 'assets/characters/daughter-queen/farewell-tender-portrait.png',
    六耳: 'assets/characters/six-eared/impostor-sly-portrait.png',
    镇元: 'assets/characters/zhenyuan/tree-fallen-stern-portrait.png',
    老鼋: 'assets/characters/old-turtle/promise-broken-angry-portrait.png'
  };

  const actorFrame = (mode, scale, x = 0, y = 0) => Object.freeze({ mode, scale, x, y });
  const actorFraming = Object.freeze({
    'assets/characters/bajie-bust-neutral.png': actorFrame('close', 0.85),
    'assets/characters/bajie/pilgrim/cheerful.png': actorFrame('full', 1.12),
    'assets/characters/bajie/pilgrim/protective.png': actorFrame('full', 1.12),
    'assets/characters/bajie/pilgrim/worried-portrait.png': actorFrame('full', 1.12),
    'assets/characters/black-bear-bust-neutral.png': actorFrame('half', 1.12),
    'assets/characters/bodhi-bust-neutral.png': actorFrame('half', 1.16),
    'assets/characters/bull-demon-bust-angry.png': actorFrame('close', 0.85),
    'assets/characters/daughter-queen/farewell-tender-portrait.png': actorFrame('full', 1.24),
    'assets/characters/dragon-king/audience-worried-portrait.png': actorFrame('full', 1.26),
    'assets/characters/erlang-shen/tactical-guard-portrait.png': actorFrame('full', 1.16, 0, 1),
    'assets/characters/guanyin-bust-neutral.png': actorFrame('close', 0.85),
    'assets/characters/iron-fan-bust-angry.png': actorFrame('close', 0.85),
    'assets/characters/jade-emperor/concerned-court-portrait.png': actorFrame('full', 1.22),
    'assets/characters/jinchi/relic-greed-portrait.png': actorFrame('close', 0.85),
    'assets/characters/li-jing/command-portrait.png': actorFrame('full', 1.16, 0, 1),
    'assets/characters/monkey-clan/water-curtain-cheering-portrait.png': actorFrame('wide', 0.88),
    'assets/characters/nezha/battle-ready-portrait.png': actorFrame('full', 1.16),
    'assets/characters/old-turtle/promise-broken-angry-portrait.png': actorFrame('wide', 0.86),
    'assets/characters/queen-mother/stern-command-portrait.png': actorFrame('full', 1.24),
    'assets/characters/red-boy-bust-defiant.png': actorFrame('close', 0.85),
    'assets/characters/sha-bust-neutral.png': actorFrame('close', 0.85),
    'assets/characters/sha/pilgrim/guard.png': actorFrame('full', 1.12),
    'assets/characters/sha/pilgrim/thoughtful-portrait.png': actorFrame('full', 1.12),
    'assets/characters/sha/pilgrim/wounded.png': actorFrame('full', 1.12),
    'assets/characters/six-eared/impostor-sly-portrait.png': actorFrame('close', 0.85),
    'assets/characters/stone-monkey-bust-neutral.png': actorFrame('close', 0.85),
    'assets/characters/taibai-jinxing/diplomatic-portrait.png': actorFrame('full', 1.24),
    'assets/characters/taishang-laojun/empty-gourd-portrait.png': actorFrame('full', 1.22),
    'assets/characters/tang-bust-neutral.png': actorFrame('half', 1.08),
    'assets/characters/tang-emperor/court-worried.png': actorFrame('half', 1.06),
    'assets/characters/tang-vow.png': actorFrame('full', 1.12),
    'assets/characters/tang/pilgrim/relieved.png': actorFrame('half', 1.08),
    'assets/characters/tang/pilgrim/stern.png': actorFrame('half', 1.08, -2),
    'assets/characters/tang/pilgrim/worried.png': actorFrame('half', 1.08),
    'assets/characters/tathagata-bust-neutral.png': actorFrame('close', 0.85),
    'assets/characters/wei-zheng/dream-duty-stern-portrait.png': actorFrame('half', 1.12),
    'assets/characters/white-bone-bust-sly.png': actorFrame('close', 0.85),
    'assets/characters/white-bone/disguises/maiden-offering.png': actorFrame('half', 1.12),
    'assets/characters/white-bone/disguises/old-man-accusing.png': actorFrame('full', 1.12),
    'assets/characters/white-bone/disguises/old-woman-accusing.png': actorFrame('full', 1.12),
    'assets/characters/white-bone/true-form-reveal-portrait.png': actorFrame('half', 1.08),
    'assets/characters/white-dragon/eagle-sorrow-defiant-portrait.png': actorFrame('wide', 0.9, -2),
    'assets/characters/wukong-bust-neutral.png': actorFrame('close', 0.85),
    'assets/characters/wukong-imprisoned.png': actorFrame('scene-prop', 1, 0, 0),
    'assets/characters/wukong-released.png': actorFrame('full', 1.12),
    'assets/characters/wukong/disciple-no-circlet/alert.png': actorFrame('half', 1.04),
    'assets/characters/wukong/disciple-no-circlet/humble.png': actorFrame('half', 1.04),
    'assets/characters/wukong/disciple-no-circlet/neutral.png': actorFrame('half', 1.04),
    'assets/characters/wukong/great-sage/defiant-portrait.png': actorFrame('full', 1.12),
    'assets/characters/wukong/great-sage/neutral-portrait.png': actorFrame('full', 1.12),
    'assets/characters/wukong/monkey-king-no-circlet/determined.png': actorFrame('full', 1.12),
    'assets/characters/wukong/monkey-king-no-circlet/neutral.png': actorFrame('full', 1.12, 3),
    'assets/characters/wukong/mountain-prison-no-circlet/relieved.png': actorFrame('full', 1.12),
    'assets/characters/wukong/pilgrim-circlet/angry-strike.png': actorFrame('full', 1.12),
    'assets/characters/wukong/pilgrim-circlet/pained-recoil.png': actorFrame('full', 1.12),
    'assets/characters/wukong/pilgrim-circlet/thoughtful.png': actorFrame('full', 1.12, 1),
    'assets/characters/wukong/stone-child/determined.png': actorFrame('half', 1.02),
    'assets/characters/wukong/stone-child/neutral.png': actorFrame('half', 1.02),
    'assets/characters/wukong/stone-child/thoughtful.png': actorFrame('half', 1.02, 2),
    'assets/characters/yama/alarmed-ledger-portrait.png': actorFrame('full', 1.22),
    'assets/characters/zhenyuan/tree-fallen-stern-portrait.png': actorFrame('half', 1.08)
  });
  const defaultActorFrame = actorFrame('half', 1);

  const sceneArt = data.sceneArt;
  const sceneScripts = Object.freeze({ ...(data.sceneScripts || {}), ...(branch.sceneScripts || {}) });
  const sceneBackdrops = Object.freeze({ ...(data.sceneBackdrops || {}), ...(branch.sceneBackdrops || {}) });
  const sceneMeta = data.sceneMeta;
  const sceneCast = data.sceneCast;
  const actorPresentation = data.actorPresentation;
  const periodArt = branch.periodArt || {};
  const transitionArt = branch.transitionArt || {};
  const castOverrides = branch.castOverrides || {};
  const branchEchoes = branch.branchEchoes || {};
  const miniGames = branch.miniGames || {};
  const relationDefaults = branch.relationDefaults || {};
  const routeDefaults = branch.routeDefaults || { defiance: 0, bond: 0, discipline: 0, insight: 0 };
  const partnerOrder = {
    石猴: ['悟空', '玄奘', '八戒'],
    悟空: ['玄奘', '悟净', '八戒'],
    玄奘: ['悟空', '悟净', '八戒'],
    八戒: ['悟空', '玄奘', '悟净'],
    悟净: ['玄奘', '悟空', '八戒'],
    妖: ['悟空', '玄奘', '悟净'],
    菩提: ['石猴', '悟空'],
    观音: ['玄奘', '悟净', '悟空'],
    如来: ['悟空', '玄奘'],
    白骨: ['悟空', '玄奘'],
    红孩: ['悟空', '八戒'],
    铁扇: ['悟空', '八戒'],
    牛魔: ['悟空', '八戒'],
    唐王: ['魏征', '玄奘', '观音'],
    魏征: ['唐王', '玄奘', '阎王'],
    白龙: ['悟空', '玄奘', '观音'],
    金池: ['玄奘', '悟空', '妖'],
    女王: ['玄奘', '八戒', '悟空'],
    六耳: ['悟空', '玄奘', '如来'],
    镇元: ['悟空', '玄奘', '八戒'],
    老鼋: ['玄奘', '悟净', '悟空']
  };
  const traitMeta = Object.freeze({
    resolve: Object.freeze({ label: '勇决', seal: '勇' }),
    mercy: Object.freeze({ label: '慈念', seal: '慈' }),
    insight: Object.freeze({ label: '悟见', seal: '悟' })
  });
  const routeMeta = Object.freeze({
    defiance: Object.freeze({ label: '反骨', seal: '反', angle: 0 }),
    bond: Object.freeze({ label: '同心', seal: '同', angle: 90 }),
    discipline: Object.freeze({ label: '守戒', seal: '戒', angle: 180 }),
    insight: Object.freeze({ label: '照见', seal: '照', angle: 270 })
  });
  const expressionLabels = Object.freeze({
    calm: '沉静',
    alert: '警觉',
    angry: '盛怒',
    pained: '负伤',
    worried: '忧惧',
    surprised: '惊诧',
    thoughtful: '沉思',
    determined: '决意',
    sly: '试探',
    relieved: '释然'
  });
  const actionLabels = Object.freeze({
    idle: '待机',
    listen: '观察',
    advance: '前进',
    guard: '防守',
    strike: '攻击',
    recoil: '受击',
    consider: '思考',
    startle: '警戒',
    withdraw: '撤退',
    bow: '行礼',
    celebrate: '庆祝'
  });
  const sceneTotal = data.chapterData.reduce((total, chapter) => total + chapter.trials.length, 0);
  const lastSceneIndex = sceneTotal - 1;
  const clampInteger = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, Math.trunc(Number(value) || 0)));
  const clamp01 = value => Math.max(0, Math.min(1, Number(value)));
  const playModes = new Set(['interlude', 'story', 'choices', 'response']);
  const indexFor = (chapter, trial) => clampInteger(chapter, 0, data.chapterData.length - 1) * 9 + clampInteger(trial, 0, 8);
  const positionFor = index => ({ chapter: Math.floor(clampInteger(index, 0, lastSceneIndex) / 9), trial: clampInteger(index, 0, lastSceneIndex) % 9 });

  let saved = {};
  let storageAccessible = true;
  let rawSave = '{}';
  try {
    rawSave = localStorage.getItem(storageKey) || '{}';
  } catch (error) {
    storageAccessible = false;
  }
  try { saved = JSON.parse(rawSave) || {}; } catch (error) {}
  const hasCanonicalSave = Number(saved.narrativeVersion) === narrativeVersion;
  const savedChapter = hasCanonicalSave ? clampInteger(saved.chapter, 0, data.chapterData.length - 1) : 0;
  const savedTrial = hasCanonicalSave ? clampInteger(saved.trial, 0, 8) : 0;

  const normalizeTrait = trait => trait === 'discipline' ? 'insight' : (traitMeta[trait] ? trait : 'insight');
  const generatedRouteByTrait = Object.freeze({ resolve: 'defiance', mercy: 'bond', insight: 'insight' });
  const playerCharacters = new Set(['石猴', '悟空']);
  const isPlayerCharacter = character => playerCharacters.has(character);

  function castForPosition(chapter, trial) {
    const key = `${chapter}:${trial}`;
    const cast = castOverrides[key] || sceneCast[key] || [];
    return Array.isArray(cast) ? cast : [];
  }

  function playerForPosition(chapter, trial) {
    return castForPosition(chapter, trial).find(isPlayerCharacter) || null;
  }

  function isPlayerScene(chapter, trial) {
    return Boolean(playerForPosition(chapter, trial));
  }

  function choicesForPosition(chapter, trial) {
    const key = `${chapter}:${trial}`;
    if (!isPlayerScene(chapter, trial)) return [];
    const specific = branch.sceneChoices?.[key];
    if (Array.isArray(specific)) return specific;
    const variants = data.choiceVariants || data.actionSets.map(set => set.map((text, index) => ({
      label: ['迎击', '护住', '察看'][index],
      trait: ['resolve', 'mercy', 'insight'][index],
      text,
      outcome: text
    })));
    const sceneIndex = indexFor(chapter, trial);
    const set = variants[(sceneIndex * 5 + chapter + trial) % variants.length];
    const count = 3 + ((sceneIndex + chapter) % 2);
    const trialInfo = data.chapterData[chapter]?.trials[trial] || ['这一难', '', null];
    const cast = castOverrides[key] || sceneCast[key] || [];
    const partners = partnerOrder[trialInfo[2]] || [];
    const focus = cast.find(character => character !== trialInfo[2])
      || partners[(sceneIndex + trial) % Math.max(1, partners.length)]
      || null;
    const focusName = data.characterInfo[focus]?.name || focus;
    return set.slice(0, Math.min(count, set.length)).map((option, index) => {
      const silent = count === 4 && index === count - 1;
      const trait = silent ? 'insight' : normalizeTrait(option.trait);
      const route = silent ? 'discipline' : generatedRouteByTrait[trait];
      const relationDelta = silent ? -1 : route === 'bond' ? 2 : route === 'insight' ? 1 : -1;
      const label = silent ? '沉默不语' : option.label;
      const text = silent
        ? `不立即回应，让“${trialInfo[0]}”的余音先落在众人之间。`
        : option.text;
      const outcome = silent
        ? `${trialInfo[0]}没有立刻得到答复；这份沉默换来克制，也让${focusName || '同行者'}无法确认你的立场。`
        : route === 'defiance'
          ? `你以“${label}”强行改变了${trialInfo[0]}的局势。险路被推开，${focusName || '同行者'}却对这份强硬保留意见。`
          : route === 'bond'
            ? `你以“${label}”先接住身边的人。${trialInfo[0]}因此少了一分损伤，${focusName || '同行者'}更愿意与你并肩。`
            : `你以“${label}”看清了一处被忽略的因由。${trialInfo[0]}没有照原来的方式收场，后路也因此改变。`;
      const feedback = focusName
        ? silent
          ? `${focusName}没有看懂你的沉默`
          : route === 'bond'
            ? `${focusName}对你的信赖上升`
            : route === 'insight'
              ? `${focusName}认可了你的判断`
              : `${focusName}不认同你的强硬做法`
        : `这次决定使“${route === 'defiance' ? '抗命' : route === 'bond' ? '同心' : route === 'discipline' ? '持戒' : '悟见'}”路线发生变化`;
      return {
        ...option,
        id: `generated-${chapter}-${trial}-${silent ? 'silent' : index}`,
        label,
        trait,
        text,
        outcome,
        feedback,
        relations: focus ? { [focus]: relationDelta } : {},
        routes: { [route]: 2 },
        flags: { [`decision_${chapter}_${trial}`]: route },
        action: silent ? 'listen' : route === 'defiance' ? 'advance' : route === 'bond' ? 'guard' : 'consider'
      };
    });
  }

  function timedSilenceOption(chapter, trial) {
    const key = `${chapter}:${trial}`;
    const scene = data.chapterData[chapter]?.trials[trial] || ['眼前这一难'];
    const cast = castOverrides[key] || sceneCast[key] || [];
    const companion = cast.find(character => data.characterInfo[character] && !isPlayerCharacter(character)) || null;
    const name = data.characterInfo[companion]?.name || '同行者';
    const variant = indexFor(chapter, trial) % 3;
    return Object.freeze({
      id: `timed-silence-${chapter}-${trial}`,
      label: '保持沉默',
      trait: 'insight',
      text: '没有立即回答，只观察对方接下来的反应。',
      outcome: variant === 0
        ? `${name}没有等到答复，一时无法判断你的立场。`
        : variant === 1
          ? `短暂的沉默让争执缓了下来，但${scene[0]}仍需要一个明确决定。`
          : `你没有表态，局势按照原来的方向继续发展。`,
      feedback: variant === 0 && companion ? `${name}对你的沉默感到不解` : '',
      relations: variant === 0 && companion ? Object.freeze({ [companion]: -1 }) : Object.freeze({}),
      flags: Object.freeze({ [`timedSilence_${chapter}_${trial}`]: true }),
      routes: variant === 1 ? Object.freeze({ discipline: 1 }) : Object.freeze({}),
      action: 'listen',
      timedOut: true
    });
  }

  function sanitizeMarks(rawMarks) {
    if (!Array.isArray(rawMarks)) return [];
    const unique = new Map();
    rawMarks.forEach(mark => {
      const chapter = Number(mark?.chapter);
      const trial = Number(mark?.trial);
      const choice = Number(mark?.choice);
      if (!Number.isInteger(chapter) || !Number.isInteger(trial) || !Number.isInteger(choice)) return;
      const choices = choicesForPosition(chapter, trial);
      const timedSilence = choice === -1 && String(mark?.optionId || '').startsWith('timed-silence-');
      if (chapter < 0 || chapter >= data.chapterData.length || trial < 0 || trial > 8 || (!timedSilence && (choice < 0 || choice >= choices.length))) return;
      const scene = data.chapterData[chapter]?.trials[trial];
      if (!scene) return;
      const option = timedSilence ? timedSilenceOption(chapter, trial) : choices[choice];
      const relations = Object.fromEntries(Object.entries(option.relations || {})
        .filter(([, amount]) => timedSilence || Math.abs(Number(amount) || 0) >= 2));
      unique.set(`${chapter}:${trial}`, {
        chapter,
        trial,
        choice,
        optionId: option.id || `choice-${choice}`,
        trait: normalizeTrait(option.trait),
        label: scene[0],
        text: option.text,
        outcome: option.outcome || option.text,
        feedback: timedSilence || Object.keys(relations).length ? option.feedback || '' : '',
        relations,
        flags: option.flags || {},
        routes: option.routes || {}
      });
    });
    return [...unique.values()].sort((left, right) => indexFor(left.chapter, left.trial) - indexFor(right.chapter, right.trial));
  }

  function sanitizeMiniGameResults(rawResults) {
    if (!rawResults || typeof rawResults !== 'object' || Array.isArray(rawResults)) return {};
    return Object.fromEntries(Object.entries(rawResults).flatMap(([key, result]) => {
      const game = miniGames[key];
      const [chapter, trial] = key.split(':').map(Number);
      if (!game || !isPlayerScene(chapter, trial) || !result || typeof result !== 'object') return [];
      const skipped = result.skipped === true;
      const version = Number(result.version) === 2 ? 2 : 1;
      const grade = ['S', 'A', 'B', 'C', 'D'].includes(result.grade) ? result.grade : 'D';
      const metrics = result.metrics && typeof result.metrics === 'object' && !Array.isArray(result.metrics)
        ? Object.fromEntries(Object.entries(result.metrics).flatMap(([metric, value]) => {
          if (typeof value === 'boolean') return [[metric, value]];
          const numeric = Number(value);
          return Number.isFinite(numeric) ? [[metric, numeric]] : [];
        }))
        : {};
      return [[key, {
        version,
        skipped,
        rewarded: !skipped && result.rewarded === true,
        score: clampInteger(result.score, 0, miniGameScoreLimit(game)),
        grade,
        rating: clampInteger(result.rating, 0, 100),
        metrics
      }]];
    }));
  }

  const savedMarks = hasCanonicalSave ? sanitizeMarks(saved.marks) : [];
  const hasFinalMark = savedMarks.some(mark => mark.chapter === data.chapterData.length - 1 && mark.trial === 8);
  const markedFurthest = savedMarks.reduce((furthest, mark) => Math.max(furthest, indexFor(mark.chapter, mark.trial)), 0);
  const savedFurthest = hasCanonicalSave && Number.isFinite(Number(saved.furthestScene))
    ? clampInteger(saved.furthestScene, 0, lastSceneIndex)
    : indexFor(savedChapter, savedTrial);
  const state = {
    chapter: savedChapter,
    trial: savedTrial,
    furthestScene: Math.max(savedFurthest, markedFurthest, indexFor(savedChapter, savedTrial)),
    resolve: 0,
    mercy: 0,
    insight: 0,
    marks: savedMarks,
    relationships: {},
    flags: {},
    routeScores: {},
    decisionHistory: [],
    completedMiniGames: hasCanonicalSave ? sanitizeMiniGameResults(saved.completedMiniGames) : {},
    filletWorn: false,
    sound: saved.sound !== false,
    musicVolume: Number.isFinite(Number(saved.musicVolume)) && ![0.45, 0.16, 0.1].includes(Number(saved.musicVolume)) ? clamp01(saved.musicVolume) : 0.2,
    sfxVolume: Number.isFinite(Number(saved.sfxVolume)) && ![0.8, 0.32].includes(Number(saved.sfxVolume)) ? clamp01(saved.sfxVolume) : 0.2,
    voiceVolume: Number.isFinite(Number(saved.voiceVolume)) ? clamp01(saved.voiceVolume) : 0.92,
    auto: false,
    mode: hasCanonicalSave && playModes.has(saved.mode) ? saved.mode : 'interlude',
    lineIndex: hasCanonicalSave ? clampInteger(saved.lineIndex, 0, 48) : 0,
    pendingChoice: hasCanonicalSave && Number.isInteger(saved.pendingChoice) ? saved.pendingChoice : null,
    runtimeVersion,
    completed: hasCanonicalSave && saved.completed === true && savedChapter === data.chapterData.length - 1 && savedTrial === 8 && hasFinalMark
  };
  let autoTimer = null;
  let lineRevealToken = 0;
  let choiceTimer = null;
  let choiceTicker = null;
  let choiceDeadline = 0;
  let pendingResponseOption = null;
  const choiceTimeLimit = 10000;
  let transitioning = false;
  let audioContext = null;
  let audioMaster = null;
  let bgmPlayer = null;
  let bgmSource = '';
  let bgmFadeTimer = null;
  let bgmFadeToken = 0;
  const bgmTracks = Object.freeze([
    'assets/audio/bgm/vol-01-huaguo.mp3',
    'assets/audio/bgm/vol-02-qitian.mp3',
    'assets/audio/bgm/vol-03-dongtu.mp3',
    'assets/audio/bgm/vol-04-gui-zheng.mp3',
    'assets/audio/bgm/vol-05-baigu.mp3',
    'assets/audio/bgm/vol-06-huoyun.mp3',
    'assets/audio/bgm/vol-07-tongtian.mp3',
    'assets/audio/bgm/vol-08-huoyan.mp3',
    'assets/audio/bgm/vol-09-lingshan.mp3'
  ]);
  let pauseFocusReturn = null;
  let overlayFocusReturn = null;
  let skipFocusReturn = null;
  let miniGameFocusReturn = null;
  let confirmationFocusReturn = null;
  let confirmationAction = null;
  let miniGameState = null;
  let miniGameSession = null;
  let miniGameFrame = null;
  const miniGameTimers = new Set();
  let miniGameDisposers = [];
  let initialInterlude = true;
  let activeMarkLimit = indexFor(savedChapter, savedTrial) - 1;
  let saveSucceeded = storageAccessible;

  function sceneIndexFromKey(key) {
    const [chapter, trial] = String(key).split(':').map(Number);
    if (!Number.isInteger(chapter) || !Number.isInteger(trial)) return lastSceneIndex + 1;
    return indexFor(chapter, trial);
  }

  function recalculateScores(throughScene = lastSceneIndex, miniGameThroughScene = throughScene) {
    const markLimit = clampInteger(throughScene, -1, lastSceneIndex);
    const miniGameLimit = clampInteger(miniGameThroughScene, -1, lastSceneIndex);
    activeMarkLimit = markLimit;
    state.resolve = 0;
    state.mercy = 0;
    state.insight = 0;
    state.relationships = Object.fromEntries(Object.entries(relationDefaults)
      .filter(([character]) => !isPlayerCharacter(character))
      .map(([character, value]) => [character, Number(value) || 0]));
    state.flags = {};
    state.routeScores = Object.fromEntries(Object.entries(routeDefaults).map(([route, value]) => [route, Number(value) || 0]));
    state.filletWorn = false;
    state.marks.filter(mark => indexFor(mark.chapter, mark.trial) <= markLimit).forEach(mark => {
      const trait = normalizeTrait(mark.trait || ['resolve', 'mercy', 'insight'][mark.choice]);
      state[trait] += 1;
      Object.entries(mark.relations || {}).forEach(([character, amount]) => {
        if (isPlayerCharacter(character)) return;
        state.relationships[character] = (state.relationships[character] || 0) + (Number(amount) || 0);
      });
      Object.entries(mark.flags || {}).forEach(([flag, value]) => { state.flags[flag] = value; });
      Object.entries(mark.routes || {}).forEach(([route, amount]) => { state.routeScores[route] = (state.routeScores[route] || 0) + (Number(amount) || 0); });
    });
    Object.entries(state.completedMiniGames || {}).forEach(([key, result]) => {
      if (!result?.rewarded || sceneIndexFromKey(key) > miniGameLimit) return;
      const reward = miniGames[key]?.reward || {};
      Object.entries(reward.relations || {}).forEach(([character, amount]) => {
        if (isPlayerCharacter(character)) return;
        state.relationships[character] = (state.relationships[character] || 0) + (Number(amount) || 0);
      });
      Object.entries(reward.routes || {}).forEach(([route, amount]) => { state.routeScores[route] = (state.routeScores[route] || 0) + (Number(amount) || 0); });
      Object.entries(reward.flags || {}).forEach(([flag, value]) => { state.flags[flag] = value; });
      if (result.version === 2 && ['S', 'A'].includes(result.grade)) {
        const mastery = miniGames[key]?.masteryReward || {};
        Object.entries(mastery.relations || {}).forEach(([character, amount]) => {
          if (isPlayerCharacter(character)) return;
          state.relationships[character] = (state.relationships[character] || 0) + (Number(amount) || 0);
        });
        Object.entries(mastery.routes || {}).forEach(([route, amount]) => { state.routeScores[route] = (state.routeScores[route] || 0) + (Number(amount) || 0); });
        Object.entries(mastery.flags || {}).forEach(([flag, value]) => { state.flags[flag] = value; });
      }
    });
    state.filletWorn = Boolean(state.flags.filletWorn);
    state.decisionHistory = state.marks
      .filter(mark => indexFor(mark.chapter, mark.trial) <= activeMarkLimit)
      .map(mark => ({ key: `${mark.chapter}:${mark.trial}`, optionId: mark.optionId, outcome: mark.outcome }));
  }

  recalculateScores(indexFor(savedChapter, savedTrial) - 1);

  function save() {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ ...state, narrativeVersion }));
      saveSucceeded = true;
    } catch (error) {
      saveSucceeded = false;
    }
  }

  function currentChapter() { return data.chapterData[state.chapter]; }
  function currentTrial() { return currentChapter().trials[state.trial]; }
  function currentKey() { return `${state.chapter}:${state.trial}`; }
  function trialNumber() { return state.chapter * 9 + state.trial + 1; }
  function currentSceneIndex() { return indexFor(state.chapter, state.trial); }
  function nextPlayerSceneIndex(fromIndex = currentSceneIndex()) {
    for (let sceneIndex = Math.max(0, fromIndex); sceneIndex <= lastSceneIndex; sceneIndex += 1) {
      const position = positionFor(sceneIndex);
      if (isPlayerScene(position.chapter, position.trial)) return sceneIndex;
    }
    return null;
  }
  function currentMark() { return state.marks.find(mark => mark.chapter === state.chapter && mark.trial === state.trial) || null; }
  function currentMeta() { return { ...currentChapter(), ...(sceneMeta[currentKey()] || {}) }; }
  function currentChoices() { return choicesForPosition(state.chapter, state.trial); }
  function routeRanking() {
    return Object.keys(routeMeta)
      .map(route => [route, Number(state.routeScores[route]) || 0])
      .sort((left, right) => right[1] - left[1]);
  }
  function partnerFor(speaker, offset = state.trial) {
    return (partnerOrder[speaker] || partnerOrder.悟空)[Math.abs(offset) % 3];
  }

  function echoMatches(when = {}) {
    if (when.flag) {
      const [flag, expected] = when.flag;
      if (state.flags[flag] !== expected) return false;
    }
    if (when.route) {
      const [route, minimum] = when.route;
      if ((state.routeScores[route] || 0) < Number(minimum || 0)) return false;
    }
    if (when.relation) {
      const [character, threshold] = when.relation;
      const value = state.relationships[character] || 0;
      if (Number(threshold) < 0 ? value > Number(threshold) : value < Number(threshold)) return false;
    }
    return true;
  }

  function injectBranchEchoes(sceneLines, key) {
    const echoes = (branchEchoes[key] || [])
      .filter(entry => echoMatches(entry.when) && entry.line?.kind !== '心理活动')
      .map(entry => ({ ...entry.line }));
    if (!echoes.length) return sceneLines;
    const transitionIndex = sceneLines.findIndex(line => line.kind === '转场字幕');
    const insertAt = transitionIndex === -1 ? sceneLines.length : transitionIndex;
    return [...sceneLines.slice(0, insertAt), ...echoes, ...sceneLines.slice(insertAt)];
  }

  function hasReadableCopy(text) {
    return Boolean(String(text || '').replace(/[.…·。\s“”'"]/g, ''));
  }

  function spokenKey(text) {
    return String(text || '').replace(/[“”‘’"'（）()\s]/g, '').replace(/[。！？、，；：…·]/g, '');
  }

  function isFreshSpoken(text, banned = []) {
    const key = spokenKey(text);
    return key.length >= 4 && banned.every(entry => spokenKey(entry) !== key);
  }

  function normalize(lines) {
    const readable = lines.filter(line => hasReadableCopy(line?.text));
    return readable.map((line, index) => {
      const kind = line.kind === '旁白'
        ? (index === 0 ? '场景字幕' : index === readable.length - 1 ? '转场字幕' : '场景讲解')
        : line.kind === '对白' ? '角色对白' : line.kind;
      return { ...line, kind };
    });
  }

  const lineKindLabels = Object.freeze({
    场景字幕: '任务',
    场景讲解: '剧情',
    角色对白: '对话',
    角色回应: '回应',
    转场字幕: '进展',
    行动抉择: '选择行动',
    玩家行动: '你的行动',
    行动结果: '行动结果',
    关系变化: '关系变化',
    心理活动: '心念',
    旅痕回声: '过往影响'
  });

  function playerClosing(choice, banned = []) {
    if (isFreshSpoken(choice?.reply, banned)) return choice.reply;
    return '';
  }

  function storyLines() {
    const key = currentKey();
    let sceneLines;
    if (sceneScripts[key]) sceneLines = normalize(sceneScripts[key]);
    const trial = currentTrial();
    const beat = window.sceneNarratives?.[key];
    const speaker = trial[2];
    const replySpeaker = beat?.replySpeaker || partnerFor(speaker);
    if (!sceneLines && beat) sceneLines = [
        { kind: '场景字幕', speaker: null, text: `${trial[0]}。${trial[1]}` },
        { kind: '场景讲解', speaker: null, text: beat.context },
        { kind: '角色对白', speaker, text: beat.lead },
        { kind: '角色对白', speaker: replySpeaker, text: beat.reply },
        { kind: '角色对白', speaker, text: beat.resolve },
        { kind: '转场字幕', speaker: null, text: beat.outro }
      ];
    if (!sceneLines) sceneLines = [
        { kind: '场景字幕', speaker: null, text: `${trial[0]}。${trial[1]}` },
        { kind: '场景讲解', speaker: null, text: trial[1] },
        { kind: '角色对白', speaker, text: '“这一难尚未说尽，先与同伴把眼前的路走稳。”' },
        { kind: '角色对白', speaker: replySpeaker, text: '“我在。你开口，我们就一道应。”' },
        { kind: '转场字幕', speaker: null, text: '众人整顿行装，准备继续赶路。' }
      ];
    return injectBranchEchoes(sceneLines, key);
  }

  function responseLines() {
    const choice = pendingResponseOption || currentChoices()[state.pendingChoice] || currentChoices()[0];
    const player = playerForPosition(state.chapter, state.trial);
    const cast = choice?.cast || castForPosition(state.chapter, state.trial);
    const companion = cast.find(character => !isPlayerCharacter(character)) || null;
    const enacted = Boolean(choice.play);
    const actionCopy = enacted ? (choice.after || choice.outcome || choice.text) : choice.text;
    const spokenCopy = choice.speech;
    const emotion = choice.emotion || (choice.trait === 'resolve' ? 'determined' : choice.trait === 'mercy' ? 'worried' : 'thoughtful');
    const action = choice.action || (choice.trait === 'resolve' ? 'advance' : choice.trait === 'mercy' ? 'guard' : 'consider');
    const banned = [choice.text, actionCopy, ...storyLines().map(line => line.text)];
    const response = [
      { kind: '玩家行动', speaker: player, text: `（${actionCopy}）`, voice: false, emotion, action }
    ];
    if (choice.outcome) {
      response.push({ kind: '行动结果', speaker: null, text: choice.outcome, voice: false });
    }
    if (isFreshSpoken(spokenCopy, banned)) {
      response.push({ kind: '角色对白', speaker: player, text: spokenCopy, emotion, action });
    }
    const authoredAnswer = companion && isFreshSpoken(choice.answer, banned) ? choice.answer : '';
    if (authoredAnswer) {
      response.push({ kind: '角色回应', speaker: companion, text: authoredAnswer, emotion: choice.trait === 'mercy' ? 'relieved' : choice.timedOut ? 'worried' : 'alert', action: choice.trait === 'resolve' ? 'guard' : 'listen' });
    }
    const closingBanned = [...banned, spokenCopy, authoredAnswer];
    const reply = playerClosing(choice, closingBanned);
    if (isFreshSpoken(reply, closingBanned)) {
      response.push({ kind: '角色对白', speaker: player, text: reply, emotion: 'determined', action: 'listen' });
    }
    return response;
  }

  function lines() { return state.mode === 'response' ? responseLines() : storyLines(); }

  function nearbySpeaker(sceneLines, index, speaker) {
    for (let step = 1; step < sceneLines.length; step += 1) {
      for (const position of [index - step, index + step]) {
        const candidate = sceneLines[position]?.speaker;
        if (candidate && candidate !== speaker) return candidate;
      }
    }
    return null;
  }

  function stagePair(sceneLines, line = {}) {
    const selectedChoice = state.mode === 'response' && state.pendingChoice !== null
      ? pendingResponseOption || currentChoices()[state.pendingChoice]
      : null;
    const configured = selectedChoice?.cast || castOverrides[currentKey()] || sceneCast[currentKey()] || [];
    const speakers = sceneLines.map(candidate => candidate.speaker).filter(Boolean);
    const participants = [...new Set([...configured, ...speakers])].filter(character => data.characterInfo[character]);
    const player = playerForPosition(state.chapter, state.trial);
    if (player) {
      const playerIndex = participants.indexOf(player);
      if (playerIndex >= 0) participants.splice(playerIndex, 1);
      participants.unshift(player);
    }
    if (!participants.length) {
      const lead = currentTrial()[2];
      participants.push(...[lead, partnerFor(lead)].filter(character => data.characterInfo[character]));
    }
    const pair = participants.slice(0, 2);
    if (line.speaker && !pair.includes(line.speaker)) {
      if (isPlayerCharacter(line.speaker) || !pair[0]) pair[0] = line.speaker;
      else pair[1] = line.speaker;
    }
    return pair;
  }

  function inferExpression(line, character, focused) {
    if (!focused) return line.kind === '转场字幕' ? 'relieved' : 'calm';
    if (line.emotion) return line.emotion;
    const text = line.text || '';
    if (/怒|恨|杀|打死|伏诛|不服|逼|欺|哄|怎敢|岂/.test(text)) return 'angry';
    if (/伤|痛|血|疼|苦|困|压|缚|毒|火眼|烟/.test(text)) return 'pained';
    if (/怕|惊|险|危|掳|救|护|失|忧|忘|冤/.test(text)) return 'worried';
    if (/忽然|竟|原来|现形|真身|没想到|才知/.test(text)) return 'surprised';
    if (/想|问|真相|来历|为何|明白|看清|辨|猜/.test(text)) return 'thoughtful';
    if (/愿|定|必|不能|守|继续|向前|走|担|交给/.test(text)) return 'determined';
    if (/骗|变作|假|试探|计|绕|破绽/.test(text)) return 'sly';
    if (/终于|归正|得救|圆满|重归|熄|散去|安身/.test(text)) return 'relieved';
    return line.speaker ? 'alert' : 'calm';
  }

  function inferAction(line, character, focused, index) {
    if (!focused) return line.kind === '角色回应' ? 'listen' : 'idle';
    if (line.action) return line.action;
    const text = line.text || '';
    if (/拜|礼|师父|祖师|佛旨|奉旨/.test(text)) return 'bow';
    if (/打|战|棒|耙|铲|兵器|迎战|破|斗|杀|挡/.test(text)) return 'strike';
    if (/护|救|守住|身后|同伴|师父/.test(text)) return 'guard';
    if (/伤|痛|压|困|击中|后退|扇飞|跌|负/.test(text)) return 'recoil';
    if (/想|问|真相|看清|观察|明白|辨|听/.test(text)) return 'consider';
    if (/忽然|惊|现形|真身|骤|崩裂/.test(text)) return 'startle';
    if (/走|离开|拜别|逐|回去|退/.test(text)) return 'withdraw';
    if (/终于|圆满|成真|得位|归正|熄/.test(text)) return 'celebrate';
    return index % 3 === 0 ? 'advance' : 'listen';
  }

  function resolveArtSource(spec) {
    if (typeof spec === 'string') return spec;
    if (!spec || typeof spec !== 'object') return null;
    if (spec.flag) return state.flags[spec.flag] ? spec.afterFlag : spec.beforeFlag;
    return null;
  }

  function packedArtFallback(source) {
    return typeof source === 'string' && /\.png$/i.test(source) ? source.replace(/\.png$/i, '.webp') : '';
  }

  function artFor(character, action, focused, emotion, line) {
    const lineSource = resolveArtSource(line?.art?.[character]) || line?.art?.[character];
    if (lineSource) return lineSource;
    const performance = branch.performanceArt?.[currentKey()]?.[character];
    const performanceSource = performance?.[emotion] || performance?.[action] || performance?.default;
    if (performanceSource) return performanceSource;
    const periodSource = resolveArtSource(periodArt[currentKey()]?.[character]);
    if (periodSource) return periodSource;
    const sceneSource = sceneArt[currentKey()]?.[character];
    return resolveArtSource(sceneSource) || sceneSource || defaultArt[character] || defaultArt.悟空;
  }

  const actorPreloads = new Map();
  const backdropPreloads = new Map();

  function preloadImage(source, cache, limit) {
    if (!source || typeof window.Image !== 'function' || cache.has(source)) return;
    while (cache.size >= limit) cache.delete(cache.keys().next().value);
    const image = new window.Image();
    image.decoding = 'async';
    image.fetchPriority = 'low';
    image.src = source;
    cache.set(source, image);
  }

  function collectActorSources(value, sources = new Set()) {
    if (typeof value === 'string') {
      if (value.startsWith('assets/characters/')) sources.add(value);
      return sources;
    }
    if (Array.isArray(value)) value.forEach(entry => collectActorSources(entry, sources));
    else if (value && typeof value === 'object') Object.values(value).forEach(entry => collectActorSources(entry, sources));
    return sources;
  }

  function warmSceneArt(key) {
    if (typeof window.Image !== 'function') return;
    const cast = castOverrides[key] || sceneCast[key] || [];
    const sources = collectActorSources([
      periodArt[key],
      branch.performanceArt?.[key],
      sceneArt[key],
      sceneScripts[key]?.map(line => line.art),
      cast.map(character => defaultArt[character])
    ]);
    sources.forEach(source => preloadImage(source, actorPreloads, 18));
  }

  function warmBackdrop(source) {
    preloadImage(source, backdropPreloads, 4);
  }

  function warmNextScene() {
    if (currentSceneIndex() >= lastSceneIndex) return;
    const next = positionFor(currentSceneIndex() + 1);
    const key = `${next.chapter}:${next.trial}`;
    const chapter = data.chapterData[next.chapter];
    warmSceneArt(key);
    warmBackdrop(sceneBackdrops[key] || chapter.background);
  }

  function setExpressionBadge(element, expression, focused) {
    let badge = element.querySelector('.expression-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'expression-badge';
      badge.setAttribute('aria-hidden', 'true');
      element.append(badge);
    }
    badge.textContent = expressionLabels[expression];
    badge.hidden = !focused;
  }

  function framingFor(source, character) {
    return actorFraming[source] || actorFraming[defaultArt[character]] || defaultActorFrame;
  }

  function applyActorFraming(element, source, character) {
    const framing = framingFor(source, character);
    element.style.setProperty('--actor-frame-scale', String(framing.scale));
    element.style.setProperty('--actor-frame-x', `${framing.x}%`);
    element.style.setProperty('--actor-frame-y', `${framing.y}%`);
    element.dataset.frameMode = framing.mode;
    element.dataset.frameSource = source;
    return framing;
  }

  function setActor(element, character, side, focused, line, index) {
    const entering = element.hidden || element.dataset.character !== character;
    const info = data.characterInfo[character];
    const presentation = linePresentation(line, character);
    const image = element.querySelector('img');
    const emotion = inferExpression(line, character, focused);
    const action = inferAction(line, character, focused, index);
    const source = artFor(character, action, focused, emotion, line);
    const poseChanged = image.getAttribute('src') !== source;
    if (entering || poseChanged) applyActorFraming(element, source, character);
    image.decoding = 'async';
    image.fetchPriority = focused ? 'high' : 'auto';
    image.onerror = () => {
      const current = image.getAttribute('src') || '';
      const packed = packedArtFallback(current);
      if (packed && current !== packed) {
        applyActorFraming(element, packed, character);
        image.src = packed;
        return;
      }
      const fallback = defaultArt[character];
      if (fallback && current !== fallback) {
        applyActorFraming(element, fallback, character);
        element.dataset.artKind = fallback.includes('-portrait') ? 'portrait' : fallback.includes('-bust-') ? 'bust' : 'full';
        image.src = fallback;
        return;
      }
      image.removeAttribute('alt');
    };
    if (image.getAttribute('src') !== source) image.src = source;
    image.alt = '';
    element.setAttribute('aria-label', `${presentation.name || info.name}${focused ? `正以${expressionLabels[emotion]}状态行动` : '在旁观察'}`);
    element.dataset.character = character;
    element.dataset.side = side;
    element.dataset.artKind = source.includes('-portrait') ? 'portrait' : source.includes('-bust-') ? 'bust' : 'full';
    element.dataset.expression = emotion;
    element.dataset.action = action;
    element.dataset.emotion = emotion;
    element.dataset.motion = action;
    element.dataset.role = focused ? 'active' : 'watching';
    delete element.dataset.exitToken;
    element.style.setProperty('--beat', String((index % 3) + 1));
    element.hidden = false;
    element.classList.remove('active', 'responding', 'visible', 'beat-enter', 'pose-change', 'puppet-exit');
    element.classList.toggle('puppet-enter', entering);
    element.classList.toggle('pose-change', poseChanged && !entering);
    if (entering || poseChanged) {
      void element.offsetWidth;
      element.classList.add('beat-enter');
    }
    element.classList.toggle('is-focused', focused);
    element.classList.toggle('is-listening', !focused);
    element.querySelector('b').textContent = presentation.name || info.name;
    element.querySelector('small').textContent = presentation.role || info.role;
    setExpressionBadge(element, emotion, focused);
    return { emotion, action };
  }

  function hideActor(element) {
    if (element.hidden) return;
    const exitToken = `${Date.now()}-${Math.random()}`;
    element.dataset.exitToken = exitToken;
    element.classList.remove('puppet-enter', 'beat-enter');
    element.classList.add('puppet-exit');
    element.classList.remove('is-focused', 'is-listening');
    const badge = element.querySelector('.expression-badge');
    if (badge) badge.hidden = true;
    window.setTimeout(() => {
      if (element.dataset.exitToken !== exitToken) return;
      element.hidden = true;
      element.classList.remove('puppet-exit');
      delete element.dataset.exitToken;
      delete element.dataset.expression;
      delete element.dataset.action;
    }, 220);
  }

  function setStage(sceneLines, line, index) {
    const cast = stagePair(sceneLines, line);
    const isSilentThought = line.kind === '心理活动' || (line.voice === false && line.kind !== '玩家行动' && line.kind !== '行动抉择');
    const lead = line.speaker && !isSilentThought ? line.speaker : null;
    const visibleCount = cast.filter(Boolean).length;
    const stage = $('.cast-stage');
    stage.classList.toggle('is-single', visibleCount === 1);
    stage.classList.toggle('is-empty', visibleCount === 0);
    if (lead === cast[0] && cast[0]) setActor(leftActor, cast[0], 'left', true, line, index);
    else if (lead === cast[1] && cast[1]) setActor(rightActor, cast[1], 'right', true, line, index);
    if (cast[0] && lead !== cast[0]) setActor(leftActor, cast[0], 'left', false, line, index); else if (!cast[0]) hideActor(leftActor);
    if (cast[1] && lead !== cast[1]) setActor(rightActor, cast[1], 'right', false, line, index); else if (!cast[1]) hideActor(rightActor);
    app.classList.toggle('is-narration', !line.speaker);
    app.classList.toggle('is-dialogue', Boolean(line.speaker));
  }

  function setBackdrop() {
    const chapter = currentChapter();
    const source = sceneBackdrops[currentKey()] || chapter.background;
    app.dataset.chapter = String(state.chapter);
    stageBackdrop.decoding = 'async';
    stageBackdrop.fetchPriority = 'high';
    warmBackdrop(source);
    if (stageBackdrop.getAttribute('src') === source) return;
    stageBackdrop.onerror = () => {
      const current = stageBackdrop.getAttribute('src') || '';
      const packed = packedArtFallback(current);
      if (packed && current !== packed) {
        stageBackdrop.src = packed;
        return;
      }
      stageBackdrop.onerror = null;
      stageBackdrop.src = chapter.background;
    };
    stageBackdrop.classList.remove('backdrop-enter');
    void stageBackdrop.offsetWidth;
    stageBackdrop.src = source;
    stageBackdrop.classList.add('backdrop-enter');
    stageBackdrop.alt = `${currentMeta().name}舞台背景`;
  }

  function encounteredCharacters() {
    const encountered = new Set();
    for (let sceneIndex = 0; sceneIndex <= state.furthestScene; sceneIndex += 1) {
      const position = positionFor(sceneIndex);
      const key = `${position.chapter}:${position.trial}`;
      const trial = data.chapterData[position.chapter]?.trials[position.trial];
      const cast = castOverrides[key] || sceneCast[key] || [];
      [...cast, trial?.[2]].filter(character => character && !isPlayerCharacter(character)).forEach(character => encountered.add(character));
    }
    state.marks.forEach(mark => Object.keys(mark.relations || {}).filter(character => !isPlayerCharacter(character)).forEach(character => encountered.add(character)));
    Object.entries(state.relationships).forEach(([character, value]) => {
      if (Number(value)) encountered.add(character);
    });
    return [...encountered]
      .filter(character => data.characterInfo[character] && !isPlayerCharacter(character))
      .sort((left, right) => {
        const difference = Math.abs(state.relationships[right] || 0) - Math.abs(state.relationships[left] || 0);
        return difference || data.characterInfo[left].name.localeCompare(data.characterInfo[right].name, 'zh-CN');
      });
  }

  function setHud() {
    const chapter = currentChapter();
    const meta = currentMeta();
    const revisiting = currentSceneIndex() < state.furthestScene;
    $('#chapterMark').textContent = chapter.mark;
    $('#sceneName').textContent = meta.name;
    $('#locationName').textContent = meta.place;
    $('#trialLabel').textContent = `第 ${String(trialNumber()).padStart(2, '0')} / 81 难`;
    $('#journalCount').textContent = `${state.marks.length} 条选择`;
    $('#journeyProgress').textContent = `已至第 ${String(state.furthestScene + 1).padStart(2, '0')} 难`;
    $('#resolveCount').textContent = state.resolve;
    $('#mercyCount').textContent = state.mercy;
    $('#insightCount').textContent = state.insight;
    $('#relationCount').textContent = `${encounteredCharacters().length} 位相识`;
    $('#checkpointTitle').textContent = `第 ${String(trialNumber()).padStart(2, '0')} 难 · ${currentTrial()[0]}`;
    $('#checkpointState').textContent = !saveSucceeded
      ? '本机存档不可用 · 请勿关闭页面'
      : revisiting
        ? `重温中 · 最远抵达第 ${String(state.furthestScene + 1).padStart(2, '0')} 难`
        : '旅痕已自动封存';
    $('#pauseCheckpoint').dataset.mode = !saveSucceeded ? 'error' : revisiting ? 'revisit' : 'current';
    const ranking = routeRanking();
    const highest = ranking[0]?.[1] || 0;
    const leaders = highest > 0 ? ranking.filter(([, score]) => score === highest).map(([route]) => route) : [];
    Object.keys(routeMeta).forEach(route => {
      $(`#${route}RouteScore`).textContent = state.routeScores[route] || 0;
    });
    const compass = $('#routeCompass');
    const leadingRoute = leaders[0] || 'defiance';
    compass.dataset.dominant = leaders.length ? leadingRoute : 'none';
    compass.style.setProperty('--route-angle', `${routeMeta[leadingRoute].angle}deg`);
    compass.querySelectorAll('[data-route]').forEach(point => {
      const active = leaders.includes(point.dataset.route);
      point.classList.toggle('dominant', active);
      if (active) point.setAttribute('aria-current', 'true'); else point.removeAttribute('aria-current');
    });
    $('#dominantRouteLabel').textContent = leaders.length
      ? `${leaders.map(route => routeMeta[route].label).join(' / ')}${leaders.length === 1 ? '主导' : '并行'}`
      : '尚未定向';
    $('#soundState').textContent = state.sound ? '已开启' : '已静音';
    $('#soundBtn').setAttribute('aria-pressed', String(state.sound));
    $('#autoBtn').setAttribute('aria-pressed', String(state.auto));
    $('#autoBtn').setAttribute('aria-label', state.auto ? '关闭自动播放' : '开启自动播放');
    const skipButton = $('#skipBtn');
    skipButton.disabled = state.mode === 'choices' || state.completed;
    skipButton.setAttribute('aria-disabled', String(skipButton.disabled));
  }

  function clearAuto() { clearTimeout(autoTimer); autoTimer = null; }

  function clearChoiceCountdown({ hide = true } = {}) {
    if (choiceTimer) window.clearTimeout(choiceTimer);
    if (choiceTicker) window.clearInterval(choiceTicker);
    choiceTimer = null;
    choiceTicker = null;
    choiceDeadline = 0;
    if (hide) $('#choiceTimer').hidden = true;
  }

  function updateChoiceCountdown() {
    const timer = $('#choiceTimer');
    const remaining = Math.max(0, choiceDeadline - Date.now());
    const ratio = remaining / choiceTimeLimit;
    $('#choiceTimerText').textContent = `${(remaining / 1000).toFixed(1)} 秒`;
    $('#choiceTimerFill').style.transform = `scaleX(${ratio})`;
    timer.classList.toggle('urgent', remaining <= 3000);
  }

  function chooseSilenceOnTimeout() {
    if (state.mode !== 'choices' || transitioning) return;
    const choices = currentChoices();
    const authoredIndex = choices.findIndex(option => /沉默/.test(option.label || ''));
    if (authoredIndex >= 0) {
      commitChoice(authoredIndex, { optionOverride: Object.freeze({ ...choices[authoredIndex], timedOut: true }) });
      return;
    }
    commitChoice(-1, { optionOverride: timedSilenceOption(state.chapter, state.trial) });
  }

  function startChoiceCountdown() {
    clearChoiceCountdown({ hide: false });
    const timer = $('#choiceTimer');
    timer.hidden = false;
    choiceDeadline = Date.now() + choiceTimeLimit;
    updateChoiceCountdown();
    choiceTicker = window.setInterval(updateChoiceCountdown, 100);
    choiceTimer = window.setTimeout(chooseSilenceOnTimeout, choiceTimeLimit);
  }

  function autoDelayFor(line, { hasVoice = false } = {}) {
    if (hasVoice) return 420;
    return 2000;
  }

  function consequenceCopy(option) {
    const details = [];
    if (option?.feedback) details.push(option.feedback);
    Object.entries(option?.relations || {}).forEach(([character, amount]) => {
      if (isPlayerCharacter(character) || !amount || option.feedback?.includes(character)) return;
      const name = data.characterInfo[character]?.name || character;
      details.push(`${name}对你的好感${amount > 0 ? '上升' : '下降'}`);
    });
    return [...new Set(details)].slice(0, 3);
  }

  function showConsequence(option, title = '选择结果') {
    const messages = typeof option === 'string' ? [option] : consequenceCopy(option);
    const relationChanges = typeof option === 'string'
      ? []
      : Object.entries(option?.relations || {}).filter(([character, amount]) => !isPlayerCharacter(character) && Number(amount));
    if (!messages.length && !relationChanges.length) return;
    const stack = $('#consequenceStack');
    const toast = document.createElement('article');
    toast.className = 'consequence-toast';
    toast.setAttribute('aria-atomic', 'true');
    toast.dataset.tone = Object.values(option?.relations || {}).some(value => value < 0) ? 'warning' : 'notice';
    const seal = document.createElement('span');
    seal.className = 'consequence-seal';
    seal.textContent = toast.dataset.tone === 'warning' ? '变' : '记';
    const copy = document.createElement('div');
    const heading = document.createElement('strong');
    heading.textContent = title;
    copy.append(heading);
    messages.forEach(message => {
      const line = document.createElement('p');
      line.textContent = message;
      copy.append(line);
    });
    if (relationChanges.length) {
      const changes = document.createElement('div');
      changes.className = 'relation-changes';
      changes.setAttribute('aria-label', '关系变化');
      relationChanges.forEach(([character, amount]) => {
        const info = data.characterInfo[character];
        const tag = document.createElement('span');
        tag.className = `relation-change ${amount > 0 ? 'positive' : 'negative'}`;
        const mark = document.createElement('i');
        mark.textContent = info?.seal || character.slice(0, 1);
        const value = document.createElement('b');
        value.textContent = `${info?.name || character} ${amount > 0 ? '+' : ''}${amount}`;
        tag.append(mark, value);
        changes.append(tag);
      });
      copy.append(changes);
    }
    toast.append(seal, copy);
    stack.prepend(toast);
    requestAnimationFrame(() => toast.classList.add('visible'));
    const visibleFor = Math.min(8200, 5000 + messages.join('').length * 32 + relationChanges.length * 260);
    window.setTimeout(() => {
      toast.classList.remove('visible');
      window.setTimeout(() => toast.remove(), 260);
    }, visibleFor);
  }

  function setCurtainCopy({ kicker = '本难完成', title = currentTrial()[0], hint = '继续西行' } = {}) {
    $('#sceneCurtainKicker').textContent = kicker;
    $('#sceneCurtainTitle').textContent = title;
    $('#sceneCurtainHint').textContent = hint;
  }

  function isStageDirectionLine(line) {
    if (!line) return true;
    if (['玩家行动', '关系变化', '心理活动'].includes(line.kind)) return true;
    return !hasReadableCopy(line.text);
  }

  function isAddressedSpeech(text) {
    const raw = String(text || '').replace(/[“”‘’]/g, '').trim();
    if (!raw) return false;
    return !/^(悟空|石猴|玄奘|八戒|悟净|如来|观音|菩提|哪吒|二郎|老君|金池|白龙|铁扇|牛魔|女王|六耳|镇元|老鼋|唐王|魏征|太白|阎王|龙王|群猴|王母|玉帝|李靖|白骨|红孩)(把|将|便把|已|在山|从|与|和)/.test(raw);
  }

  function spokenDialogue(line) {
    const narratorKinds = new Set(['场景字幕', '场景讲解', '转场字幕']);
    if (!line || line.voice === false || (!line.speaker && !narratorKinds.has(line.kind))) return '';
    if (line.speaker && !isAddressedSpeech(line.text)) return '';
    const withoutDirections = String(line.text || '')
      .replace(/（[^（）]*）/g, ' ')
      .replace(/\([^()]*\)/g, ' ')
      .trim();
    const quoted = [...withoutDirections.matchAll(/“([^”]+)”/g)].map(match => match[1].trim()).filter(Boolean);
    return (quoted.length ? quoted.join(' ') : withoutDirections.replace(/[“”]/g, '')).replace(/\s+/g, ' ').trim();
  }

  function linePresentation(line, character) {
    return line?.presentation?.[character] || actorPresentation[currentKey()]?.[character] || {};
  }

  function voiceCue(line) {
    const info = line.speaker ? data.characterInfo[line.speaker] : null;
    const presentation = linePresentation(line, line.speaker);
    const text = spokenDialogue(line);
    return {
      enabled: state.sound && Boolean(text),
      text,
      speaker: presentation.name || info?.name || '旁白',
      character: line.voice || line.speaker || null,
      kind: line.kind,
      narrator: !line.speaker
    };
  }

  function showInterlude() {
    clearAuto();
    window.shadowplayVoice?.stop();
    const interludeCutoff = state.completed ? currentSceneIndex() : currentSceneIndex() - 1;
    recalculateScores(interludeCutoff, interludeCutoff);
    const chapter = currentChapter();
    const trial = currentTrial();
    const meta = currentMeta();
    const featuredTransition = transitionArt[currentKey()];
    const interludeSource = featuredTransition || sceneBackdrops[currentKey()] || chapter.background;
    warmSceneArt(currentKey());
    warmBackdrop(interludeSource);
    interlude.style.setProperty('--interlude-art', `url(${JSON.stringify(interludeSource)})`);
    interlude.dataset.artMode = featuredTransition ? 'portrait' : 'scene';
    setHud();
    setBackdrop();
    state.mode = 'interlude';
    storyLines()
      .slice(0, 2)
      .forEach(line => window.shadowplayVoice?.preload(voiceCue(line)));
    app.classList.add('is-interlude');
    interlude.hidden = false;
    interlude.setAttribute('aria-hidden', 'false');
    $('#interludeMark').textContent = `${chapter.mark} · 第 ${String(trialNumber()).padStart(2, '0')} 难`;
    $('#interludeTitle').textContent = trial[0];
    $('#interludePlace').textContent = meta.place;
    $('#interludeText').textContent = trial[1];
    const resumeNote = $('#interludeResume');
    const hasJourney = state.furthestScene > 0 || state.marks.length > 0;
    resumeNote.hidden = !(initialInterlude && hasJourney);
    resumeNote.textContent = `续自上回 · ${state.marks.length} 道旅痕 · 最远第 ${String(state.furthestScene + 1).padStart(2, '0')} 难`;
    syncBgm();
    dialogueDeck.hidden = true;
    $('#choiceList').hidden = true;
    save();
    requestAnimationFrame(() => interludeAdvance.focus());
  }

  function beginScene() {
    if (state.mode !== 'interlude' || transitioning) return;
    transitioning = true;
    initialInterlude = false;
    playSound('whoosh');
    sceneCurtain.classList.add('closing');
    window.setTimeout(() => {
      interlude.hidden = true;
      interlude.setAttribute('aria-hidden', 'true');
      app.classList.remove('is-interlude');
      state.mode = 'story';
      state.lineIndex = 0;
      renderLine();
      sceneCurtain.classList.remove('closing');
      window.setTimeout(() => { transitioning = false; }, 320);
    }, 220);
  }

  function renderChoices() {
    const actions = currentChoices();
    const list = $('#choiceList');
    const recorded = currentMark();
    list.replaceChildren();
    actions.forEach((action, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'choice-button';
      button.classList.toggle('recorded', recorded?.choice === index);
      button.dataset.choice = String(index);
      button.dataset.trait = normalizeTrait(action.trait);
      button.dataset.num = String(index + 1);
      button.setAttribute('aria-pressed', String(recorded?.choice === index));
      button.setAttribute('aria-keyshortcuts', String(index + 1));
      const label = document.createElement('span');
      label.className = 'choice-label';
      label.textContent = action.label;
      const description = document.createElement('small');
      description.textContent = action.text;
      button.append(label, description);
      if (recorded?.choice === index) {
        const status = document.createElement('em');
        status.textContent = '已写入旅痕';
        button.append(status);
      }
      button.addEventListener('click', () => choose(index));
      list.append(button);
    });
    list.hidden = false;
    warmNextScene();
    if (recorded) clearChoiceCountdown(); else startChoiceCountdown();
    requestAnimationFrame(() => list.querySelector('button')?.focus({ preventScroll: true }));
  }

  function isRevisitingScene() {
    return state.completed || currentSceneIndex() < state.furthestScene;
  }

  function interactionGate(game) {
    if (game?.gate === 'choice' || game?.gate === 'setup' || game?.gate === 'off') return game.gate;
    if (game?.placement === 'story') return 'off';
    return ['battle', 'duel', 'catch'].includes(miniGameType(game)) ? 'choice' : 'off';
  }

  function shouldOfferStoryQuizAt(lineIndex) {
    const game = miniGames[currentKey()];
    if (!game || miniGameType(game) !== 'quiz' || game.placement !== 'story') return false;
    if (!canOpenSceneInteraction()) return false;
    const sceneLines = storyLines();
    return lineIndex === 2 && sceneLines.length - lineIndex >= 3;
  }

  function canOpenSceneInteraction() {
    const game = miniGames[currentKey()];
    if (!game) return false;
    const alreadyPlayed = Boolean(state.completedMiniGames[currentKey()]);
    return !alreadyPlayed || isRevisitingScene();
  }

  function enterChoices({ skipInteraction = false } = {}) {
    if (!isPlayerScene(state.chapter, state.trial) || !currentChoices().length) {
      advanceScene();
      return;
    }
    const game = miniGames[currentKey()];
    const alreadyPlayed = Boolean(state.completedMiniGames[currentKey()]);
    if (game && !skipInteraction && interactionGate(game) === 'setup' && canOpenSceneInteraction()) {
      startMiniGame();
      return;
    }
    if (game && !alreadyPlayed && skipInteraction) {
      state.completedMiniGames[currentKey()] = { skipped: true, rewarded: false, score: 0 };
    }
    state.mode = 'choices';
    state.lineIndex = 0;
    recalculateScores(currentSceneIndex() - 1, currentSceneIndex());
    save();
    renderLine();
  }

  function renderLine() {
    const isChoice = state.mode === 'choices';
    clearAuto();
    if (!isChoice) clearChoiceCountdown();
    const sceneLines = lines();
    if (!isChoice) {
      while (state.lineIndex < sceneLines.length && isStageDirectionLine(sceneLines[state.lineIndex])) {
        state.lineIndex += 1;
      }
      if (!sceneLines.length || state.lineIndex >= sceneLines.length) {
        if (state.mode === 'response') {
          playSound('pluck');
          advanceScene();
          return;
        }
        if (isPlayerScene(state.chapter, state.trial)) enterChoices();
        else advanceScene();
        return;
      }
    }
    const line = sceneLines[Math.min(state.lineIndex, sceneLines.length - 1)];
    const kind = isChoice ? '行动抉择' : line.kind;
    const kindLabel = lineKindLabels[kind] || kind;
    const spokenAsCharacter = !isChoice && line.speaker && isAddressedSpeech(line.text) && ['角色对白', '角色回应', '抉择回声', '旅痕回声'].includes(kind);
    const isNarratorLine = !isChoice && !spokenAsCharacter && ['场景字幕', '场景讲解', '转场字幕'].includes(kind);
    const presentation = isChoice ? 'choice' : spokenAsCharacter ? 'character' : isNarratorLine || !line.speaker ? 'narrator' : 'system';
    const choicePlayer = isChoice ? playerForPosition(state.chapter, state.trial) : null;
    setHud();
    setBackdrop();
    dialogueDeck.hidden = false;
    const dialogueSurface = $('.dialogue-inner');
    dialogueSurface.scrollTop = 0;
    const copy = $('.story-copy');
    copy.classList.remove('line-change');
    void copy.offsetWidth;
    copy.classList.add('line-change');
    if (isChoice) {
      setStage(sceneLines, { speaker: choicePlayer, kind, text: '', emotion: 'determined', action: 'consider' }, state.lineIndex);
      renderChoices();
    } else {
      setStage(sceneLines, line, state.lineIndex);
      $('#choiceList').hidden = true;
    }
    const displaySpeaker = isChoice ? choicePlayer : spokenAsCharacter ? line.speaker : null;
    const info = displaySpeaker ? data.characterInfo[displaySpeaker] : null;
    const spokenPresentation = linePresentation(isChoice ? { speaker: choicePlayer } : line, displaySpeaker);
    $('#lineType').textContent = kindLabel;
    $('#speakerSeal').textContent = spokenPresentation.seal || (info ? info.seal : isNarratorLine ? '述' : '记');
    $('#speakerName').textContent = spokenPresentation.name || (info ? info.name : isNarratorLine ? '旁白' : '旅途见闻');
    $('#speakerRole').textContent = spokenPresentation.role || (info ? info.role : isNarratorLine ? '叙事' : '行旅记录');
    $('#dialogueTitle').textContent = isChoice ? '选择行动' : currentTrial()[0];
    const directSpeech = spokenAsCharacter;
    const displayText = isChoice
      ? '你准备怎么做？'
      : directSpeech && !/^“[\s\S]*”$/.test(String(line.text || '').trim()) ? `“${line.text}”` : line.text;
    if (!isChoice && !hasReadableCopy(displayText)) {
      advance();
      return;
    }
    const revealToken = ++lineRevealToken;
    const cue = isChoice ? null : voiceCue(line);
    paintKaraoke(displayText, isChoice ? 1 : 0, cue?.text);
    $('#dialogueText').classList.remove('is-waiting-voice');
    if (isChoice) {
      window.shadowplayVoice?.stop();
    } else {
      const reveal = progress => {
        if (revealToken !== lineRevealToken) return;
        paintKaraoke(displayText, progress, cue.text);
      };
      sceneLines.slice(state.lineIndex + 1).filter(candidate => candidate.text).slice(0, 2).forEach(candidate => {
        window.shadowplayVoice?.preload(voiceCue(candidate));
      });
      if (!cue.enabled || !cue.text || !window.shadowplayVoice) {
        reveal(1);
        if (state.auto) autoTimer = window.setTimeout(advance, autoDelayFor(line, { hasVoice: false }));
      } else {
        window.shadowplayVoice.speak(cue, {
          onProgress(progress) { reveal(progress); },
          onEnded() {
            reveal(1);
            if (state.auto && revealToken === lineRevealToken) {
              autoTimer = window.setTimeout(advance, autoDelayFor(line, { hasVoice: true }));
            }
          }
        });
      }
    }
    dialogueSurface.setAttribute('aria-label', isChoice ? '从以下行动中选择' : '点击继续');
    dialogueSurface.setAttribute('role', isChoice ? 'group' : 'button');
    dialogueSurface.setAttribute('aria-busy', 'false');
    dialogueSurface.setAttribute('aria-keyshortcuts', isChoice ? currentChoices().map((_, index) => index + 1).join(' ') : 'Enter Space');
    dialogueSurface.tabIndex = isChoice ? -1 : 0;
    dialogueRegion.dataset.lineKind = kind;
    dialogueRegion.dataset.presentation = presentation;
    dialogueRegion.classList.toggle('choice-ready', isChoice);
    dialogueDeck.classList.toggle('choice-ready', isChoice);
    dialogueSurface.classList.toggle('choice-ready', isChoice);
    dialogueSurface.classList.toggle('narration-mode', isNarratorLine);
    dialogueSurface.classList.toggle('system-mode', presentation === 'system');
    dialogueSurface.classList.toggle('character-mode', presentation === 'character');
    dialogueSurface.classList.toggle('subtitle-mode', kind === '场景字幕' || kind === '转场字幕');
  }

  function spokenWindow(source, spoken) {
    const chars = [...source];
    const clip = String(spoken || '').trim();
    if (!clip || !chars.length) return { start: 0, end: chars.length };
    const text = chars.join('');
    let from = text.indexOf(clip);
    if (from < 0) {
      from = text.indexOf(`“${clip}”`);
      if (from >= 0) from += 1;
    }
    if (from < 0) return { start: 0, end: chars.length };
    const start = [...text.slice(0, from)].length;
    return { start, end: Math.min(chars.length, start + [...clip].length) };
  }

  function paintKaraoke(text, progress = 0, spoken = '') {
    const node = $('#dialogueText');
    if (!node) return;
    const source = String(text || '');
    const chars = [...source];
    if (!chars.length) {
      node.replaceChildren();
      delete node.dataset.ktvText;
      delete node.dataset.ktvSung;
      return;
    }
    const window = spokenWindow(source, spoken);
    const span = Math.max(1, window.end - window.start);
    const lead = 0.5 / span;
    const ratio = Math.max(0, Math.min(1, (Number(progress) || 0) + lead));
    let sung = window.start + (ratio >= 1 ? span : Math.floor(span * ratio));
    if (node.dataset.ktvText === source) sung = Math.max(sung, Number(node.dataset.ktvSung) || 0);
    node.dataset.ktvText = source;
    node.dataset.ktvSung = String(sung);
    const existing = typeof node.querySelectorAll === 'function' ? [...node.querySelectorAll('.ktv-char')] : [];
    const sameLine = existing.length === chars.length && existing.every((mark, index) => mark.textContent === chars[index]);
    if (sameLine) {
      existing.forEach((mark, index) => {
        mark.classList.toggle('is-sung', index < sung);
        mark.classList.toggle('is-current', index === sung && ratio > 0 && ratio < 1);
      });
      return;
    }
    node.textContent = source;
    const marks = chars.map((character, index) => {
      const mark = document.createElement('span');
      mark.className = 'ktv-char';
      if (index < sung) mark.classList.add('is-sung');
      else if (index === sung && ratio > 0 && ratio < 1) mark.classList.add('is-current');
      mark.textContent = character;
      return mark;
    });
    if (marks.length === chars.length && typeof node.replaceChildren === 'function') node.replaceChildren(...marks);
  }

  function advance() {
    if (transitioning || state.mode === 'interlude' || state.mode === 'choices' || activeModal()) return;
    const sceneLines = lines();
    if (state.lineIndex < sceneLines.length - 1) {
      playSound('page');
      state.lineIndex += 1;
      if (state.mode === 'story' && shouldOfferStoryQuizAt(state.lineIndex)) {
        save();
        startMiniGame({ storyBeat: true });
        return;
      }
      save();
      renderLine();
      return;
    }
    if (state.mode === 'response') {
      playSound('pluck');
      advanceScene();
      return;
    }
    if (isPlayerScene(state.chapter, state.trial)) enterChoices();
    else advanceScene();
  }

  function hasFutureProgress() {
    const current = currentSceneIndex();
    return state.furthestScene > current
      || state.marks.some(mark => indexFor(mark.chapter, mark.trial) > current)
      || Object.keys(state.completedMiniGames).some(key => sceneIndexFromKey(key) > current);
  }

  function truncateFutureProgress() {
    const current = currentSceneIndex();
    state.marks = state.marks.filter(mark => indexFor(mark.chapter, mark.trial) <= current);
    state.completedMiniGames = Object.fromEntries(Object.entries(state.completedMiniGames)
      .filter(([key]) => sceneIndexFromKey(key) <= current));
    state.furthestScene = current;
    state.completed = false;
    recalculateScores(current - 1, current);
  }

  function choose(index) {
    const choices = currentChoices();
    if (state.mode !== 'choices' || transitioning || !Number.isInteger(index) || index < 0 || index >= choices.length) return;
    const existing = currentMark();
    if (hasFutureProgress() && existing?.choice !== index) {
      const target = choices[index];
      openConfirmation({
        kicker: '改写旅痕',
        title: `从第 ${String(trialNumber()).padStart(2, '0')} 难重新选择？`,
        text: `你将改选“${target.label}”。本难之后的选择、关系变化与互动结果会被收回，西行从这里重新展开。`,
        confirmLabel: '改写长卷',
        onConfirm: () => {
          truncateFutureProgress();
          commitChoice(index, { rewritten: true });
        }
      }, document.activeElement);
      return;
    }
    commitChoice(index);
  }

  function commitChoice(index, { rewritten = false, optionOverride = null } = {}) {
    clearChoiceCountdown();
    const choices = currentChoices();
    const trial = currentTrial();
    const authoredOption = optionOverride || choices[index];
    if (!authoredOption) return;
    const relations = Object.fromEntries(Object.entries(authoredOption.relations || {})
      .filter(([, amount]) => authoredOption.timedOut || Math.abs(Number(amount) || 0) >= 2));
    const meaningfulFeedback = authoredOption.timedOut || Object.keys(relations).length > 0;
    const option = Object.freeze({
      ...authoredOption,
      relations: Object.freeze(relations),
      feedback: meaningfulFeedback ? authoredOption.feedback || '' : ''
    });
    pendingResponseOption = option;
    const existingIndex = state.marks.findIndex(mark => mark.chapter === state.chapter && mark.trial === state.trial);
    const mark = {
      chapter: state.chapter,
      trial: state.trial,
      choice: index,
      optionId: option.id || `choice-${index}`,
      trait: normalizeTrait(option.trait),
      label: trial[0],
      text: option.text,
      outcome: option.outcome || option.text,
      feedback: option.feedback || '',
      relations: { ...relations },
      flags: { ...(option.flags || {}) },
      routes: { ...(option.routes || {}) }
    };
    if (existingIndex === -1) state.marks.push(mark); else state.marks.splice(existingIndex, 1, mark);
    state.marks.sort((left, right) => indexFor(left.chapter, left.trial) - indexFor(right.chapter, right.trial));
    recalculateScores(currentSceneIndex(), currentSceneIndex());
    state.pendingChoice = index;
    state.furthestScene = Math.max(state.furthestScene, currentSceneIndex());
    const game = miniGames[currentKey()];
    if (option.play && canOpenSceneInteraction() && ['battle', 'duel', 'catch'].includes(miniGameType(game))) {
      save();
      playSound('confirm');
      startMiniGame();
      return;
    }
    state.mode = 'response';
    state.lineIndex = 0;
    save();
    playSound('confirm');
    renderLine();
    showConsequence(option, rewritten ? '路线已改写 · 选择结果' : '选择结果');
    requestAnimationFrame(() => dialogueDeck.focus({ preventScroll: true }));
  }

  function advanceScene() {
    if (transitioning) return;
    transitioning = true;
    clearAuto();
    clearChoiceCountdown();
    const isFinal = state.chapter === 8 && state.trial === 8;
    const isChapterTurn = state.trial === 8;
    const nextChapter = isChapterTurn && !isFinal ? data.chapterData[state.chapter + 1] : null;
    sceneCurtain.classList.toggle('chapter-turn', isChapterTurn);
    setCurtainCopy(nextChapter ? {
      kicker: `${currentChapter().mark} · 完成`,
      title: `${nextChapter.mark} · ${nextChapter.name}`,
      hint: '新的旅程'
    } : {
      title: currentTrial()[0],
      hint: isFinal ? '西行圆满' : '继续西行'
    });
    if (!isFinal) playSound(isChapterTurn ? 'gong' : 'whoosh');
    sceneCurtain.classList.add('closing');
    window.setTimeout(() => {
      if (isFinal) {
        sceneCurtain.classList.remove('closing');
        sceneCurtain.classList.remove('chapter-turn');
        transitioning = false;
        finish();
        return;
      }
      state.trial += 1;
      if (state.trial > 8) { state.trial = 0; state.chapter += 1; }
      state.furthestScene = Math.max(state.furthestScene, currentSceneIndex());
      state.mode = 'interlude';
      state.lineIndex = 0;
      state.pendingChoice = null;
      pendingResponseOption = null;
      save();
      window.setTimeout(() => {
        sceneCurtain.classList.remove('closing');
        transitioning = false;
        showInterlude();
        window.setTimeout(() => sceneCurtain.classList.remove('chapter-turn'), isChapterTurn ? 520 : 180);
      }, isChapterTurn ? 520 : 180);
    }, isChapterTurn ? 720 : 300);
  }

  function finish() {
    if (state.completed && currentSceneIndex() < lastSceneIndex) recalculateScores(lastSceneIndex, lastSceneIndex);
    const total = state.resolve + state.mercy + state.insight;
    const routeEntries = routeRanking();
    const [dominantRoute, dominantScore] = routeEntries[0];
    const [secondaryRoute, secondaryScore] = routeEntries[1];
    const endings = {
      defiance: { title: '齐天余焰', seal: '勇', text: '你以不肯低头的方式走完西行。斗战胜佛之号落下，天庭仍记得花果山那面旗，而你选择把这股锋芒带回人间，专照那些无人敢问的规矩。' },
      bond: { title: '同心真经', seal: '同', text: '你一次次先把同行者接住。抵达灵山时，真正留下的不是谁独自成佛，而是师徒仍愿意坐在一起，把争执和归途说完。' },
      discipline: { title: '守戒成真', seal: '戒', text: '你让力量服从承诺，也让沉默不再只是逃避。经卷回到长安后，取经之路成为一套愿意约束强者、也愿意宽待悔过者的准则。' },
      insight: { title: '照见真经', seal: '悟', text: '你没有把眼前所见当作唯一答案。无字经、真假行者与八十一难留下的疑问被一并带回东土，真经因此不是定论，而是继续辨认世间因果的方法。' }
    };
    const fusionEndings = {
      'defiance|bond': '反骨与同心并行：你没有为维系关系收起所有锋芒，而是把最尖锐的问题挡在同行者身前。此后每一次问天，都有人与你并肩承担答案。',
      'defiance|discipline': '反骨与守戒并行：你拒绝由外在权威替自己定界，却主动留下不欺弱、不失诺的内在戒律。自由因此不再只是挣脱，也包括自我约束。',
      'defiance|insight': '反骨与照见并行：你既敢掀开神佛规矩，也肯查清自己是否看错。质疑没有停在怒意，最终成为一套能被证据修正的锋芒。',
      'bond|discipline': '同心与守戒并行：师徒情分不是无条件偏护，而是一份彼此都要遵守的约定。紧箍虽去，共同划下的界线仍留在归途。',
      'bond|insight': '同心与照见并行：你从同行者的记忆里辨真假，也从每次争执里看见自己的盲处。真经被写成众人互相照见的长卷。',
      'discipline|insight': '守戒与照见并行：你不把戒条当作停止思考的答案，而是在每次辨明因果后重新确认何事不可为。克制因此有了清醒的来处。'
    };
    const ending = endings[dominantRoute] || endings.insight;
    const endingVisuals = {
      defiance: ['assets/backgrounds/huaguo-heaven-siege-stage.png', '锋芒仍在，齐天旧旗迎风而立'],
      bond: ['assets/backgrounds/changan-departure.png', '师徒同归，来路与归途连成一线'],
      discipline: ['assets/backgrounds/lingshan-stage.png', '紧箍已去，自守的戒线仍在心中'],
      insight: ['assets/backgrounds/tongtian-stage.png', '经卷留痕，八十一难仍可逐页照见']
    };
    const routeOrder = Object.keys(routeMeta);
    const fusionKey = [dominantRoute, secondaryRoute].sort((left, right) => routeOrder.indexOf(left) - routeOrder.indexOf(right)).join('|');
    const isFusion = secondaryScore > 0 && dominantScore - secondaryScore <= 2;
    const fusionText = isFusion ? fusionEndings[fusionKey] : '';
    const echoRules = [
      ['dragonDeal', 'coerced', '东海仍将强取神珍记在龙册上，成佛并未替这笔旧债销账。'],
      ['dragonDeal', 'courtesy', '东海记得当年神珍虽去，却还留着一场依礼相借的人情。'],
      ['filletResponse', 'resented', '紧箍留下的裂痕直到封佛也没有被名号抹去。'],
      ['filletResponse', 'covenant', '两界山定下的咒界成为师徒后来每次争执都必须守住的底线。'],
      ['whiteDragonMeeting', 'recognized', '鹰愁涧少去的一场恶斗，让白龙一路都记得自己曾先被当作有来处的人。'],
      ['wuzhuangFruitMethod', 'stole', '五庄观那枚背人摘下的人参果提醒众人：灵根虽活，欺瞒仍须承认。'],
      ['wuzhuangFruitMethod', 'asked', '五庄观先问后取的礼数，使镇元与取经队伍保留了一段不必翻脸的余地。'],
      ['wuzhuangRemedy', 'humbled', '人参树在甘露中重生，也见证齐天大圣曾为自己的过错低首求方。'],
      ['whiteBoneMethod', 'swift', '白骨岭三棒虽除了妖，未被说明的判断却成为师徒最深的一道旧伤。'],
      ['whiteBoneMethod', 'proved', '白骨三变被逐样验明，火眼从个人断言变成了可以共同查验的证据。'],
      ['whiteBoneMethod', 'captured', '白骨真形曾被留到师徒面前对质，那次止棒改写了后来处置妖魔的方式。'],
      ['exileResponse', 'left-help', '逐走之日留下的救命毫毛，最终把一场决裂保留成仍可回头的别离。'],
      ['exileResponse', 'severed', '白骨岭撕碎的贬书没有随归队复原，师徒只能在更长的路上慢慢补回。'],
      ['redBoyEnding', 'consented', '红孩儿记得莲台前曾被允许自己收火，善财之名因此不只来自强制服从。'],
      ['redBoyEnding', 'bound', '红孩儿虽成善财童子，强收时留下的恨意仍让火云洞旧账未清。'],
      ['daughterFarewell', 'honest', '西梁城门那场坦白没有留住女王，却让彼此的敬意没有被权宜之计耗尽。'],
      ['daughterFarewell', 'deceived', '女儿国以假允婚事换来的关文，成为功成后仍无法粉饰的一次亏欠。'],
      ['fanApproach', 'courtesy', '芭蕉洞第一次依礼开口，使火焰山最后仍有可能以归还之约告一段落。'],
      ['fanApproach', 'force', '闯洞强夺的第一棒把借路变成家仇，熄灭山火也未能熄灭铁扇的怨。'],
      ['flameResolution', 'returned', '芭蕉扇如约回到铁扇手中，胜过强敌之后仍肯守诺也被写入真经。'],
      ['flameResolution', 'kept', '火焰山永不复燃，铁扇与牛魔却把被留下的宝扇视作又一场强夺。'],
      ['monkeyIdentityProof', 'memories', '真假行者最终由共同经历分辨：外貌可以复制，彼此承担过的因果不能。'],
      ['monkeyIdentityProof', 'restraint', '真假难辨时先放下的铁棒，让克制本身成为无法伪造的身份证明。'],
      ['sixEarEnding', 'spared', '六耳没有以尸身替真悟空作证，冒名者留下余生偿还自己造成的伤害。'],
      ['sixEarEnding', 'killed', '六耳死在真相揭晓之后，这一棒让“何以为真”的问题始终带着血迹。'],
      ['scriptureTrust', 'verified', '灵山也曾递来无字白本；终点没有取消辨认真伪的责任。'],
      ['scriptureTrust', 'challenged', '藏经阁索取人事的规矩被当面问出，真经从此也带着对传经者的追问。'],
      ['scriptureTrust', 'silent', '无字白本曾因沉默而被背下灵山，圆满之前仍留下了一次未加查验的教训。'],
      ['wetScriptures', 'admitted', '通天河畔坦承忘诺，没能保住经卷干燥，却保住了修补信义的起点。'],
      ['wetScriptures', 'blamed', '老鼋沉入河底不再回头，湿经上的水痕也成了推诿旧诺的见证。'],
      ['wetScriptures', 'shared-rescue', '最后一次落水时，师徒先后托住彼此，也共同接住了散开的经卷。'],
      ['wetScriptures', 'documented', '晒石上粘破的经页被如实记下，圆满不再依靠遮住残缺成立。'],
      ['finalVow', 'share-scripture', '真经越过宫门与佛殿送往沿途州县，西行功果因此重新回到众生手中。'],
      ['finalVow', 'keep-defiance', '斗战胜佛仍保留齐天旧旗，封号没有终止对神佛责任的追问。'],
      ['finalVow', 'record-causes', '八十一难的误认、求援与失信都被写入经后，功德没有删去代价。'],
      ['finalVow', 'self-discipline', '紧箍自然消失后，悟空仍主动留下与师父共同定过的戒线。']
    ];
    const echoes = echoRules
      .filter(([flag, value]) => state.flags[flag] === value)
      .map(([, , echoText]) => echoText);
    if ((state.relationships.玄奘 || 0) <= -4) echoes.push('玄奘与你走到了灵山，未说开的旧伤却让归途仍隔着一步。');
    const selectedEchoes = echoes.length <= 6 ? echoes : [...echoes.slice(0, 2), ...echoes.slice(-4)];
    const title = ending.title;
    const seal = ending.seal;
    const text = [ending.text, fusionText, ...selectedEchoes].filter(Boolean).join(' ');
    const [endingSource, endingCaption] = endingVisuals[dominantRoute] || endingVisuals.insight;
    $('#endingHero').src = endingSource;
    $('#endingHero').alt = `${title}结局画面`;
    $('#endingHeroCaption').textContent = endingCaption;
    $('#endingSeal').textContent = seal;
    $('#endingTitle').textContent = title;
    $('#endingText').textContent = text;
    $('#endingStats').innerHTML = `<span><b>${state.resolve}</b>勇决</span><span><b>${state.mercy}</b>慈念</span><span><b>${state.insight}</b>悟见</span><span><b>${dominantScore}</b>${routeMeta[dominantRoute].label}</span><span><b>${total}</b>${isFusion ? '双路交汇' : '旅痕'}</span>`;
    state.completed = true;
    save();
    clearAuto();
    window.shadowplayVoice?.stop();
    playSound('gong');
    $('#endingModal').classList.add('open');
    $('#endingModal').setAttribute('aria-hidden', 'false');
    $('#endingModal').dataset.fusion = String(isFusion);
    syncModalState();
    syncBgm();
    requestAnimationFrame(() => $('#endingArchive').focus());
  }

  function hasJourneyProgress() {
    return state.furthestScene > 0 || state.marks.length > 0 || Object.keys(state.completedMiniGames).length > 0 || state.completed;
  }

  function hideStartMenu() {
    $('#startMenu').classList.remove('open');
    $('#startMenu').setAttribute('aria-hidden', 'true');
    syncModalState();
  }

  function showStartMenu() {
    save();
    clearAuto();
    clearChoiceCountdown();
    window.shadowplayVoice?.stop();
    const progressed = hasJourneyProgress();
    const furthest = positionFor(state.furthestScene);
    const scene = data.chapterData[furthest.chapter]?.trials[furthest.trial];
    $('#startSaveSummary').innerHTML = state.completed
      ? `<span><b>已通关</b> · ${state.marks.length} 次抉择</span><span>${Object.keys(state.completedMiniGames).length} 项互动记录</span>`
      : progressed
        ? `<span><b>第 ${state.furthestScene + 1} / 81 难</b> · ${scene?.[0] || '西行途中'}</span><span>${state.marks.length} 次抉择</span>`
        : '<span><b>尚未启程</b> · 新存档</span>';
    $('#startContinue').querySelector('b').textContent = state.completed ? '查看通关结局' : progressed ? '继续西行' : '开始旅程';
    const resumeHint = ['story', 'choices', 'response'].includes(state.mode)
      ? `从第 ${trialNumber()} 难刚才的对话继续`
      : `从第 ${state.furthestScene + 1} 难继续`;
    $('#startContinue').querySelector('small').textContent = state.completed ? '保留存档、回看全部经历' : progressed ? resumeHint : '从仙石崩裂开始';
    $('#startArchive').disabled = !progressed;
    $('#startJournal').disabled = !state.marks.length;
    $('#startRelations').disabled = !progressed;
    $('#startSound').querySelector('small').textContent = state.sound ? '配音、音效与背景乐已开启' : '当前已静音';
    syncAudioControls();
    $('#startMenu').classList.add('open');
    $('#startMenu').setAttribute('aria-hidden', 'false');
    syncModalState();
    syncBgm();
    requestAnimationFrame(() => $('#startContinue').focus());
  }

  function continueFromStart() {
    hideStartMenu();
    playSound('confirm');
    if (state.completed) finish();
    else if (['story', 'choices', 'response'].includes(state.mode)) resumePlay();
    else showInterlude();
  }

  function resumePlay() {
    initialInterlude = false;
    interlude.hidden = true;
    interlude.setAttribute('aria-hidden', 'true');
    app.classList.remove('is-interlude');
    if (state.mode === 'response' && state.pendingChoice !== null) {
      pendingResponseOption = currentChoices()[state.pendingChoice] || pendingResponseOption;
    }
    dialogueDeck.hidden = false;
    setHud();
    setBackdrop();
    renderLine();
    syncBgm();
  }

  function renderJourneyArchive() {
    if (state.completed && currentSceneIndex() < lastSceneIndex) recalculateScores(lastSceneIndex, lastSceneIndex);
    const scroll = $('#archiveScroll');
    scroll.replaceChildren();
    const miniResults = state.completedMiniGames || {};
    $('#archiveSummary').innerHTML = `<span><b>${state.marks.length}</b>次抉择</span><span><b>${Object.keys(miniResults).length}</b>项互动</span><span><b>${state.resolve}</b>勇决</span><span><b>${state.mercy}</b>慈念</span><span><b>${state.insight}</b>悟见</span><span class="archive-guide">从第一难向下连续翻阅 · 可回到任意已解锁经历</span><span class="archive-grade-key">互动评价：S 无双 · A 上乘 · B 稳健 · C 过关 · D 未竟</span>`;
    data.chapterData.forEach((chapter, chapterIndex) => {
      const section = document.createElement('section');
      section.className = 'archive-chapter';
      const heading = document.createElement('h3');
      heading.innerHTML = `${chapter.mark} · ${chapter.name}<small>${chapterIndex * 9 + 1}—${chapterIndex * 9 + 9} 难</small>`;
      const entries = document.createElement('div');
      entries.className = 'archive-entries';
      chapter.trials.forEach((trial, trialIndex) => {
        const sceneIndex = indexFor(chapterIndex, trialIndex);
        const key = `${chapterIndex}:${trialIndex}`;
        const mark = state.marks.find(entry => entry.chapter === chapterIndex && entry.trial === trialIndex);
        const gameResult = miniResults[key];
        const gradeLabels = window.ShadowplayMinigames?.gradeLabels || { S: '无双', A: '上乘', B: '稳健', C: '过关', D: '未竟' };
        const gameGradeLabel = gameResult ? (gameResult.skipped ? '已略过' : gradeLabels[gameResult.grade] || '已有记录') : '';
        const card = document.createElement('article');
        card.className = 'archive-entry';
        card.dataset.trait = mark?.trait || 'none';
        const number = document.createElement('span');
        number.textContent = `第 ${String(sceneIndex + 1).padStart(2, '0')} 难`; 
        const title = document.createElement('h4');
        title.textContent = trial[0];
        const summary = document.createElement('p');
        summary.textContent = trial[1];
        const choice = document.createElement('p');
        choice.className = 'archive-choice';
        choice.textContent = mark ? `你的抉择：${mark.text}` : sceneIndex <= state.furthestScene ? '剧情节点：此处没有留下抉择' : '尚未抵达';
        const outcome = document.createElement('p');
        outcome.textContent = mark?.outcome || '';
        outcome.hidden = !mark?.outcome;
        const interaction = document.createElement('p');
        interaction.className = 'archive-interaction';
        interaction.hidden = !gameResult;
        if (gameResult) {
          const grade = gameResult.grade || '—';
          const rating = Number.isFinite(Number(gameResult.rating)) ? ` · 表现分 ${Math.round(Number(gameResult.rating))}/100` : '';
          interaction.textContent = `互动结果：${gameGradeLabel}（${grade}级）${rating}`;
        }
        const review = document.createElement('button');
        review.type = 'button';
        review.textContent = sceneIndex <= state.furthestScene ? '回到此难 →' : '尚未解锁';
        review.disabled = sceneIndex > state.furthestScene;
        review.addEventListener('click', () => {
          if (review.disabled) return;
          closeJourneyArchive({ restoreFocus: false });
          $('#endingModal').classList.remove('open');
          hideStartMenu();
          goToScene(sceneIndex);
        });
        card.append(number, title, summary, choice, outcome, interaction, review);
        entries.append(card);
      });
      section.append(heading, entries);
      scroll.append(section);
    });
    scroll.scrollTop = 0;
  }

  function openJourneyArchive({ reviewMode = false } = {}) {
    renderJourneyArchive();
    $('#archiveTitle').textContent = reviewMode ? '自由回看 · 八十一难' : '八十一难经历长卷';
    $('#journeyArchive').dataset.mode = reviewMode ? 'review' : 'scroll';
    $('#journeyArchive').classList.add('open');
    $('#journeyArchive').setAttribute('aria-hidden', 'false');
    playSound('page');
    syncModalState();
    requestAnimationFrame(() => $('#closeArchive').focus());
  }

  function closeJourneyArchive({ restoreFocus = true } = {}) {
    if (!$('#journeyArchive').classList.contains('open')) return;
    $('#journeyArchive').classList.remove('open');
    $('#journeyArchive').setAttribute('aria-hidden', 'true');
    syncModalState();
    if (restoreFocus) ($('#endingModal').classList.contains('open') ? $('#endingArchive') : $('#startArchive')).focus();
  }

  function modalNodes() {
    return ['#confirmationModal', '#journeyArchive', '#miniGame', '#skipSummary', '#overlayPanel', '#pauseMenu', '#endingModal', '#startMenu'].map($);
  }

  function topModal() {
    return modalNodes().find(element => element.classList.contains('open')) || null;
  }

  function syncModalState() {
    const top = topModal();
    ['.hud', '.cast-stage', '#interlude', '#dialogueDeck', '#sceneCurtain', '#consequenceStack'].map($).forEach(element => {
      element.inert = Boolean(top);
    });
    modalNodes().forEach(element => {
      const visible = element === top && element.classList.contains('open');
      element.inert = Boolean(top && element !== top);
      element.setAttribute('aria-hidden', String(!visible));
    });
    app.classList.toggle('modal-open', Boolean(top));
  }

  function openConfirmation({ kicker = '确认操作', title, text, confirmLabel = '确认', onConfirm }, trigger = document.activeElement) {
    confirmationFocusReturn = trigger;
    confirmationAction = typeof onConfirm === 'function' ? onConfirm : null;
    clearAuto();
    $('#confirmationKicker').textContent = kicker;
    $('#confirmationTitle').textContent = title;
    $('#confirmationText').textContent = text;
    $('#confirmAction').textContent = confirmLabel;
    $('#confirmationModal').classList.add('open');
    $('.confirmation-panel').scrollTop = 0;
    syncModalState();
    requestAnimationFrame(() => $('#cancelConfirmation').focus());
  }

  function closeConfirmation({ restoreFocus = true, confirm = false } = {}) {
    if (!$('#confirmationModal').classList.contains('open')) return;
    const action = confirm ? confirmationAction : null;
    confirmationAction = null;
    $('#confirmationModal').classList.remove('open');
    syncModalState();
    if (action) action();
    else if (restoreFocus) (confirmationFocusReturn?.isConnected ? confirmationFocusReturn : $('#pauseBtn')).focus();
  }

  function reset() {
    state.chapter = 0;
    state.trial = 0;
    state.resolve = 0;
    state.mercy = 0;
    state.insight = 0;
    state.marks = [];
    state.relationships = {};
    state.flags = {};
    state.routeScores = {};
    state.decisionHistory = [];
    state.completedMiniGames = {};
    state.filletWorn = false;
    state.furthestScene = 0;
    state.auto = false;
    state.mode = 'interlude';
    state.lineIndex = 0;
    state.pendingChoice = null;
    state.completed = false;
    miniGameState = null;
    cleanupMiniGameActivity();
    initialInterlude = false;
    confirmationAction = null;
    window.shadowplayVoice?.stop();
    recalculateScores(-1);
    $('#endingModal').classList.remove('open');
    $('#endingModal').setAttribute('aria-hidden', 'true');
    $('#journeyArchive').classList.remove('open');
    $('#journeyArchive').setAttribute('aria-hidden', 'true');
    $('#startMenu').classList.remove('open');
    $('#startMenu').setAttribute('aria-hidden', 'true');
    $('#pauseMenu').classList.remove('open');
    $('#pauseMenu').setAttribute('aria-hidden', 'true');
    $('#pauseBtn').setAttribute('aria-expanded', 'false');
    $('#skipSummary').classList.remove('open');
    $('#skipSummary').setAttribute('aria-hidden', 'true');
    $('#miniGame').classList.remove('open');
    $('#miniGame').setAttribute('aria-hidden', 'true');
    $('#overlayPanel').classList.remove('open');
    $('#overlayPanel').setAttribute('aria-hidden', 'true');
    $('#confirmationModal').classList.remove('open');
    $('#confirmationModal').setAttribute('aria-hidden', 'true');
    $('#consequenceStack').replaceChildren();
    syncModalState();
    save();
    showInterlude();
  }

  function openPause(trigger = $('#pauseBtn')) {
    if ($('#pauseMenu').classList.contains('open')) return;
    pauseFocusReturn = trigger;
    setHud();
    clearAuto();
    clearChoiceCountdown();
    window.shadowplayVoice?.stop();
    playSound('pluck');
    $('#pauseMenu').classList.add('open');
    $('#pauseMenu').setAttribute('aria-hidden', 'false');
    $('#pauseBtn').setAttribute('aria-expanded', 'true');
    $('.pause-panel').scrollTop = 0;
    syncAudioControls();
    syncModalState();
    requestAnimationFrame(() => $('#closeMenu').focus());
  }

  function closePause({ restoreFocus = true, resumeAuto = true } = {}) {
    if (!$('#pauseMenu').classList.contains('open')) return;
    $('#pauseMenu').classList.remove('open');
    $('#pauseMenu').setAttribute('aria-hidden', 'true');
    $('#pauseBtn').setAttribute('aria-expanded', 'false');
    syncModalState();
    if (restoreFocus) (pauseFocusReturn?.isConnected ? pauseFocusReturn : $('#pauseBtn')).focus();
    if (state.mode === 'choices' && !activeModal()) renderLine();
    else if (resumeAuto && state.auto && state.mode !== 'interlude' && !activeModal()) renderLine();
  }

  function closeOverlay({ restoreFocus = true } = {}) {
    if (!$('#overlayPanel').classList.contains('open')) return;
    if (restoreFocus && $('#overlayPanel').dataset.kind === 'relations') playSound('pluck');
    $('#overlayPanel').classList.remove('open');
    $('#overlayPanel').setAttribute('aria-hidden', 'true');
    if ($('#pauseMenu').classList.contains('open')) $('#pauseMenu').setAttribute('aria-hidden', 'false');
    syncModalState();
    if (restoreFocus) (overlayFocusReturn?.isConnected ? overlayFocusReturn : $('#pauseBtn')).focus();
    if (state.auto && state.mode !== 'interlude' && !activeModal()) renderLine();
  }

  function skipSummaryText() {
    const trial = currentTrial();
    const remaining = state.mode === 'interlude'
      ? storyLines()
      : lines().slice(Math.min(state.lineIndex + 1, lines().length));
    const beats = remaining
      .filter(line => line.text)
      .map(line => line.text.replace(/[“”]/g, ''))
      .slice(0, 3);
    const targetIndex = isPlayerScene(state.chapter, state.trial)
      ? currentSceneIndex()
      : nextPlayerSceneIndex(currentSceneIndex() + 1);
    const bridge = [];
    if (targetIndex !== null) {
      for (let sceneIndex = currentSceneIndex() + 1; sceneIndex <= targetIndex; sceneIndex += 1) {
        const position = positionFor(sceneIndex);
        const scene = data.chapterData[position.chapter].trials[position.trial];
        bridge.push(`${scene[0]}：${scene[1]}`);
      }
    }
    return [`${trial[0]}：${trial[1]}`, ...beats, ...bridge].filter(Boolean).join(' ');
  }

  function openSkipSummary(trigger = $('#skipBtn')) {
    if (state.mode === 'choices' || $('#skipSummary').classList.contains('open') || $('#miniGame').classList.contains('open')) return;
    skipFocusReturn = trigger;
    clearAuto();
    window.shadowplayVoice?.stop();
    $('#skipSummaryText').textContent = skipSummaryText();
    const targetIndex = isPlayerScene(state.chapter, state.trial)
      ? currentSceneIndex()
      : nextPlayerSceneIndex(currentSceneIndex() + 1);
    $('#confirmSkip').textContent = targetIndex === currentSceneIndex()
      ? '直达选择'
      : targetIndex === null
        ? '完成旅程'
        : `略至第 ${String(targetIndex + 1).padStart(2, '0')} 难选择`;
    playSound('pluck');
    $('#skipSummary').classList.add('open');
    $('#skipSummary').setAttribute('aria-hidden', 'false');
    $('.skip-summary-panel').scrollTop = 0;
    syncModalState();
    requestAnimationFrame(() => $('#confirmSkip').focus());
  }

  function closeSkipSummary({ restoreFocus = true } = {}) {
    if (!$('#skipSummary').classList.contains('open')) return;
    $('#skipSummary').classList.remove('open');
    $('#skipSummary').setAttribute('aria-hidden', 'true');
    syncModalState();
    if (restoreFocus) (skipFocusReturn?.isConnected ? skipFocusReturn : $('#skipBtn')).focus();
    if (state.auto && state.mode !== 'interlude' && !activeModal()) renderLine();
  }

  function confirmSkipSummary() {
    const wasResponse = state.mode === 'response';
    if (state.mode === 'interlude') {
      interlude.hidden = true;
      interlude.setAttribute('aria-hidden', 'true');
      app.classList.remove('is-interlude');
      state.mode = 'story';
    }
    closeSkipSummary({ restoreFocus: false });
    if (wasResponse) {
      advanceScene();
      return;
    }
    if (isPlayerScene(state.chapter, state.trial)) {
      enterChoices({ skipInteraction: true });
      return;
    }
    const targetIndex = nextPlayerSceneIndex(currentSceneIndex() + 1);
    if (targetIndex === null) {
      advanceScene();
      return;
    }
    const target = positionFor(targetIndex);
    state.chapter = target.chapter;
    state.trial = target.trial;
    state.furthestScene = Math.max(state.furthestScene, targetIndex);
    state.mode = 'story';
    state.lineIndex = 0;
    state.pendingChoice = null;
    save();
    enterChoices({ skipInteraction: true });
  }

  function miniGameType(game) {
    if (window.ShadowplayMinigames?.miniGameType) return window.ShadowplayMinigames.miniGameType(game);
    return ['quiz', 'duel', 'battle', 'catch'].includes(game?.type) ? game.type : 'quiz';
  }

  function miniGameScoreLimit(game) {
    if (window.ShadowplayMinigames?.scoreLimit) return window.ShadowplayMinigames.scoreLimit(game);
    if (!game) return 0;
    if (miniGameType(game) === 'battle') return Math.max(0, game.waves?.length || 0);
    if (miniGameType(game) === 'catch') return Math.max(0, Number(game.targetScore) || 0);
    return Math.max(0, game.rounds?.length || 0);
  }

  function miniGamePassScore(game) {
    if (window.ShadowplayMinigames?.passScore) return window.ShadowplayMinigames.passScore(game);
    const limit = miniGameScoreLimit(game);
    const fallback = miniGameType(game) === 'quiz' ? Math.ceil(limit * 2 / 3)
      : miniGameType(game) === 'duel' ? Math.ceil(limit / 2)
        : limit;
    return clampInteger(game?.passScore ?? fallback, 0, limit);
  }

  function scheduleMiniGame(callback, delay) {
    const timer = window.setTimeout(() => {
      miniGameTimers.delete(timer);
      callback();
    }, delay);
    miniGameTimers.add(timer);
    return timer;
  }

  function addMiniGameListener(target, type, listener, options) {
    target.addEventListener(type, listener, options);
    miniGameDisposers.push(() => target.removeEventListener(type, listener, options));
  }

  function cleanupLegacyMiniGameActivity() {
    miniGameTimers.forEach(timer => window.clearTimeout(timer));
    miniGameTimers.clear();
    if (miniGameFrame !== null) window.cancelAnimationFrame?.(miniGameFrame);
    miniGameFrame = null;
    miniGameDisposers.forEach(dispose => dispose());
    miniGameDisposers = [];
    miniGameState?.keys?.clear?.();
  }

  function cleanupMiniGameActivity() {
    miniGameSession?.destroy?.();
    miniGameSession = null;
    cleanupLegacyMiniGameActivity();
  }

  function miniGameNode(tag, className = '', text = '') {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function prepareMiniGame(game) {
    const type = miniGameType(game);
    const playfield = $('#miniGamePlayfield');
    const options = $('#miniGameOptions');
    $('#miniGame').dataset.game = game.id;
    $('#miniGame').dataset.type = type;
    $('#miniGameTitle').textContent = game.title;
    $('#miniGameIntro').textContent = game.intro;
    $('#miniGamePrompt').textContent = game.prompt || '';
    $('#miniGameResult').textContent = '';
    $('#skipMiniGame').hidden = false;
    playfield.hidden = type === 'quiz';
    playfield.replaceChildren();
    delete playfield.dataset.theme;
    options.hidden = false;
    options.replaceChildren();
    delete options.dataset.layout;
  }

  function miniGameMetricSummary(result) {
    const metrics = result?.metrics || {};
    const elapsed = Number(metrics.elapsedMs) > 0 ? `${(Number(metrics.elapsedMs) / 1000).toFixed(1)} 秒` : null;
    if (result?.type === 'battle') return [
      elapsed && ['用时', elapsed],
      ['余命', `${Math.max(0, Math.round(Number(metrics.remainingHealth) || 0))}`],
      ['反击', `${Math.max(0, Math.round(Number(metrics.preciseCounters) || 0))} 次`],
      ['连击', `${Math.max(0, Math.round(Number(metrics.maxCombo) || 0))} 连`]
    ].filter(Boolean);
    if (result?.type === 'catch') return [
      elapsed && ['用时', elapsed],
      ['护身', `${Math.max(0, Math.round(Number(metrics.remainingLives) || 0))}`],
      ['完美', `${Math.max(0, Math.round(Number(metrics.perfectCatches) || 0))} 次`],
      ['连击', `${Math.max(0, Math.round(Number(metrics.maxCombo) || 0))} 连`]
    ].filter(Boolean);
    if (result?.type === 'duel') return [
      ['胜手', `${Math.max(0, Math.round(Number(metrics.wins) || 0))} / ${Math.max(0, Math.round(Number(metrics.rounds) || 0))}`],
      ['平手', `${Math.max(0, Math.round(Number(metrics.draws) || 0))}`],
      ['连胜', `${Math.max(0, Math.round(Number(metrics.maxWinStreak) || 0))}`]
    ];
    return [['答对', `${result?.score || 0} / ${result?.maximum || miniGameScoreLimit(miniGameState?.game)}`]];
  }

  function renderMiniGameCompletion({ message = '', result: suppliedResult = null } = {}) {
    if (!miniGameState) return;
    cleanupLegacyMiniGameActivity();
    const game = miniGameState.game;
    const fallbackWon = miniGameState.score >= miniGamePassScore(game);
    const fallbackMetrics = miniGameType(game) === 'quiz'
      ? { correct: miniGameState.score, rounds: miniGameScoreLimit(game), completed: fallbackWon }
      : { completed: fallbackWon };
    const result = suppliedResult || miniGameState.result || window.ShadowplayMinigames?.buildResult?.(game, {
      score: miniGameState.score,
      passed: fallbackWon,
      metrics: fallbackMetrics,
      message
    }) || {
      version: 1,
      type: miniGameType(game),
      score: miniGameState.score,
      maximum: miniGameScoreLimit(game),
      passed: fallbackWon,
      rating: fallbackWon ? 60 : 0,
      grade: fallbackWon ? 'B' : 'D',
      metrics: fallbackMetrics,
      message
    };
    miniGameState.score = result.score;
    miniGameState.result = result;
    miniGameState.locked = true;
    miniGameState.complete = true;
    $('#skipMiniGame').hidden = true;
    const won = result.passed;
    $('#miniGameProgress').textContent = won ? '互动 · 已完成' : '互动 · 未竟';
    $('#miniGamePrompt').textContent = won ? '这一段身手已写入旅痕。' : '可以重试，也可以保留这次结果继续。';
    $('#miniGameResult').textContent = result.message || message || (won ? '胜负已定。' : '这次没有达成目标。');
    const options = $('#miniGameOptions');
    options.hidden = false;
    options.dataset.layout = 'completion';
    options.replaceChildren();
    const rating = miniGameNode('section', 'mini-game-rating');
    rating.setAttribute('aria-label', `评价 ${result.grade}，表现分 ${result.rating}`);
    const grade = miniGameNode('b', 'mini-game-grade', result.grade);
    const ratingCopy = miniGameNode('div', 'mini-game-rating-copy');
    ratingCopy.append(
      miniGameNode('strong', '', window.ShadowplayMinigames?.gradeLabels?.[result.grade] || (won ? '完成' : '未竟')),
      miniGameNode('small', '', `表现 ${result.rating} / 100`)
    );
    const metrics = miniGameNode('div', 'mini-game-metrics');
    miniGameMetricSummary(result).forEach(([label, value]) => {
      const item = miniGameNode('span');
      item.append(miniGameNode('small', '', label), miniGameNode('b', '', value));
      metrics.append(item);
    });
    rating.append(grade, ratingCopy, metrics);
    const retry = miniGameNode('button', 'mini-game-retry', '重试本段');
    retry.type = 'button';
    retry.addEventListener('click', restartMiniGame);
    const proceed = miniGameNode('button', 'mini-game-proceed', won ? '收势继续' : '按此战果继续');
    proceed.type = 'button';
    proceed.addEventListener('click', () => finishMiniGame());
    options.append(rating, retry, proceed);
    requestAnimationFrame(() => proceed.focus());
  }

  function closeMiniGame({ restoreFocus = true } = {}) {
    cleanupMiniGameActivity();
    if (!$('#miniGame').classList.contains('open')) return;
    $('#miniGame').classList.remove('open');
    $('#miniGame').setAttribute('aria-hidden', 'true');
    delete $('#miniGame').dataset.game;
    delete $('#miniGame').dataset.type;
    $('#miniGamePlayfield').replaceChildren();
    syncModalState();
    if (restoreFocus) (miniGameFocusReturn?.isConnected ? miniGameFocusReturn : dialogueDeck).focus();
    syncBgm();
  }

  function finishMiniGame({ skipped = false } = {}) {
    if (!miniGameState) return;
    const key = miniGameState.key;
    const game = miniGameState.game;
    const replay = Boolean(miniGameState.replay);
    const storyBeat = Boolean(miniGameState.storyBeat);
    const previous = state.completedMiniGames[key] || null;
    const fallbackResult = window.ShadowplayMinigames?.buildResult?.(game, {
      score: miniGameState.score,
      passed: !skipped && miniGameState.score >= miniGamePassScore(game),
      metrics: { completed: false },
      message: ''
    });
    const result = skipped ? fallbackResult : miniGameState.result || fallbackResult;
    const score = clampInteger(result?.score ?? miniGameState.score, 0, miniGameScoreLimit(game));
    const rewarded = !skipped && (result?.passed === true || score >= miniGamePassScore(game));
    const grade = skipped ? 'D' : result?.grade || (rewarded ? 'B' : 'D');
    const rating = skipped ? 0 : clampInteger(result?.rating, 0, 100);
    const nextResult = {
      version: 2,
      skipped: replay ? Boolean(previous?.skipped) && skipped : skipped,
      rewarded: Boolean(previous?.rewarded) || rewarded,
      score,
      grade,
      rating,
      metrics: skipped ? (previous?.metrics || {}) : { ...(result?.metrics || {}) }
    };
    if (!previous || score >= (Number(previous.score) || 0)) state.completedMiniGames[key] = nextResult;
    else state.completedMiniGames[key] = { ...previous, rewarded: nextResult.rewarded };
    miniGameState = null;
    recalculateScores(currentSceneIndex() - 1, currentSceneIndex());
    save();
    closeMiniGame({ restoreFocus: false });
    if (replay) showConsequence('这是回看重温，首次留下的因缘与路线奖励不会再发一次', '互动重温');
    else if (skipped) showConsequence('你略过了本次互动，未获得额外关系变化', '互动已略过');
    else if (rewarded) {
      playSound('gong');
      const mastered = ['S', 'A'].includes(grade);
      const gradeLabel = window.ShadowplayMinigames?.gradeLabels?.[grade] || grade;
      const feedback = `${game.feedback}${mastered ? ` · ${gradeLabel}（${grade}级），已留下精通旅痕` : ` · 互动评价：${gradeLabel}（${grade}级）`}`;
      showConsequence({ feedback, relations: game.reward?.relations || {} }, mastered ? '互动精通' : '互动完成');
    } else showConsequence('本次未达成目标，互动结果已保留，但没有获得额外路线加成', '互动未竟');
    if (state.pendingChoice !== null && pendingResponseOption) {
      state.mode = 'response';
      state.lineIndex = 0;
      save();
      renderLine();
      return;
    }
    if (storyBeat && state.mode === 'story') {
      save();
      renderLine();
      return;
    }
    enterChoices({ skipInteraction: true });
  }

  function renderQuizRound() {
    if (!miniGameState) return;
    const { game, roundIndex } = miniGameState;
    const round = game.rounds[roundIndex];
    $('#miniGameProgress').textContent = `互动 · ${roundIndex + 1} / ${game.rounds.length}`;
    $('#miniGamePrompt').textContent = round.prompt;
    $('#miniGamePlayfield').hidden = true;
    $('#miniGameResult').textContent = '';
    const options = $('#miniGameOptions');
    options.hidden = false;
    options.replaceChildren();
    round.options.forEach((text, index) => {
      const button = miniGameNode('button', '', text);
      button.type = 'button';
      button.dataset.option = String(index);
      button.setAttribute('aria-keyshortcuts', String(index + 1));
      button.addEventListener('click', () => {
        if (!miniGameState || miniGameState.locked) return;
        miniGameState.locked = true;
        const correct = index === round.answer;
        if (correct) miniGameState.score += 1;
        playSound(correct ? 'pluck' : 'drum');
        [...options.children].forEach((candidate, candidateIndex) => {
          candidate.disabled = true;
          candidate.classList.toggle('correct', candidateIndex === round.answer);
          candidate.classList.toggle('incorrect', candidateIndex === index && !correct);
        });
        const resultText = correct
          ? round.success || '判断正确，可以继续前进。'
          : round.failure || `这一步偏了，正确判断是“${round.options[round.answer]}”。`;
        $('#miniGameResult').textContent = resultText;
        const resultDelay = Math.max(1100, Math.min(2100, 760 + resultText.length * 42));
        scheduleMiniGame(() => {
          if (!miniGameState) return;
          miniGameState.roundIndex += 1;
          miniGameState.locked = false;
          if (miniGameState.roundIndex >= game.rounds.length) {
            renderMiniGameCompletion({ message: `答对 ${miniGameState.score} / ${game.rounds.length} 题。` });
          } else renderQuizRound();
        }, resultDelay);
      });
      options.append(button);
    });
    requestAnimationFrame(() => options.querySelector('button')?.focus());
  }

  const duelMoves = Object.freeze({
    attack: Object.freeze({ seal: '攻', label: '直攻', detail: '压制变化' }),
    guard: Object.freeze({ seal: '架', label: '横架', detail: '截住攻势' }),
    trick: Object.freeze({ seal: '变', label: '变化', detail: '绕开守势' })
  });
  const duelBeats = Object.freeze({ attack: 'trick', guard: 'attack', trick: 'guard' });

  function duelOutcome(playerMove, opponentMove) {
    if (playerMove === opponentMove) return 'draw';
    return duelBeats[playerMove] === opponentMove ? 'win' : 'loss';
  }

  function renderDuelRound() {
    if (!miniGameState) return;
    const { game, roundIndex } = miniGameState;
    const round = game.rounds[roundIndex];
    const playfield = $('#miniGamePlayfield');
    const outcomes = miniGameState.outcomes || [];
    $('#miniGameProgress').textContent = `斗法 · ${roundIndex + 1} / ${game.rounds.length}`;
    $('#miniGamePrompt').textContent = game.prompt;
    $('#miniGameResult').textContent = '';
    playfield.hidden = false;
    playfield.dataset.theme = 'duel';
    playfield.replaceChildren();

    const board = miniGameNode('div', 'duel-board');
    const tally = miniGameNode('div', 'duel-tally');
    tally.setAttribute('aria-label', `已胜 ${miniGameState.score} 手`);
    game.rounds.forEach((unused, index) => {
      const mark = miniGameNode('i', 'duel-mark');
      mark.dataset.outcome = outcomes[index] || 'pending';
      tally.append(mark);
    });
    const tell = miniGameNode('p', 'duel-tell', `预兆：${round.tell}`);
    const hands = miniGameNode('div', 'duel-hands');
    const playerSide = miniGameNode('div', 'duel-side duel-player');
    const playerName = miniGameNode('strong', '', '孙悟空');
    const playerHand = miniGameNode('i', 'duel-hand');
    playerHand.dataset.row = 'wukong';
    playerHand.dataset.move = 'waiting';
    playerHand.setAttribute('aria-hidden', 'true');
    playerSide.append(playerName, playerHand);
    const versus = miniGameNode('b', 'duel-versus');
    versus.append(miniGameNode('span', '', '斗'));
    const opponentSide = miniGameNode('div', 'duel-side duel-opponent');
    const opponentName = miniGameNode('strong', '', game.opponentName);
    const opponentHand = miniGameNode('i', 'duel-hand');
    opponentHand.dataset.row = game.opponentRow || 'erlang';
    opponentHand.dataset.move = 'waiting';
    opponentHand.setAttribute('aria-hidden', 'true');
    opponentSide.append(opponentName, opponentHand);
    hands.append(playerSide, versus, opponentSide);
    board.append(tally, tell, hands);
    playfield.append(board);

    const options = $('#miniGameOptions');
    options.hidden = false;
    options.dataset.layout = 'duel';
    options.replaceChildren();
    Object.entries(duelMoves).forEach(([move, meta], index) => {
      const button = miniGameNode('button', 'duel-move');
      button.type = 'button';
      button.dataset.move = move;
      button.dataset.option = String(index);
      button.setAttribute('aria-keyshortcuts', String(index + 1));
      button.append(miniGameNode('span', 'duel-move-seal', meta.seal), miniGameNode('b', '', meta.label), miniGameNode('small', '', meta.detail));
      button.addEventListener('click', () => {
        if (!miniGameState || miniGameState.locked) return;
        miniGameState.locked = true;
        const opponentMove = round.opponent;
        const outcome = duelOutcome(move, opponentMove);
        const won = outcome === 'win';
        const lost = outcome === 'loss';
        if (won) miniGameState.score += 1;
        miniGameState.outcomes[roundIndex] = outcome;
        const currentMark = tally.children[roundIndex];
        if (currentMark) currentMark.dataset.outcome = outcome;
        tally.setAttribute('aria-label', `已胜 ${miniGameState.score} 手，完成 ${roundIndex + 1} / ${game.rounds.length} 手`);
        playerHand.dataset.move = move;
        opponentHand.dataset.move = opponentMove;
        board.dataset.revealed = 'true';
        [...options.children].forEach(candidate => { candidate.disabled = true; });
        button.classList.add(outcome);
        const result = won
          ? `${duelMoves[move].label}克住${duelMoves[opponentMove].label}，你赢下一手。`
          : lost
            ? `${duelMoves[opponentMove].label}抢得先机，这一手落后。`
            : `两边同时使出${duelMoves[move].label}，这一手相持。`;
        $('#miniGameResult').textContent = result;
        playSound(won ? 'pluck' : lost ? 'drum' : 'clack');
        scheduleMiniGame(() => {
          if (!miniGameState) return;
          miniGameState.roundIndex += 1;
          miniGameState.locked = false;
          if (miniGameState.roundIndex >= game.rounds.length) {
            renderMiniGameCompletion({ message: `五次斗法赢下 ${miniGameState.score} 手。` });
          } else renderDuelRound();
        }, 1250);
      });
      options.append(button);
    });
    requestAnimationFrame(() => options.querySelector('button')?.focus());
  }

  function updateBattleMeter(meter, value, maximum) {
    const safeValue = Math.max(0, Math.min(maximum, value));
    meter.setAttribute('aria-valuenow', String(Math.round(safeValue)));
    meter.style.setProperty('--meter-value', `${maximum ? safeValue / maximum * 100 : 0}%`);
  }

  function battleMeter(label, value, maximum) {
    const wrap = miniGameNode('div', 'battle-meter');
    wrap.append(miniGameNode('span', '', label));
    const meter = miniGameNode('i', 'battle-meter-track');
    meter.setAttribute('role', 'progressbar');
    meter.setAttribute('aria-label', label);
    meter.setAttribute('aria-valuemin', '0');
    meter.setAttribute('aria-valuemax', String(maximum));
    updateBattleMeter(meter, value, maximum);
    wrap.append(meter);
    return { wrap, meter };
  }

  function bindHeldControl(button, key, keys) {
    const press = event => {
      event.preventDefault();
      keys.add(key);
      button.classList.add('pressed');
    };
    const release = event => {
      event.preventDefault();
      keys.delete(key);
      button.classList.remove('pressed');
    };
    addMiniGameListener(button, 'pointerdown', press);
    addMiniGameListener(button, 'pointerup', release);
    addMiniGameListener(button, 'pointercancel', release);
    addMiniGameListener(button, 'pointerleave', release);
  }

  function startBattleGame() {
    if (!miniGameState) return;
    const game = miniGameState.game;
    const playfield = $('#miniGamePlayfield');
    const options = $('#miniGameOptions');
    playfield.hidden = false;
    playfield.dataset.theme = 'battle';
    options.hidden = true;
    $('#miniGameProgress').textContent = `战斗 · 1 / ${game.waves.length}`;

    const shell = miniGameNode('div', 'battle-shell');
    const hud = miniGameNode('div', 'battle-hud');
    const playerMeter = battleMeter('悟空', game.playerHealth, game.playerHealth);
    const waveLabel = miniGameNode('strong', 'battle-wave-label', game.waves[0].name);
    const enemyMeter = battleMeter(game.waves[0].name, game.waves[0].health, game.waves[0].health);
    hud.append(playerMeter.wrap, waveLabel, enemyMeter.wrap);
    const scene = miniGameNode('div', 'battle-scene');
    scene.style.backgroundImage = `linear-gradient(rgba(3,3,4,.18),rgba(3,3,4,.64)),url("${game.backdrop}")`;
    const warning = miniGameNode('i', 'battle-warning');
    warning.setAttribute('aria-hidden', 'true');
    const player = miniGameNode('div', 'battle-fighter battle-player');
    player.setAttribute('role', 'img');
    player.setAttribute('aria-label', '孙悟空');
    const playerImage = miniGameNode('img');
    playerImage.src = game.playerArt;
    playerImage.alt = '';
    player.append(playerImage);
    const enemy = miniGameNode('div', 'battle-fighter battle-enemy');
    enemy.setAttribute('role', 'img');
    const enemyImage = miniGameNode('img');
    enemyImage.alt = '';
    enemy.append(enemyImage);
    const spark = miniGameNode('i', 'battle-spark');
    spark.setAttribute('aria-hidden', 'true');
    const status = miniGameNode('p', 'battle-status', '山门鼓响，第一阵压来。');
    scene.append(warning, player, enemy, spark, status);

    const controls = miniGameNode('div', 'mini-touch-controls battle-controls');
    const left = miniGameNode('button', '', '←');
    left.type = 'button';
    left.setAttribute('aria-label', '向左移动');
    left.dataset.key = 'A / ←';
    const right = miniGameNode('button', '', '→');
    right.type = 'button';
    right.setAttribute('aria-label', '向右移动');
    right.dataset.key = 'D / →';
    const attack = miniGameNode('button', 'action', '棒');
    attack.type = 'button';
    attack.setAttribute('aria-label', '金箍棒攻击');
    attack.dataset.key = 'J / Space';
    const dodge = miniGameNode('button', 'action', '闪');
    dodge.type = 'button';
    dodge.setAttribute('aria-label', '闪身躲避');
    dodge.dataset.key = 'K / Shift';
    controls.append(left, right, attack, dodge);
    shell.append(hud, scene, controls);
    playfield.append(shell);

    Object.assign(miniGameState, {
      keys: new Set(),
      playerX: 20,
      playerHealth: game.playerHealth,
      playerMaxHealth: game.playerHealth,
      enemyX: 80,
      enemyHealth: 0,
      enemyMaxHealth: 0,
      waveIndex: 0,
      enemyAttackAt: 0,
      nextEnemyAttack: 0,
      attackReady: 0,
      dodgeReady: 0,
      invulnerableUntil: 0,
      enemyDown: false,
      ended: false,
      lastFrame: 0,
      battleRefs: { playerMeter: playerMeter.meter, enemyMeter: enemyMeter.meter, waveLabel, player, enemy, enemyImage, warning, spark, status, controls }
    });

    const loadWave = index => {
      if (!miniGameState || miniGameState.type !== 'battle') return;
      const wave = game.waves[index];
      miniGameState.waveIndex = index;
      miniGameState.enemyX = 80;
      miniGameState.enemyHealth = wave.health;
      miniGameState.enemyMaxHealth = wave.health;
      miniGameState.enemyAttackAt = 0;
      miniGameState.nextEnemyAttack = 0;
      miniGameState.enemyDown = false;
      enemy.className = 'battle-fighter battle-enemy';
      enemy.dataset.tone = wave.tone || 'heaven';
      enemy.setAttribute('aria-label', wave.name);
      enemyImage.src = wave.art;
      waveLabel.textContent = wave.name;
      enemyMeter.wrap.querySelector('span').textContent = wave.name;
      enemyMeter.meter.setAttribute('aria-label', wave.name);
      enemyMeter.meter.setAttribute('aria-valuemax', String(wave.health));
      updateBattleMeter(enemyMeter.meter, wave.health, wave.health);
      $('#miniGameProgress').textContent = `战斗 · ${index + 1} / ${game.waves.length}`;
      status.textContent = index ? `${wave.name}踏入阵前。` : '山门鼓响，第一阵压来。';
    };

    const finishWave = () => {
      if (!miniGameState || miniGameState.enemyDown) return;
      miniGameState.enemyDown = true;
      miniGameState.enemyAttackAt = 0;
      miniGameState.score = miniGameState.waveIndex + 1;
      enemy.classList.add('defeated');
      warning.classList.remove('visible');
      playSound('gong');
      if (miniGameState.waveIndex + 1 >= game.waves.length) {
        miniGameState.ended = true;
        controls.querySelectorAll('button').forEach(button => { button.disabled = true; });
        status.textContent = '最后一阵退去，山门仍在身后。';
        scheduleMiniGame(() => renderMiniGameCompletion({ message: `击退 ${miniGameState?.score || game.waves.length} / ${game.waves.length} 阵。` }), 850);
      } else {
        status.textContent = `${game.waves[miniGameState.waveIndex].name}退阵，下一阵将至。`;
        scheduleMiniGame(() => loadWave(miniGameState.waveIndex + 1), 850);
      }
    };

    const attackEnemy = () => {
      if (!miniGameState || miniGameState.ended || miniGameState.enemyDown) return;
      const now = window.performance?.now?.() || Date.now();
      if (now < miniGameState.attackReady) return;
      miniGameState.attackReady = now + 430;
      player.classList.add('attacking');
      scheduleMiniGame(() => player.classList.remove('attacking'), 190);
      playSound('strike');
      if (Math.abs(miniGameState.enemyX - miniGameState.playerX) > 19) {
        status.textContent = '金箍棒扫过空处，须再近一些。';
        return;
      }
      const counter = Boolean(miniGameState.enemyAttackAt && miniGameState.enemyAttackAt - now <= 220);
      const damage = game.attackPower + (counter ? 6 : 0);
      miniGameState.enemyHealth = Math.max(0, miniGameState.enemyHealth - damage);
      if (counter) {
        miniGameState.enemyAttackAt = 0;
        miniGameState.nextEnemyAttack = now + game.waves[miniGameState.waveIndex].attackRate;
        warning.classList.remove('visible');
        enemy.classList.remove('winding');
      }
      playSound('impact');
      enemy.classList.add('hit');
      spark.classList.remove('burst');
      void spark.offsetWidth;
      spark.classList.add('burst');
      scheduleMiniGame(() => enemy.classList.remove('hit'), 220);
      updateBattleMeter(enemyMeter.meter, miniGameState.enemyHealth, miniGameState.enemyMaxHealth);
      status.textContent = counter
        ? '你卡在落招前截断蓄势，反手压住这一击。'
        : miniGameState.enemyAttackAt
          ? '金箍棒命中，但朱砂预兆仍在逼近。'
          : '金箍棒命中，对手向后退开。';
      if (miniGameState.enemyHealth <= 0) finishWave();
    };

    const dodgeAttack = () => {
      if (!miniGameState || miniGameState.ended) return;
      const now = window.performance?.now?.() || Date.now();
      if (now < miniGameState.dodgeReady) return;
      miniGameState.dodgeReady = now + 1050;
      miniGameState.invulnerableUntil = now + 520;
      const away = miniGameState.enemyX >= miniGameState.playerX ? -1 : 1;
      miniGameState.playerX = Math.max(7, Math.min(93, miniGameState.playerX + away * 12));
      player.classList.add('dodging');
      scheduleMiniGame(() => player.classList.remove('dodging'), 340);
      playSound('dodge');
      status.textContent = '身影一低，重击从肩侧掠过。';
    };

    bindHeldControl(left, 'left', miniGameState.keys);
    bindHeldControl(right, 'right', miniGameState.keys);
    addMiniGameListener(attack, 'click', attackEnemy);
    addMiniGameListener(dodge, 'click', dodgeAttack);
    addMiniGameListener(document, 'keydown', event => {
      if (!miniGameState || miniGameState.type !== 'battle') return;
      if (['ArrowLeft', 'a', 'A'].includes(event.key)) { event.preventDefault(); miniGameState.keys.add('left'); }
      if (['ArrowRight', 'd', 'D'].includes(event.key)) { event.preventDefault(); miniGameState.keys.add('right'); }
      if (!event.repeat && (event.key === 'j' || event.key === 'J' || event.code === 'Space')) { event.preventDefault(); attackEnemy(); }
      if (!event.repeat && (event.key === 'k' || event.key === 'K' || event.key === 'Shift')) { event.preventDefault(); dodgeAttack(); }
    });
    addMiniGameListener(document, 'keyup', event => {
      if (!miniGameState || miniGameState.type !== 'battle') return;
      if (['ArrowLeft', 'a', 'A'].includes(event.key)) miniGameState.keys.delete('left');
      if (['ArrowRight', 'd', 'D'].includes(event.key)) miniGameState.keys.delete('right');
    });

    loadWave(0);
    const frame = timestamp => {
      if (!miniGameState || miniGameState.type !== 'battle' || miniGameState.complete || miniGameState.ended) return;
      const now = Number.isFinite(timestamp) ? timestamp : (window.performance?.now?.() || Date.now());
      const delta = miniGameState.lastFrame ? Math.min(.05, (now - miniGameState.lastFrame) / 1000) : 0;
      miniGameState.lastFrame = now;
      const direction = (miniGameState.keys.has('right') ? 1 : 0) - (miniGameState.keys.has('left') ? 1 : 0);
      miniGameState.playerX = Math.max(7, Math.min(93, miniGameState.playerX + direction * 33 * delta));
      const wave = game.waves[miniGameState.waveIndex];
      if (!miniGameState.enemyDown) {
        const distance = Math.abs(miniGameState.enemyX - miniGameState.playerX);
        if (!miniGameState.enemyAttackAt && distance > 13) {
          miniGameState.enemyX += Math.sign(miniGameState.playerX - miniGameState.enemyX) * wave.speed * delta;
        }
        if (!miniGameState.enemyAttackAt && distance <= 14 && now >= miniGameState.nextEnemyAttack) {
          miniGameState.enemyAttackAt = now + 590;
          warning.classList.add('visible');
          enemy.classList.add('winding');
          status.textContent = `${wave.name}压低兵器，朱砂预兆已经落地。`;
          playSound('drum');
        }
        if (miniGameState.enemyAttackAt && now >= miniGameState.enemyAttackAt) {
          const hit = Math.abs(miniGameState.enemyX - miniGameState.playerX) <= 17 && now >= miniGameState.invulnerableUntil;
          miniGameState.enemyAttackAt = 0;
          miniGameState.nextEnemyAttack = now + wave.attackRate;
          warning.classList.remove('visible');
          enemy.classList.remove('winding');
          if (hit) {
            miniGameState.playerHealth = Math.max(0, miniGameState.playerHealth - wave.damage);
            updateBattleMeter(playerMeter.meter, miniGameState.playerHealth, miniGameState.playerMaxHealth);
            player.classList.add('hit');
            scheduleMiniGame(() => player.classList.remove('hit'), 260);
            status.textContent = `${wave.name}击中悟空，悟空被迫后退。`;
            playSound('drum');
            if (miniGameState.playerHealth <= 0) {
              miniGameState.ended = true;
              player.classList.add('defeated');
              controls.querySelectorAll('button').forEach(button => { button.disabled = true; });
              scheduleMiniGame(() => renderMiniGameCompletion({ message: `击退 ${miniGameState?.score || 0} / ${game.waves.length} 阵，悟空力尽退回山门。` }), 750);
            }
          } else status.textContent = '重击落空，正是还手的空当。';
        }
      }
      player.style.left = `${miniGameState.playerX}%`;
      enemy.style.left = `${miniGameState.enemyX}%`;
      warning.style.left = `${miniGameState.enemyX}%`;
      miniGameFrame = window.requestAnimationFrame(frame);
    };
    miniGameFrame = window.requestAnimationFrame(frame);
  }

  function startCatchGame() {
    if (!miniGameState) return;
    const game = miniGameState.game;
    const playfield = $('#miniGamePlayfield');
    const options = $('#miniGameOptions');
    playfield.hidden = false;
    playfield.dataset.theme = 'catch';
    options.hidden = true;
    $('#miniGameProgress').textContent = game.theme === 'web' ? '身法 · 盘丝寻隙' : '身法 · 蟠桃落枝';

    const shell = miniGameNode('div', 'catch-shell');
    const hud = miniGameNode('div', 'catch-hud');
    const score = miniGameNode('strong', '', `0 / ${game.targetScore}`);
    const lives = miniGameNode('span', '', `护身 ${game.lives}`);
    const time = miniGameNode('span', '', `${game.duration} 秒`);
    hud.append(score, lives, time);
    const arena = miniGameNode('div', 'catch-arena');
    arena.dataset.theme = game.theme;
    arena.style.backgroundImage = `linear-gradient(rgba(3,3,4,.12),rgba(3,3,4,.62)),url("${game.backdrop || 'assets/backgrounds/peach-garden-stage.png'}")`;
    const catcher = miniGameNode('i', 'catch-player');
    catcher.setAttribute('role', 'img');
    catcher.setAttribute('aria-label', '悟空接物的手');
    arena.append(catcher);
    const controls = miniGameNode('div', 'mini-touch-controls catch-controls');
    const left = miniGameNode('button', '', '←');
    left.type = 'button';
    left.setAttribute('aria-label', '向左移动');
    const right = miniGameNode('button', '', '→');
    right.type = 'button';
    right.setAttribute('aria-label', '向右移动');
    controls.append(left, right);
    shell.append(hud, arena, controls);
    playfield.append(shell);

    const now = window.performance?.now?.() || Date.now();
    Object.assign(miniGameState, {
      keys: new Set(),
      playerX: 50,
      lives: game.lives,
      items: [],
      startedAt: now,
      lastFrame: now,
      nextSpawnAt: now + 280,
      dragging: false,
      ended: false,
      catchRefs: { arena, catcher, score, lives, time, controls }
    });

    const updatePlayerFromPointer = event => {
      const bounds = arena.getBoundingClientRect();
      miniGameState.playerX = Math.max(6, Math.min(94, (event.clientX - bounds.left) / bounds.width * 100));
    };
    addMiniGameListener(arena, 'pointerdown', event => {
      if (!miniGameState || miniGameState.ended) return;
      miniGameState.dragging = true;
      arena.setPointerCapture?.(event.pointerId);
      updatePlayerFromPointer(event);
    });
    addMiniGameListener(arena, 'pointermove', event => {
      if (miniGameState?.dragging) updatePlayerFromPointer(event);
    });
    const stopDrag = () => { if (miniGameState) miniGameState.dragging = false; };
    addMiniGameListener(arena, 'pointerup', stopDrag);
    addMiniGameListener(arena, 'pointercancel', stopDrag);
    bindHeldControl(left, 'left', miniGameState.keys);
    bindHeldControl(right, 'right', miniGameState.keys);
    addMiniGameListener(document, 'keydown', event => {
      if (!miniGameState || miniGameState.type !== 'catch') return;
      if (['ArrowLeft', 'a', 'A'].includes(event.key)) { event.preventDefault(); miniGameState.keys.add('left'); }
      if (['ArrowRight', 'd', 'D'].includes(event.key)) { event.preventDefault(); miniGameState.keys.add('right'); }
    });
    addMiniGameListener(document, 'keyup', event => {
      if (!miniGameState || miniGameState.type !== 'catch') return;
      if (['ArrowLeft', 'a', 'A'].includes(event.key)) miniGameState.keys.delete('left');
      if (['ArrowRight', 'd', 'D'].includes(event.key)) miniGameState.keys.delete('right');
    });

    const spawnItem = () => {
      const chance = Math.random();
      const kind = game.theme === 'web'
        ? chance < .68 ? 'break' : 'web'
        : chance < .66 ? 'ripe' : chance < .86 ? 'green' : 'token';
      const item = miniGameNode('i', 'catch-item');
      item.dataset.kind = kind;
      if (kind === 'break') item.textContent = '破';
      if (kind === 'web') item.textContent = '网';
      item.setAttribute('role', 'img');
      item.setAttribute('aria-label', kind === 'ripe' ? '熟蟠桃' : kind === 'green' ? '青桃' : kind === 'token' ? '巡园天册' : kind === 'break' ? '蛛丝破绽' : '蛛网');
      const entry = { node: item, kind, x: 7 + Math.random() * 86, y: -12, speed: 28 + Math.random() * 9 };
      item.style.left = `${entry.x}%`;
      item.style.top = `${entry.y}%`;
      arena.append(item);
      miniGameState.items.push(entry);
    };

    const removeItem = entry => {
      entry.node.remove();
      const index = miniGameState.items.indexOf(entry);
      if (index >= 0) miniGameState.items.splice(index, 1);
    };

    const collectItem = entry => {
      const target = entry.kind === 'ripe' || entry.kind === 'break';
      if (target) {
        miniGameState.score = Math.min(game.targetScore, miniGameState.score + 1);
        score.textContent = `${miniGameState.score} / ${game.targetScore}`;
        $('#miniGameResult').textContent = entry.kind === 'ripe' ? '熟桃入手，枝叶没有受损。' : '抓住一处受力破绽，白丝松开一层。';
        playSound('pluck');
      } else if (entry.kind === 'green') {
        miniGameState.score = Math.max(0, miniGameState.score - 1);
        score.textContent = `${miniGameState.score} / ${game.targetScore}`;
        $('#miniGameResult').textContent = '青桃尚未成熟，这一枚须放回枝头。';
        playSound('clack');
      } else {
        miniGameState.lives -= 1;
        lives.textContent = `护身 ${miniGameState.lives}`;
        arena.classList.remove('hit');
        void arena.offsetWidth;
        arena.classList.add('hit');
        $('#miniGameResult').textContent = entry.kind === 'token' ? '巡园天册撞落，护身减一。' : '蛛网骤然收紧，护身减一。';
        playSound('drum');
      }
      removeItem(entry);
      if (miniGameState.score >= game.targetScore) {
        miniGameState.ended = true;
        controls.querySelectorAll('button').forEach(button => { button.disabled = true; });
        renderMiniGameCompletion({ message: game.theme === 'web' ? '八处破绽连成通路，盘丝阵被撕开。' : '九枚熟桃稳稳入手，园册与青桃都未受扰。' });
      } else if (miniGameState.lives <= 0) {
        miniGameState.ended = true;
        controls.querySelectorAll('button').forEach(button => { button.disabled = true; });
        renderMiniGameCompletion({ message: game.theme === 'web' ? `找到 ${miniGameState.score} / ${game.targetScore} 处破绽，蛛网先一步收紧。` : `接住 ${miniGameState.score} / ${game.targetScore} 枚熟桃，巡园天册已经惊动守卫。` });
      }
    };

    const frame = timestamp => {
      if (!miniGameState || miniGameState.type !== 'catch' || miniGameState.complete || miniGameState.ended) return;
      const current = Number.isFinite(timestamp) ? timestamp : (window.performance?.now?.() || Date.now());
      const delta = Math.min(.05, Math.max(0, (current - miniGameState.lastFrame) / 1000));
      miniGameState.lastFrame = current;
      const direction = (miniGameState.keys.has('right') ? 1 : 0) - (miniGameState.keys.has('left') ? 1 : 0);
      miniGameState.playerX = Math.max(6, Math.min(94, miniGameState.playerX + direction * 45 * delta));
      catcher.style.left = `${miniGameState.playerX}%`;
      while (current >= miniGameState.nextSpawnAt) {
        spawnItem();
        miniGameState.nextSpawnAt += game.spawnRate * (.78 + Math.random() * .4);
      }
      [...miniGameState.items].forEach(entry => {
        if (miniGameState.complete || miniGameState.ended) return;
        entry.y += entry.speed * delta;
        entry.node.style.top = `${entry.y}%`;
        if (entry.y >= 77 && entry.y <= 91 && Math.abs(entry.x - miniGameState.playerX) <= 9) collectItem(entry);
        else if (entry.y > 96) removeItem(entry);
      });
      if (miniGameState.complete || miniGameState.ended) return;
      const elapsed = (current - miniGameState.startedAt) / 1000;
      const remaining = Math.max(0, Math.ceil(game.duration - elapsed));
      time.textContent = `${remaining} 秒`;
      if (elapsed >= game.duration) {
        miniGameState.ended = true;
        controls.querySelectorAll('button').forEach(button => { button.disabled = true; });
        renderMiniGameCompletion({ message: `时限已到，完成 ${miniGameState.score} / ${game.targetScore}。` });
        return;
      }
      miniGameFrame = window.requestAnimationFrame(frame);
    };
    miniGameFrame = window.requestAnimationFrame(frame);
  }

  function runMiniGameMode() {
    if (!miniGameState) return;
    prepareMiniGame(miniGameState.game);
    if (miniGameState.type === 'duel') renderDuelRound();
    else if (miniGameState.type === 'battle') startBattleGame();
    else if (miniGameState.type === 'catch') startCatchGame();
    else renderQuizRound();
  }

  function restartMiniGame() {
    if (!miniGameState) return;
    const { key, game } = miniGameState;
    if (miniGameSession) {
      miniGameState = { key, game, type: miniGameType(game), roundIndex: 0, score: 0, locked: false, outcomes: [] };
      prepareMiniGame(game);
      miniGameSession.restart();
      return;
    }
    cleanupMiniGameActivity();
    miniGameState = { key, game, type: miniGameType(game), roundIndex: 0, score: 0, locked: false, outcomes: [] };
    playSound('drum');
    runMiniGameMode();
  }

  function runPreferredMiniGameMode() {
    if (!miniGameState) return;
    const key = miniGameState.key;
    const game = miniGameState.game;
    const engine = window.ShadowplayMinigames;
    if (engine?.mount) {
      prepareMiniGame(game);
      try {
        miniGameSession = engine.mount({
          game,
          root: $('#miniGame'),
          sound: playSound,
          reducedMotion: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true,
          onComplete: result => {
            if (!miniGameState || miniGameState.key !== key) return;
            miniGameState.score = result.score;
            miniGameState.result = result;
            renderMiniGameCompletion({ result });
          }
        });
        return;
      } catch (error) {
        miniGameSession?.destroy?.();
        miniGameSession = null;
      }
    }
    runMiniGameMode();
  }

  function startMiniGame() {
    const { storyBeat = false } = arguments[0] || {};
    const game = miniGames[currentKey()];
    if (!isPlayerScene(state.chapter, state.trial)) return advanceScene();
    const alreadyPlayed = Boolean(state.completedMiniGames[currentKey()]);
    if (!game || (alreadyPlayed && !isRevisitingScene())) return enterChoices({ skipInteraction: true });
    miniGameFocusReturn = document.activeElement;
    miniGameState = { key: currentKey(), game, type: miniGameType(game), roundIndex: 0, score: 0, locked: false, outcomes: [], replay: alreadyPlayed, storyBeat };
    clearAuto();
    window.shadowplayVoice?.stop();
    $('#miniGame').classList.add('open');
    $('#miniGame').setAttribute('aria-hidden', 'false');
    $('.mini-game-panel').scrollTop = 0;
    syncModalState();
    syncBgm();
    runPreferredMiniGameMode();
  }

  function goToScene(index) {
    $('#endingModal').classList.remove('open');
    $('#endingModal').setAttribute('aria-hidden', 'true');
    $('#startMenu').classList.remove('open');
    $('#startMenu').setAttribute('aria-hidden', 'true');
    $('#journeyArchive').classList.remove('open');
    $('#journeyArchive').setAttribute('aria-hidden', 'true');
    const position = positionFor(index);
    state.chapter = position.chapter;
    state.trial = position.trial;
    state.mode = 'interlude';
    state.lineIndex = 0;
    state.pendingChoice = null;
    save();
    closeOverlay({ restoreFocus: false });
    closePause({ restoreFocus: false, resumeAuto: false });
    showInterlude();
  }

  function chapterMarkCount(chapterIndex) {
    return state.marks.filter(mark => mark.chapter === chapterIndex).length;
  }

  function relationStanding(value) {
    if (value >= 12) return '深契';
    if (value >= 5) return '亲厚';
    if (value > 0) return '相近';
    if (value <= -10) return '结怨';
    if (value <= -4) return '疏离';
    if (value < 0) return '生隙';
    return '初识';
  }

  function latestRelationMark(character) {
    return state.marks.slice().reverse().find(mark => indexFor(mark.chapter, mark.trial) <= activeMarkLimit && Number(mark.relations?.[character])) || null;
  }

  function renderRelationLedger(body) {
    body.replaceChildren();
    const title = document.createElement('h2');
    title.id = 'overlayTitle';
    title.textContent = '因缘簿';
    const characters = encounteredCharacters();
    const summary = document.createElement('div');
    summary.className = 'relation-summary';
    const positive = characters.filter(character => (state.relationships[character] || 0) > 0).length;
    const negative = characters.filter(character => (state.relationships[character] || 0) < 0).length;
    summary.innerHTML = `<span><b>${characters.length}</b>已相遇</span><span><b>${positive}</b>相知</span><span><b>${negative}</b>生隙</span>`;
    body.append(title, summary);
    const ledger = document.createElement('div');
    ledger.className = 'relation-ledger';
    if (!characters.length) {
      const empty = document.createElement('p');
      empty.className = 'journal-empty';
      empty.textContent = '因缘尚未落印。';
      ledger.append(empty);
    }
    characters.forEach(character => {
      const info = data.characterInfo[character];
      const value = Number(state.relationships[character]) || 0;
      const latest = latestRelationMark(character);
      const entry = document.createElement('article');
      entry.className = 'relation-entry';
      entry.dataset.sign = value > 0 ? 'positive' : value < 0 ? 'negative' : 'neutral';
      const seal = document.createElement('span');
      seal.className = 'relation-seal';
      seal.textContent = info.seal;
      const copy = document.createElement('div');
      copy.className = 'relation-copy';
      const heading = document.createElement('div');
      heading.className = 'relation-heading';
      const identity = document.createElement('span');
      const name = document.createElement('b');
      name.textContent = info.name;
      const role = document.createElement('small');
      role.textContent = info.role;
      identity.append(name, role);
      const standing = document.createElement('strong');
      standing.textContent = `${relationStanding(value)} · ${value > 0 ? '+' : ''}${value}`;
      heading.append(identity, standing);
      const meter = document.createElement('div');
      meter.className = 'relation-meter';
      meter.setAttribute('role', 'meter');
      meter.setAttribute('aria-label', `${info.name}关系：${relationStanding(value)}，${value}`);
      meter.setAttribute('aria-valuemin', '-20');
      meter.setAttribute('aria-valuemax', '20');
      meter.setAttribute('aria-valuenow', String(Math.max(-20, Math.min(20, value))));
      const middle = document.createElement('i');
      middle.className = 'relation-meter-middle';
      const fill = document.createElement('i');
      fill.className = 'relation-meter-fill';
      fill.style.setProperty('--relation-strength', `${Math.min(20, Math.abs(value)) / 20 * 50}%`);
      meter.append(middle, fill);
      const recent = document.createElement('p');
      if (latest) {
        const delta = Number(latest.relations[character]);
        recent.textContent = `最近选择 · 第 ${String(indexFor(latest.chapter, latest.trial) + 1).padStart(2, '0')} 难「${latest.label}」 · ${delta > 0 ? '+' : ''}${delta} · ${latest.text}`;
      } else {
        recent.textContent = '已在旅途中相遇，尚无选择改变这段因缘。';
      }
      copy.append(heading, meter, recent);
      entry.append(seal, copy);
      ledger.append(entry);
    });
    body.append(ledger);
  }

  function openOverlay(kind, trigger = document.activeElement) {
    overlayFocusReturn = trigger;
    clearAuto();
    playSound('pluck');
    $('#pauseMenu').setAttribute('aria-hidden', 'true');
    const body = $('#overlayBody');
    if (kind === 'journey') {
      const furthest = positionFor(state.furthestScene);
      body.innerHTML = `<h2 id="overlayTitle">西行进度</h2><div class="journey-resume"><div><b>${data.chapterData[furthest.chapter].mark} · ${data.chapterData[furthest.chapter].trials[furthest.trial][0]}</b><small>最远抵达 · 第 ${String(state.furthestScene + 1).padStart(2, '0')} 难</small></div><button type="button" id="resumeJourney">${currentSceneIndex() === state.furthestScene ? '继续此难' : '回到前路'} <span aria-hidden="true">→</span></button></div><div class="chapter-grid">${data.chapterData.map((chapter, index) => { const unlocked = index * 9 <= state.furthestScene; const count = chapterMarkCount(index); return `<button type="button" class="chapter-button ${index === state.chapter ? 'current' : ''}" data-chapter="${index}" ${unlocked ? '' : 'disabled'}><b>${chapter.mark} · ${chapter.name}</b><small>${unlocked ? `${count} / 9 道旅痕${index === state.chapter ? ' · 当前' : ''}` : '云路未开'}</small></button>`; }).join('')}</div>`;
      $('#resumeJourney').addEventListener('click', () => goToScene(state.furthestScene));
      body.querySelectorAll('[data-chapter]').forEach(button => button.addEventListener('click', () => {
        goToScene(Number(button.dataset.chapter) * 9);
      }));
    } else if (kind === 'journal') {
      body.innerHTML = `<h2 id="overlayTitle">旅痕簿</h2><div class="journal-summary"><span><b>${state.resolve}</b>勇决</span><span><b>${state.mercy}</b>慈念</span><span><b>${state.insight}</b>悟见</span></div><div id="journalEntries"></div>`;
      const entries = $('#journalEntries');
      if (!state.marks.length) {
        const empty = document.createElement('p');
        empty.className = 'journal-empty';
        empty.textContent = '尚未留下旅痕。';
        entries.append(empty);
      } else {
        state.marks.slice().reverse().forEach(mark => {
          const entry = document.createElement('article');
          entry.className = 'journal-entry';
          const trait = mark.trait || ['resolve', 'mercy', 'insight'][mark.choice];
          entry.dataset.trait = trait;
          const seal = document.createElement('span');
          seal.className = 'journal-seal';
          seal.textContent = traitMeta[trait].seal;
          const copy = document.createElement('div');
          const title = document.createElement('b');
          title.textContent = `第 ${String(indexFor(mark.chapter, mark.trial) + 1).padStart(2, '0')} 难 · ${mark.label}`;
          const text = document.createElement('p');
          text.textContent = mark.text;
          copy.append(title, text);
          entry.append(seal, copy);
          entries.append(entry);
        });
      }
    } else {
      renderRelationLedger(body);
    }
    $('#overlayPanel').classList.add('open');
    $('#overlayPanel').setAttribute('aria-hidden', 'false');
    $('#overlayPanel').dataset.kind = kind;
    $('.overlay-content').scrollTop = 0;
    syncModalState();
    requestAnimationFrame(() => $('#closeOverlay').focus());
  }

  function activeModal() {
    return Boolean(topModal());
  }

  function prefersReducedMotion() {
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
  }

  function bgmTrackFor({ menu = false, battle = false, chapter = 0, completed = false } = {}) {
    if (menu) return 'assets/audio/bgm/title.mp3';
    if (battle) return 'assets/audio/bgm/battle.mp3';
    if (completed) return 'assets/audio/bgm/vol-09-lingshan.mp3';
    return bgmTracks[clampInteger(chapter, 0, bgmTracks.length - 1)];
  }

  function currentBgmTrack() {
    const miniOpen = $('#miniGame')?.classList.contains('open');
    const combatOpen = miniOpen && ['battle', 'duel', 'catch'].includes(miniGameState?.type);
    return bgmTrackFor({
      menu: $('#startMenu')?.classList.contains('open'),
      battle: combatOpen,
      chapter: state.chapter,
      completed: state.completed && $('#endingModal')?.classList.contains('open')
    });
  }

  function musicLevel() {
    return state.sound ? clamp01(state.musicVolume) : 0;
  }

  function sfxLevel() {
    return state.sound ? clamp01(state.sfxVolume) : 0;
  }

  function applyAudioLevels() {
    if (audioMaster) audioMaster.gain.value = 0.48 * sfxLevel();
    if (!state.sound) {
      stopBgm();
      return;
    }
    if (bgmPlayer && !bgmPlayer.paused) setBgmVolume(musicLevel());
  }

  let syncingAudioControls = false;

  function syncAudioControls() {
    const music = Math.round((state.sound ? clamp01(state.musicVolume) : 0) * 100);
    const sfx = Math.round((state.sound ? clamp01(state.sfxVolume) : 0) * 100);
    syncingAudioControls = true;
    [
      ['#startMusicVolume', '#startMusicVolumeValue', music],
      ['#pauseMusicVolume', '#pauseMusicVolumeValue', music],
      ['#startSfxVolume', '#startSfxVolumeValue', sfx],
      ['#pauseSfxVolume', '#pauseSfxVolumeValue', sfx]
    ].forEach(([inputId, valueId, value]) => {
      const input = $(inputId);
      const label = $(valueId);
      if (input) input.value = String(value);
      if (label) label.textContent = `${value}`;
    });
    syncingAudioControls = false;
    const soundHint = state.sound ? '配音、音效与背景乐已开启' : '当前已静音';
    const startSound = $('#startSound');
    if (startSound) {
      startSound.classList.toggle('is-muted', !state.sound);
      startSound.setAttribute('aria-pressed', String(state.sound));
      if (startSound.querySelector('small')) startSound.querySelector('small').textContent = soundHint;
    }
    const soundBtn = $('#soundBtn');
    if (soundBtn) {
      soundBtn.classList.toggle('is-muted', !state.sound);
      soundBtn.setAttribute('aria-pressed', String(state.sound));
    }
    const soundState = $('#soundState');
    if (soundState) soundState.textContent = state.sound ? '已开启' : '已静音';
    ['#start-audio', '.start-audio', '.pause-audio'].forEach(selector => {
      $(selector)?.classList.toggle('is-muted', !state.sound);
    });
  }

  function bindVolumeSlider(selector, key) {
    const input = $(selector);
    if (!input) return;
    const apply = () => {
      if (syncingAudioControls) return;
      const next = clamp01(Number(input.value) / 100);
      state[key] = next;
      if (!state.sound && next > 0) state.sound = true;
      save();
      applyAudioLevels();
      syncAudioControls();
      if (state.sound && key === 'sfxVolume') playSound('pluck');
      else syncBgm();
    };
    input.addEventListener('input', apply);
    input.addEventListener('change', apply);
  }

  function toggleSound({ from = 'pause' } = {}) {
    state.sound = !state.sound;
    if (!state.sound) {
      window.shadowplayVoice?.stop();
      const context = audioContext;
      audioContext = null;
      audioMaster = null;
      context?.close().catch(() => {});
    }
    save();
    setHud();
    syncAudioControls();
    syncBgm();
    if (from === 'start') showStartMenu();
    if (state.sound) playSound(from === 'start' ? 'confirm' : 'pluck');
  }

  const startKoans = Object.freeze([
    '一念起，西行便有了方向。',
    '规矩若不公，便该问一声。',
    '路再远，也要有人同行。',
    '能打，不等于该打。',
    '眼前所见，未必是唯一真相。'
  ]);
  let startKoanIndex = 0;

  function strikeStartSeal() {
    const seal = $('#startSeal');
    const koan = $('#startKoan');
    if (!seal || !koan) return;
    startKoanIndex = (startKoanIndex + 1) % startKoans.length;
    koan.hidden = false;
    koan.textContent = startKoans[startKoanIndex];
    seal.classList.remove('is-struck');
    void seal.offsetWidth;
    seal.classList.add('is-struck');
    playSound('gong');
  }

  function ensureBgmPlayer() {
    const AudioCtor = window.Audio;
    if (!AudioCtor) return null;
    if (!bgmPlayer) {
      bgmPlayer = new AudioCtor();
      bgmPlayer.loop = true;
      bgmPlayer.preload = 'auto';
      bgmPlayer.volume = 0;
    }
    return bgmPlayer;
  }

  function setBgmVolume(value) {
    if (bgmPlayer) bgmPlayer.volume = Math.max(0, Math.min(0.55, value * 0.62));
  }

  function fadeBgm(target, duration, onDone) {
    window.clearTimeout(bgmFadeTimer);
    const player = bgmPlayer;
    if (!player) {
      onDone?.();
      return;
    }
    const token = bgmFadeToken += 1;
    if (prefersReducedMotion() || duration <= 0) {
      setBgmVolume(target);
      onDone?.();
      return;
    }
    const start = player.volume;
    const begun = (window.performance?.now?.() || Date.now());
    const step = () => {
      if (token !== bgmFadeToken || bgmPlayer !== player) return;
      const now = window.performance?.now?.() || Date.now();
      const progress = Math.min(1, (now - begun) / duration);
      setBgmVolume(start + (target - start) * progress);
      if (progress < 1) bgmFadeTimer = window.setTimeout(step, 32);
      else onDone?.();
    };
    step();
  }

  function stopBgm({ fade = true } = {}) {
    if (!bgmPlayer) return;
    const finishStop = () => {
      try { bgmPlayer.pause(); } catch (error) {}
      bgmSource = '';
    };
    if (!fade || prefersReducedMotion() || bgmPlayer.paused) {
      window.clearTimeout(bgmFadeTimer);
      bgmFadeToken += 1;
      setBgmVolume(0);
      finishStop();
      return;
    }
    fadeBgm(0, 280, finishStop);
  }

  function syncBgm() {
    if (!state.sound) {
      stopBgm();
      return;
    }
    const track = currentBgmTrack();
    const player = ensureBgmPlayer();
    if (!player) return;
    const alreadyPlaying = bgmSource === track && !player.paused;
    if (alreadyPlaying) return;
    const startTrack = () => {
      if (bgmSource !== track) {
        player.src = track;
        player.loop = true;
        player.currentTime = 0;
        bgmSource = track;
      }
      setBgmVolume(0);
      const playback = player.play();
      if (playback?.catch) playback.catch(() => {});
      fadeBgm(musicLevel(), 520);
    };
    if (bgmSource && bgmSource !== track && !player.paused) {
      fadeBgm(0, 280, startTrack);
      return;
    }
    startTrack();
  }

  function armBgmUnlock() {
    const unlock = () => syncBgm();
    document.addEventListener('pointerdown', unlock, { once: true, passive: true });
    document.addEventListener('keydown', unlock, { once: true });
  }

  function chapterSoundMood() {
    return [
      { root: 220, pace: 0.17, air: 1500 },
      { root: 196, pace: 0.14, air: 1250 },
      { root: 174, pace: 0.21, air: 980 },
      { root: 220, pace: 0.18, air: 1320 },
      { root: 196, pace: 0.2, air: 1120 },
      { root: 207, pace: 0.15, air: 1480 },
      { root: 185, pace: 0.22, air: 1060 },
      { root: 247, pace: 0.1, air: 1900 },
      { root: 330, pace: 0.27, air: 2350 }
    ][state.chapter] || { root: 220, pace: 0.18, air: 1400 };
  }

  function ensureAudioGraph() {
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) return null;
    audioContext ||= new Context();
    if (!audioMaster) {
      audioMaster = audioContext.createGain();
      audioMaster.gain.value = 0.72 * sfxLevel();
      audioMaster.connect(audioContext.destination);
    }
    if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
    return { context: audioContext, master: audioMaster };
  }

  function noiseBuffer(context, duration) {
    const length = Math.max(1, Math.floor(context.sampleRate * duration));
    const buffer = context.createBuffer(1, length, context.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let index = 0; index < length; index += 1) {
      const envelope = 1 - index / length;
      channel[index] = (Math.random() * 2 - 1) * envelope;
    }
    return buffer;
  }

  function playSound(kind = 'pluck') {
    if (!state.sound) return;
    try {
      const graph = ensureAudioGraph();
      if (!graph) return;
      const { context, master } = graph;
      const mood = chapterSoundMood();
      const now = context.currentTime;
      if (kind === 'whoosh' || kind === 'page') {
        const source = context.createBufferSource();
        const filter = context.createBiquadFilter();
        const gain = context.createGain();
        const duration = kind === 'whoosh' ? 0.42 : 0.16;
        source.buffer = noiseBuffer(context, duration);
        filter.type = kind === 'whoosh' ? 'bandpass' : 'highpass';
        filter.frequency.setValueAtTime(kind === 'whoosh' ? 420 : 1500, now);
        if (kind === 'whoosh') filter.frequency.exponentialRampToValueAtTime(1250, now + duration);
        filter.Q.value = kind === 'whoosh' ? 0.7 : 1.4;
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(kind === 'whoosh' ? 0.04 : 0.016, now + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
        source.connect(filter).connect(gain).connect(master);
        source.start(now);
        return;
      }
      if (kind === 'clack' || kind === 'confirm') {
        const notes = kind === 'confirm' ? [1, 1.25, 1.5] : [1];
        notes.forEach((ratio, index) => {
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          oscillator.type = kind === 'clack' ? 'square' : 'sine';
          oscillator.frequency.value = mood.root * (kind === 'clack' ? 3.6 : 1.7) * ratio;
          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.exponentialRampToValueAtTime((kind === 'clack' ? 0.012 : 0.016) / (index + 1), now + index * 0.025 + 0.005);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + (kind === 'clack' ? 0.08 : 0.38) + index * 0.04);
          oscillator.connect(gain).connect(master);
          oscillator.start(now + index * 0.025);
          oscillator.stop(now + 0.5);
        });
        return;
      }
      if (kind === 'strike' || kind === 'impact') {
        const hit = kind === 'impact';
        const whoosh = context.createBufferSource();
        const whooshFilter = context.createBiquadFilter();
        const whooshGain = context.createGain();
        whoosh.buffer = noiseBuffer(context, hit ? 0.09 : 0.14);
        whooshFilter.type = hit ? 'lowpass' : 'bandpass';
        whooshFilter.frequency.setValueAtTime(hit ? 420 : 980, now);
        whooshFilter.Q.value = hit ? 0.8 : 1.1;
        whooshGain.gain.setValueAtTime(0.0001, now);
        whooshGain.gain.exponentialRampToValueAtTime(hit ? 0.36 : 0.24, now + 0.012);
        whooshGain.gain.exponentialRampToValueAtTime(0.0001, now + (hit ? 0.16 : 0.18));
        whoosh.connect(whooshFilter).connect(whooshGain).connect(master);
        whoosh.start(now);
        const tap = context.createOscillator();
        const tapGain = context.createGain();
        tap.type = hit ? 'triangle' : 'square';
        tap.frequency.setValueAtTime(hit ? mood.root * 2.1 : mood.root * 3.4, now);
        tap.frequency.exponentialRampToValueAtTime(mood.root * (hit ? 0.7 : 1.4), now + 0.08);
        tapGain.gain.setValueAtTime(0.0001, now);
        tapGain.gain.exponentialRampToValueAtTime(hit ? 0.28 : 0.16, now + 0.008);
        tapGain.gain.exponentialRampToValueAtTime(0.0001, now + (hit ? 0.2 : 0.12));
        tap.connect(tapGain).connect(master);
        tap.start(now);
        tap.stop(now + 0.22);
        return;
      }
      if (kind === 'dodge') {
        const swipe = context.createBufferSource();
        const swipeFilter = context.createBiquadFilter();
        const swipeGain = context.createGain();
        swipe.buffer = noiseBuffer(context, 0.16);
        swipeFilter.type = 'bandpass';
        swipeFilter.frequency.setValueAtTime(720, now);
        swipeFilter.frequency.exponentialRampToValueAtTime(1680, now + 0.12);
        swipeFilter.Q.value = 0.9;
        swipeGain.gain.setValueAtTime(0.0001, now);
        swipeGain.gain.exponentialRampToValueAtTime(0.22, now + 0.018);
        swipeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
        swipe.connect(swipeFilter).connect(swipeGain).connect(master);
        swipe.start(now);
        return;
      }
      if (kind === 'drum') {
        const drum = context.createOscillator();
        const drumGain = context.createGain();
        drum.type = 'sine';
        drum.frequency.setValueAtTime(mood.root * 0.52, now);
        drum.frequency.exponentialRampToValueAtTime(mood.root * 0.28, now + mood.pace);
        drumGain.gain.setValueAtTime(0.0001, now);
        drumGain.gain.exponentialRampToValueAtTime(0.055, now + 0.008);
        drumGain.gain.exponentialRampToValueAtTime(0.0001, now + mood.pace);
        drum.connect(drumGain).connect(master);
        drum.start(now);
        drum.stop(now + mood.pace + 0.02);

        const clapper = context.createBufferSource();
        const clapperFilter = context.createBiquadFilter();
        const clapperGain = context.createGain();
        clapper.buffer = noiseBuffer(context, Math.max(0.035, mood.pace * 0.45));
        clapperFilter.type = 'bandpass';
        clapperFilter.frequency.value = mood.air;
        clapperFilter.Q.value = 2.7;
        clapperGain.gain.setValueAtTime(0.028, now);
        clapperGain.gain.exponentialRampToValueAtTime(0.0001, now + mood.pace * 0.55);
        clapper.connect(clapperFilter).connect(clapperGain).connect(master);
        clapper.start(now);
        return;
      }
      if (kind === 'gong') {
        const duration = state.chapter === 8 ? 3.5 : 2.7;
        [1, 1.42, 1.91, 2.48, 3.17].forEach((ratio, index) => {
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          oscillator.type = 'sine';
          oscillator.frequency.value = mood.root * 0.56 * ratio;
          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.exponentialRampToValueAtTime(0.055 / (index + 1), now + 0.025 + index * 0.008);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + duration - index * 0.18);
          oscillator.connect(gain).connect(master);
          oscillator.start(now);
          oscillator.stop(now + duration + 0.05);
        });
        return;
      }

      const burst = context.createBufferSource();
      const delay = context.createDelay(0.2);
      const damping = context.createBiquadFilter();
      const feedback = context.createGain();
      const output = context.createGain();
      burst.buffer = noiseBuffer(context, 0.028);
      delay.delayTime.value = 1 / (mood.root * 1.5);
      damping.type = 'lowpass';
      damping.frequency.value = mood.air * 1.7;
      feedback.gain.setValueAtTime(state.chapter === 8 ? 0.88 : 0.8, now);
      feedback.gain.exponentialRampToValueAtTime(0.0001, now + (state.chapter === 8 ? 1.25 : 0.78));
      output.gain.value = 0.042;
      burst.connect(delay);
      delay.connect(damping);
      damping.connect(output).connect(master);
      damping.connect(feedback).connect(delay);
      burst.start(now);
      burst.stop(now + 0.03);
      window.setTimeout(() => {
        [burst, delay, damping, feedback, output].forEach(node => {
          try { node.disconnect(); } catch (error) {}
        });
      }, state.chapter === 8 ? 1450 : 950);
    } catch (error) {}
  }

  function trapFocus(event, container) {
    if (event.key !== 'Tab') return;
    const focusable = [...container.querySelectorAll('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')].filter(element => element.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  function overrideClick(id, handler, sound = 'pluck') {
    const original = $(id);
    const replacement = original.cloneNode(true);
    original.replaceWith(replacement);
    replacement.addEventListener('click', event => {
      if (sound) playSound(sound);
      handler(event);
    });
    return replacement;
  }

  overrideClick('#skipBtn', event => openSkipSummary(event.currentTarget), '');
  overrideClick('#autoBtn', () => { state.auto = !state.auto; save(); if (state.mode !== 'interlude') renderLine(); else setHud(); });
  overrideClick('#pauseBtn', event => $('#pauseMenu').classList.contains('open') ? closePause() : openPause(event.currentTarget), '');
  overrideClick('#closeMenu', closePause);
  const pauseBackdrop = $('#pauseMenu .pause-backdrop');
  const newPauseBackdrop = pauseBackdrop.cloneNode(true);
  pauseBackdrop.replaceWith(newPauseBackdrop);
  newPauseBackdrop.addEventListener('click', closePause);
  overrideClick('#journeyBtn', event => openOverlay('journey', event.currentTarget), '');
  overrideClick('#mainMenuBtn', () => {
    save();
    closePause({ restoreFocus: false, resumeAuto: false });
    showStartMenu();
  });
  overrideClick('#journalBtn', event => openOverlay('journal', event.currentTarget), '');
  overrideClick('#relationsBtn', event => openOverlay('relations', event.currentTarget), '');
  overrideClick('#soundBtn', () => toggleSound({ from: 'pause' }), '');
  overrideClick('#closeOverlay', closeOverlay);
  const overlayBackdrop = $('#overlayPanel .overlay-backdrop');
  const newOverlayBackdrop = overlayBackdrop.cloneNode(true);
  overlayBackdrop.replaceWith(newOverlayBackdrop);
  newOverlayBackdrop.addEventListener('click', closeOverlay);
  overrideClick('#cancelSkip', closeSkipSummary);
  overrideClick('#confirmSkip', confirmSkipSummary);
  const skipBackdrop = $('#skipSummary .skip-summary-backdrop');
  const newSkipBackdrop = skipBackdrop.cloneNode(true);
  skipBackdrop.replaceWith(newSkipBackdrop);
  newSkipBackdrop.addEventListener('click', closeSkipSummary);
  overrideClick('#skipMiniGame', () => finishMiniGame({ skipped: true }));
  overrideClick('#cancelConfirmation', closeConfirmation);
  overrideClick('#confirmAction', () => closeConfirmation({ restoreFocus: false, confirm: true }));
  const confirmationBackdrop = $('#confirmationModal .confirmation-backdrop');
  const newConfirmationBackdrop = confirmationBackdrop.cloneNode(true);
  confirmationBackdrop.replaceWith(newConfirmationBackdrop);
  newConfirmationBackdrop.addEventListener('click', closeConfirmation);
  overrideClick('#resetBtn', event => openConfirmation({
    kicker: '重启旅程',
    title: '清空全部旅痕？',
    text: `这会清除已经抵达的 ${state.furthestScene + 1} 难、${state.marks.length} 次选择以及全部关系变化，且无法撤回。`,
    confirmLabel: '清空并重启',
    onConfirm: reset
  }, event.currentTarget));
  overrideClick('#startContinue', continueFromStart, '');
  overrideClick('#startArchive', openJourneyArchive, '');
  overrideClick('#startJournal', event => openOverlay('journal', event.currentTarget), '');
  overrideClick('#startRelations', event => openOverlay('relations', event.currentTarget), '');
  overrideClick('#startSound', () => toggleSound({ from: 'start' }), '');
  bindVolumeSlider('#startMusicVolume', 'musicVolume');
  bindVolumeSlider('#pauseMusicVolume', 'musicVolume');
  bindVolumeSlider('#startSfxVolume', 'sfxVolume');
  bindVolumeSlider('#pauseSfxVolume', 'sfxVolume');
  overrideClick('#startSeal', strikeStartSeal, '');
  overrideClick('#startNew', event => {
    if (!hasJourneyProgress()) return reset();
    openConfirmation({
      kicker: '新的旅程',
      title: '清除当前西行记录？',
      text: '现有进度、抉择、关系、互动成绩与通关长卷都会被清除。',
      confirmLabel: '清除并重新开始',
      onConfirm: reset
    }, event.currentTarget);
  });
  overrideClick('#endingArchive', () => openJourneyArchive());
  overrideClick('#endingReview', () => openJourneyArchive({ reviewMode: true }));
  overrideClick('#endingMenu', () => {
    $('#endingModal').classList.remove('open');
    $('#endingModal').setAttribute('aria-hidden', 'true');
    showStartMenu();
  });
  overrideClick('#restartJourney', event => openConfirmation({
    kicker: '新的旅程',
    title: '清除完整通关记录？',
    text: '你仍可返回菜单或展开八十一难长卷；只有确认后才会清除当前存档。',
    confirmLabel: '清除并重新开始',
    onConfirm: reset
  }, event.currentTarget));
  overrideClick('#closeArchive', closeJourneyArchive);
  $('#journeyArchive .archive-backdrop').addEventListener('click', closeJourneyArchive);
  interlude.addEventListener('click', beginScene);
  dialogueDeck.addEventListener('click', event => {
    if (event.target.closest('.choice-button')) return;
    advance();
  });
  document.addEventListener('keydown', event => {
    const modal = topModal();
    if (modal && event.key === 'Tab') {
      trapFocus(event, modal);
      return;
    }
    if (event.key === 'Escape') {
      event.stopImmediatePropagation();
      if ($('#confirmationModal').classList.contains('open')) closeConfirmation();
      else if ($('#journeyArchive').classList.contains('open')) closeJourneyArchive();
      else if ($('#startMenu').classList.contains('open')) return;
      else if ($('#miniGame').classList.contains('open')) return;
      else if ($('#skipSummary').classList.contains('open')) closeSkipSummary();
      else if ($('#overlayPanel').classList.contains('open')) closeOverlay();
      else if ($('#pauseMenu').classList.contains('open')) closePause();
      else if (!$('#endingModal').classList.contains('open')) openPause(document.activeElement);
      return;
    }
    if ($('#miniGame').classList.contains('open') && ['1', '2', '3', '4'].includes(event.key)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      $(`#miniGameOptions button[data-option="${Number(event.key) - 1}"]`)?.click();
      return;
    }
    if (activeModal()) return;
    if ((event.key === 'a' || event.key === 'A') && state.mode !== 'interlude') {
      event.preventDefault();
      $('#autoBtn').click();
      return;
    }
    if ((event.key === 's' || event.key === 'S') && state.mode !== 'choices') {
      event.preventDefault();
      $('#skipBtn').click();
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      if (document.activeElement?.matches('button')) {
        event.stopImmediatePropagation();
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      if (state.mode === 'interlude') beginScene(); else advance();
    }
    if (['1', '2', '3', '4'].includes(event.key) && state.mode === 'choices') {
      event.stopImmediatePropagation();
      $('#choiceList .choice-button[data-choice="' + (Number(event.key) - 1) + '"]')?.click();
    }
  }, true);
  document.addEventListener('pagehide', () => stopBgm({ fade: false }));
  armBgmUnlock();

  function fitPlayfield() {
    const view = window.visualViewport;
    const vw = Number(view?.width) || window.innerWidth || 0;
    const vh = Number(view?.height) || window.innerHeight || 0;
    if (!app || !vw || !vh) return;
    const width = Math.min(vw, vh * 16 / 9);
    const height = Math.min(vh, vw * 9 / 16);
    app.style.setProperty('--play-w', `${Math.round(width)}px`);
    app.style.setProperty('--play-h', `${Math.round(height)}px`);
  }
  fitPlayfield();
  window.addEventListener?.('resize', fitPlayfield);
  window.visualViewport?.addEventListener?.('resize', fitPlayfield);
  window.visualViewport?.addEventListener?.('scroll', fitPlayfield);
  const oldReset = window.reset;
  window.shadowplayReset = reset;
  window.__shadowplayState = state;
  if (oldReset) window.reset = reset;
  syncModalState();
  showStartMenu();
})();
