const assert = require('node:assert/strict');
const fs = require('node:fs');
const zlib = require('node:zlib');
const vm = require('node:vm');

function paeth(left, above, upperLeft) {
  const estimate = left + above - upperLeft;
  const leftDistance = Math.abs(estimate - left);
  const aboveDistance = Math.abs(estimate - above);
  const upperLeftDistance = Math.abs(estimate - upperLeft);
  if (leftDistance <= aboveDistance && leftDistance <= upperLeftDistance) return left;
  if (aboveDistance <= upperLeftDistance) return above;
  return upperLeft;
}

function pngAlphaCoverage(source, grid = null) {
  const png = fs.readFileSync(source);
  assert.equal(png.subarray(1, 4).toString('ascii'), 'PNG', `${source} must be a PNG`);
  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  let interlace = 0;
  const compressed = [];
  while (offset < png.length) {
    const length = png.readUInt32BE(offset);
    const type = png.subarray(offset + 4, offset + 8).toString('ascii');
    const chunk = png.subarray(offset + 8, offset + 8 + length);
    if (type === 'IHDR') {
      width = chunk.readUInt32BE(0);
      height = chunk.readUInt32BE(4);
      bitDepth = chunk[8];
      colorType = chunk[9];
      interlace = chunk[12];
    } else if (type === 'IDAT') compressed.push(chunk);
    offset += length + 12;
    if (type === 'IEND') break;
  }
  assert.equal(bitDepth, 8, `${source} needs 8-bit channels for the runtime alpha audit`);
  assert.equal(colorType, 6, `${source} needs RGBA channels for the runtime alpha audit`);
  assert.equal(interlace, 0, `${source} must remain non-interlaced`);
  const bytesPerPixel = 4;
  const stride = width * bytesPerPixel;
  const inflated = zlib.inflateSync(Buffer.concat(compressed));
  let sourceOffset = 0;
  let previous = Buffer.alloc(stride);
  let visible = 0;
  let opaque = 0;
  const columns = Math.max(1, Number(grid?.columns) || 1);
  const rows = Math.max(1, Number(grid?.rows) || 1);
  const cellVisible = Array.from({ length: columns * rows }, () => 0);
  const corners = { topLeft: null, topRight: null, bottomLeft: null, bottomRight: null };
  for (let y = 0; y < height; y += 1) {
    const filter = inflated[sourceOffset];
    sourceOffset += 1;
    const row = Buffer.alloc(stride);
    for (let x = 0; x < stride; x += 1) {
      const encoded = inflated[sourceOffset];
      sourceOffset += 1;
      const left = x >= bytesPerPixel ? row[x - bytesPerPixel] : 0;
      const above = previous[x];
      const upperLeft = x >= bytesPerPixel ? previous[x - bytesPerPixel] : 0;
      const predictor = filter === 0 ? 0
        : filter === 1 ? left
          : filter === 2 ? above
            : filter === 3 ? Math.floor((left + above) / 2)
              : filter === 4 ? paeth(left, above, upperLeft)
                : NaN;
      assert.ok(Number.isFinite(predictor), `${source} has unsupported PNG filter ${filter}`);
      row[x] = (encoded + predictor) & 0xff;
    }
    for (let x = 0; x < width; x += 1) {
      const alpha = row[x * bytesPerPixel + 3];
      if (y === 0 && x === 0) corners.topLeft = alpha;
      if (y === 0 && x === width - 1) corners.topRight = alpha;
      if (y === height - 1 && x === 0) corners.bottomLeft = alpha;
      if (y === height - 1 && x === width - 1) corners.bottomRight = alpha;
      if (alpha === 0) continue;
      visible += 1;
      if (alpha >= 230) opaque += 1;
      if (alpha >= 32) {
        const column = Math.min(columns - 1, Math.floor(x / (width / columns)));
        const gridRow = Math.min(rows - 1, Math.floor(y / (height / rows)));
        cellVisible[gridRow * columns + column] += 1;
      }
    }
    previous = row;
  }
  return { width, height, visible, opaque, coverage: visible / (width * height), ratio: visible ? opaque / visible : 0, corners, cellVisible };
}

const elements = new Map();

function element(key = '') {
  if (elements.has(key)) return elements.get(key);
  const classes = new Set();
  const attributes = new Map();
  const node = {
    key,
    hidden: false,
    textContent: '',
    innerHTML: '',
    dataset: {},
    style: { setProperty() {} },
    classList: {
      add: (...names) => names.forEach(name => classes.add(name)),
      remove: (...names) => names.forEach(name => classes.delete(name)),
      contains: name => classes.has(name),
      toggle(name, force) {
        if (force === undefined) {
          if (classes.has(name)) { classes.delete(name); return false; }
          classes.add(name); return true;
        }
        if (force) classes.add(name); else classes.delete(name);
        return force;
      }
    },
    setAttribute: (name, value) => attributes.set(name, String(value)),
    getAttribute: name => attributes.get(name) || null,
    addEventListener() {},
    replaceWith() {},
    replaceChildren() {},
    append() {},
    appendChild() {},
    focus() {},
    cloneNode() { return element(`${key}:clone:${Math.random()}`); },
    querySelector: selector => element(`${key} ${selector}`),
    querySelectorAll: () => [],
    closest: () => null,
    matches: () => false,
    remove() {},
    get offsetWidth() { return 100; },
    get offsetParent() { return {}; },
    get children() { return []; }
  };
  elements.set(key, node);
  return node;
}

const document = {
  querySelector: selector => element(selector),
  createElement: tag => element(`created:${tag}:${Math.random()}`),
  addEventListener() {},
  activeElement: element('active')
};
const localStorage = { getItem: () => null, setItem() {} };
const window = {
  localStorage,
  setTimeout: () => 0,
  clearTimeout() {},
  setInterval: () => 0,
  clearInterval() {},
  requestAnimationFrame: callback => { callback(); return 0; },
  confirm: () => true
};
const context = {
  window,
  document,
  localStorage,
  requestAnimationFrame: window.requestAnimationFrame,
  setTimeout: window.setTimeout,
  clearTimeout: window.clearTimeout,
  setInterval: window.setInterval,
  clearInterval: window.clearInterval,
  console,
  Math,
  Object,
  Array,
  Number,
  String,
  Boolean,
  JSON,
  Map,
  Set
};

vm.createContext(context);
vm.runInContext(fs.readFileSync('canonical-story.js', 'utf8'), context);
vm.runInContext(fs.readFileSync('story-branches.js', 'utf8'), context);

let runtimeSource = fs.readFileSync('shadowplay-runtime.js', 'utf8');
const footer = '  window.__shadowplayState = state;\n  if (oldReset) window.reset = reset;\n  syncModalState();\n  showStartMenu();';
assert.ok(runtimeSource.includes(footer), 'runtime test hook location changed');
runtimeSource = runtimeSource.replace(footer, [
  '  window.__shadowplayState = state;',
  '  window.__runtimeTest = { choicesForPosition, finish, state, defaultArt, actorFraming, framingFor, artFor, storyLines, responseLines, spokenDialogue, voiceCue, renderLine, relationStanding, encounteredCharacters, routeRanking, recalculateScores, autoDelayFor, hasFutureProgress, truncateFutureProgress, openConfirmation, closeConfirmation, sanitizeMiniGameResults, miniGameType, miniGameScoreLimit, miniGamePassScore, duelOutcome, castForPosition, playerForPosition, isPlayerScene, isPlayerCharacter, nextPlayerSceneIndex, skipSummaryText, confirmSkipSummary, bgmTrackFor, isRevisitingScene, startMiniGame, enterChoices, interactionGate, canOpenSceneInteraction };',
  '  if (oldReset) window.reset = reset;',
  '  syncModalState();',
  '  showInterlude();'
].join('\n'));
vm.runInContext(runtimeSource, context);

const test = window.__runtimeTest;
const branch = window.shadowplayBranchData;
const canonical = window.canonicalShadowplayData;
const allCharacterInfo = { ...canonical.characterInfo, ...branch.characterInfo };
const runtimeCss = fs.readFileSync('shadowplay.css', 'utf8');
let optionTotal = 0;
let silentOptions = 0;
let responseActorTotal = 0;
const playerAliases = new Set(['石猴', '悟空']);
const playerSceneKeys = [];
const cutsceneKeys = [];

assert.equal(Object.keys(branch.sceneChoices).length, 81, 'all 81 scenes need explicit sceneChoices');
const flagOrigins = new Map();

for (let chapter = 0; chapter < 9; chapter += 1) {
  for (let trial = 0; trial < 9; trial += 1) {
    const key = `${chapter}:${trial}`;
    assert.ok(Array.isArray(branch.sceneChoices[key]), `${key} needs explicit sceneChoices`);
    const options = test.choicesForPosition(chapter, trial);
    const player = test.playerForPosition(chapter, trial);
    assert.equal(test.isPlayerScene(chapter, trial), Boolean(player), `${key} player-scene detection must follow the cast`);
    if (player) {
      playerSceneKeys.push(key);
      assert.ok(playerAliases.has(player), `${key} player must be Stone Monkey/Wukong`);
      assert.ok(options.length >= 2 && options.length <= 4, `${key} player scene must have 2-4 options`);
      assert.equal(new Set(options.map(option => option.outcome)).size, options.length, `${key} outcomes must differ`);
    } else {
      cutsceneKeys.push(key);
      assert.equal(options.length, 0, `${key} must remain a choice-free cutscene while Wukong is absent`);
      assert.equal(branch.sceneChoices[key].length, 0, `${key} must not carry dormant branch choices`);
      assert.equal(branch.miniGames[key], undefined, `${key} cannot start an interaction without Wukong`);
    }
    options.forEach(option => {
      assert.ok(option.id && !String(option.id).startsWith('generated-'), `${key}/${option.label} cannot use generated fallback choices`);
      assert.ok(option.label && option.text && option.outcome, `${key}/${option.id} needs label, action text and outcome`);
      ['relations', 'flags', 'routes', 'action', 'feedback'].forEach(field => {
        assert.ok(Object.hasOwn(option, field), `${key}/${option.label} needs ${field}`);
      });
      assert.ok(Object.keys(option.routes || {}).length, `${key}/${option.label} must affect a route`);
      Object.keys(option.relations || {}).forEach(character => {
        assert.ok(allCharacterInfo[character], `${key}/${option.label} uses unknown relationship character ${character}`);
        assert.ok(!playerAliases.has(character), `${key}/${option.label} cannot award relationship points to the player`);
      });
      Object.entries(option.flags || {}).forEach(([flag, value]) => {
        if (!flagOrigins.has(flag)) flagOrigins.set(flag, new Set());
        flagOrigins.get(flag).add(JSON.stringify(value));
      });
      if (/沉默/.test(option.label)) silentOptions += 1;
    });
    optionTotal += options.length;

    if (player) {
      test.state.chapter = chapter;
      test.state.trial = trial;
      test.state.pendingChoice = 0;
      const responseActor = test.responseLines().find(line => line.kind === '玩家行动')?.speaker;
      assert.equal(responseActor, player, `${key} choice response must be performed by ${player}`);
      responseActorTotal += 1;
      options.forEach((option, choiceIndex) => {
        test.state.pendingChoice = choiceIndex;
        const response = test.responseLines();
        const result = response.find(line => line.kind === '行动结果');
        assert.ok(result, `${key}/${option.id} must show the unique written outcome`);
        assert.equal(result.text, option.outcome, `${key}/${option.id} outcome text must stay unique to that choice`);
        response.filter(line => playerAliases.has(line.speaker) && line.kind !== '玩家行动').forEach(line => {
          const spoken = String(line.text || '').replace(/[“”]/g, '');
          const authored = [option.speech, option.reply].filter(Boolean).map(text => String(text).replace(/[“”]/g, ''));
          assert.ok(authored.some(text => text === spoken), `${key}/${option.id} cannot reuse a stock Wukong closer: ${line.text}`);
        });
        response.filter(line => line.kind === '角色回应').forEach(line => {
          assert.ok(option.answer, `${key}/${option.id} cannot invent a generic ${line.speaker} line: ${line.text}`);
        });
      });
      test.state.pendingChoice = null;
    }

    test.state.chapter = chapter;
    test.state.trial = trial;
    const playableLines = test.storyLines();
    assert.equal(playableLines.some(line => line.kind === '演出提示'), false, `${key} cannot expose screenplay directions`);
    playableLines.forEach(line => {
      assert.doesNotMatch(line.text || '', /台词落下|人物不向前移动|立于幕(?:左|右|心|前)|不设人物立绘/u, `${key} contains an out-of-world stage note`);
      assert.doesNotMatch(line.text || '', /[灯幕]/u, `${key} cannot use lamp/curtain motifs in player-facing copy`);
    });
  }
}

assert.equal(playerSceneKeys.length, 71, '71 scenes should let the player act as Stone Monkey/Wukong');
assert.deepEqual(cutsceneKeys, ['2:1', '2:2', '2:3', '2:4', '2:5', '2:6', '2:7', '2:8', '3:0', '5:0'], 'only confirmed Wukong-absent scenes may be cutscenes');
assert.equal(responseActorTotal, playerSceneKeys.length, 'every player scene needs a Wukong action response');
test.state.chapter = 0;
test.state.trial = 0;
test.state.pendingChoice = 0;
const choiceResponse = test.responseLines();
assert.equal(choiceResponse.some(line => line.kind === '演出提示'), false, 'choice responses cannot insert screenplay directions');
assert.equal(choiceResponse[0].kind, '玩家行动', 'a choice response must begin with the selected gameplay action');
assert.match(choiceResponse[0].text, /^（.+）$/u, 'action and psychology descriptions must stay inside full-width parentheses');
assert.equal(choiceResponse[0].voice, false, 'action descriptions must not be performed as spoken dialogue');
assert.equal(test.voiceCue(choiceResponse[0]).enabled, false, 'parenthesized player actions must not create audio');
const selectedOption = test.choicesForPosition(0, 0)[0];
assert.equal(choiceResponse.some(line => line.kind !== '玩家行动' && (line.text || '').replace(/[“”（）\s]/g, '') === (selectedOption.text || '').replace(/[“”（）\s]/g, '')), false, 'the chosen option must not be recited as spoken dialogue');
test.state.chapter = 3;
test.state.trial = 1;
test.state.pendingChoice = 1;
const honestPast = test.responseLines();
const honestOption = test.choicesForPosition(3, 1)[1];
assert.match(honestOption.text, /把闹龙宫/, 'the Two-Frontier honest-past option must remain available');
assert.equal(honestPast.some(line => line.kind !== '玩家行动' && /把闹龙宫/.test(line.text || '')), false, 'Wukong must not recite the honest-past option after it is chosen');
test.state.chapter = 1;
test.state.trial = 6;
test.state.pendingChoice = 1;
const erlangReply = test.responseLines().find(line => line.speaker === '二郎');
assert.ok(erlangReply, 'Erlang must still answer after the mountain-lure choice');
assert.doesNotMatch(erlangReply.text || '', /七十二变不只比形/, 'Erlang cannot repeat the line he already spoke in the scene');
test.state.chapter = 1;
test.state.trial = 5;
test.state.pendingChoice = 1;
assert.ok(test.responseLines().some(line => line.kind === '角色对白' && /三头六臂/.test(line.text || '')), 'after a fight, Wukong may speak a new line that is not the option text');
test.state.chapter = 0;
test.state.trial = 0;
test.state.pendingChoice = 0;
assert.deepEqual({ ...test.voiceCue({ kind: '角色对白', speaker: '悟空', text: '“俺也去去探路。”（悟空握紧金箍棒，留心前方动静。）' }) }, {
  enabled: true,
  text: '俺也去去探路。',
  speaker: '孙悟空',
  character: '悟空',
  kind: '角色对白',
  narrator: false
}, 'character voice must contain only the spoken sentence');
assert.deepEqual({ ...test.voiceCue({ kind: '场景讲解', speaker: null, text: '众人继续赶路。' }) }, {
  enabled: true,
  text: '众人继续赶路。',
  speaker: '旁白',
  character: null,
  kind: '场景讲解',
  narrator: true
}, 'story narration must use the dedicated male narrator cue');
assert.equal(test.voiceCue({ kind: '行动结果', speaker: null, text: '局势发生变化。' }).enabled, false, 'system results must remain unvoiced');
assert.equal(test.spokenDialogue({ kind: '角色对白', speaker: '悟空', text: '悟空把棒收回来，转身便走。' }), '', 'third-person narration cannot be voiced as character speech');
assert.match(runtimeSource, /classList\.toggle\('is-muted'/, 'the mute switch must show a greyed-out pressed state');
assert.match(runtimeSource, /if \(!state\.sound && next > 0\) state\.sound = true/, 'moving a volume slider must cancel mute');
assert.match(runtimeCss, /\.is-muted/, 'muted menu controls need a greyed visual state');
test.state.chapter = 4;
test.state.trial = 8;
test.state.mode = 'story';
test.state.pendingChoice = null;
const exileLines = test.storyLines();
const exileLine = exileLines.find(line => /你若真要我走/.test(line.text || ''));
assert.equal(exileLine?.speaker, '悟空', 'the banishment farewell must be spoken by Wukong');
test.state.lineIndex = exileLines.indexOf(exileLine);
test.renderLine();
assert.equal(element('#speakerName').textContent, '孙悟空', 'the banishment nameplate must show Wukong, not Xuanzang');
assert.match(element('#dialogueText').textContent, /你若真要我走/, 'the banishment line must stay on Wukong');
test.state.chapter = 4;
test.state.trial = 7;
const boneScene = test.storyLines();
const boneLines = boneScene.filter(line => line.speaker === '白骨');
const boneNames = ['可疑的村姑', '可疑的老妇', '可疑的老翁'];
const boneVoices = ['白骨村姑', '白骨老妇', '白骨老翁'];
assert.equal(boneLines.length, 3, 'White Bone has three spoken disguises before the reveal');
boneLines.forEach((line, index) => {
  assert.equal(String(line.presentation?.白骨?.name || ''), boneNames[index], `disguise ${index + 1} must hide the true name`);
  assert.equal(String(line.voice || ''), boneVoices[index], `disguise ${index + 1} needs a matching age-and-gender voice`);
  const cue = test.voiceCue(line);
  assert.equal(cue.speaker, boneNames[index], `disguise ${index + 1} voice cue must use the visible name`);
  assert.equal(cue.character, boneVoices[index], `disguise ${index + 1} voice cue must use the persona key`);
  assert.equal(cue.enabled, true, `disguise ${index + 1} must be voiced`);
});
test.state.lineIndex = boneScene.indexOf(boneLines[0]);
test.renderLine();
assert.equal(element('#speakerName').textContent, '可疑的村姑', 'the first disguise must not unmask White Bone on the nameplate');
test.state.lineIndex = 0;
test.state.chapter = 0;
test.state.trial = 0;
assert.match(runtimeSource, /isNarratorLine[\s\S]{0,2500}'旁白'[\s\S]{0,2500}dataset\.presentation = presentation/, 'runtime must label narrator, character, system and choice surfaces separately');
assert.doesNotMatch(runtimeSource, /function enrichSceneDialogue/, 'authored story scenes must not receive repetitive generic companion dialogue');
assert.match(runtimeSource, /directSpeech[\s\S]{0,500}displayText/, 'authored character lines must render unmistakably as direct speech');
assert.match(runtimeSource, /const lead = line\.speaker && !isSilentThought \? line\.speaker : null/, 'narration and silent thoughts must never highlight an actor');
assert.doesNotMatch(runtimeSource, /line\.speaker \|\| nearbySpeaker\(sceneLines, index/, 'narration must not borrow the next speaker for actor highlighting');
assert.match(runtimeSource, /participants\.splice\(playerIndex, 1\);\s*participants\.unshift\(player\)/, 'the player character must keep the left-side stage position');
assert.match(runtimeSource, /function inferExpression[^]*?if \(!focused\)[^]*?if \(line\.emotion\)/, 'listening actors must keep a stable neutral portrait instead of copying the speaker emotion');
assert.match(runtimeSource, /function inferAction[^]*?if \(!focused\)[^]*?if \(line\.action\)/, 'listening actors must not copy the speaker action pose');
test.state.pendingChoice = null;
assert.doesNotMatch(runtimeCss, /data-line-kind="演出提示"|direction-mode/, 'screenplay-only dialogue presentation must be removed');
test.state.mode = 'story';
test.state.lineIndex = 1;
test.renderLine();
assert.notEqual(element('#dialogueDeck').dataset.lineKind, '演出提示', 'normal story flow cannot enter a stage-direction state');
assert.doesNotMatch(element('#dialogueText').textContent, /^（.+）$/u, 'story copy cannot render like a screenplay note');
test.state.lineIndex = 0;

test.state.chapter = 2;
test.state.trial = 1;
test.state.mode = 'story';
test.state.lineIndex = 0;
test.state.furthestScene = 19;
assert.equal(test.nextPlayerSceneIndex(20), 28, 'a cutscene skip must find the next Wukong decision scene');
assert.match(test.skipSummaryText(), /两界山相逢/, 'a cutscene skip summary must cover the bridge to the next decision');
element('#skipSummary').classList.add('open');
test.confirmSkipSummary();
assert.equal(`${test.state.chapter}:${test.state.trial}`, '3:1', 'confirming a cutscene skip must land at the next Wukong scene');
assert.equal(test.state.mode, 'choices', 'confirming a cutscene skip must stop at the next choice');
test.state.chapter = 0;
test.state.trial = 0;
test.state.mode = 'story';
test.state.lineIndex = 0;
test.state.pendingChoice = null;
test.state.furthestScene = 0;

const lateMiniGames = ['4:7', '5:5', '6:7', '7:3', '8:7'];
const miniGameTypeCounts = { quiz: 0, duel: 0, battle: 0, catch: 0 };
assert.ok(Object.keys(branch.miniGames).length >= 30, 'the journey needs at least 30 distributed interactions instead of long dialogue-only runs');
assert.equal(branch.miniGames['0:7'].id, 'ledger-strike', 'crossing names from the life-and-death ledger must be playable');
lateMiniGames.forEach(key => assert.ok(branch.miniGames[key], `${key} needs a late-game interaction`));
Object.entries(branch.miniGames).forEach(([key, game]) => {
  assert.ok(branch.sceneChoices[key], `${key} interaction must belong to a real scene`);
  const [chapter, trial] = key.split(':').map(Number);
  assert.ok(test.isPlayerScene(chapter, trial), `${key} interaction cannot run while Wukong is absent`);
  assert.ok(game.id && game.title && game.intro && game.feedback, `${key} interaction needs complete presentation copy`);
  assert.ok(Object.hasOwn(miniGameTypeCounts, game.type), `${key} uses unknown interaction type ${game.type}`);
  miniGameTypeCounts[game.type] += 1;
  if (game.type === 'quiz') {
    assert.ok(Array.isArray(game.rounds) && game.rounds.length >= 1, `${key} quiz needs at least one round`);
    game.rounds.forEach((round, index) => {
      assert.ok(round.prompt && Array.isArray(round.options), `${key} quiz round ${index + 1} needs a prompt and options`);
      assert.ok(round.options.length >= 2 && round.options.length <= 4, `${key} quiz round ${index + 1} needs 2-4 options`);
      assert.ok(Number.isInteger(round.answer) && round.answer >= 0 && round.answer < round.options.length, `${key} quiz round ${index + 1} answer is out of range`);
    });
  } else if (game.type === 'duel') {
    assert.ok(game.prompt && game.opponentName, `${key} duel needs an objective and named opponent`);
    assert.ok(['wukong', 'erlang'].includes(game.opponentRow), `${key} duel uses an unknown hand row`);
    assert.ok(Array.isArray(game.rounds) && game.rounds.length >= 5, `${key} duel needs at least five exchanges`);
    game.rounds.forEach((round, index) => {
      assert.ok(round.tell, `${key} duel exchange ${index + 1} needs a readable tell`);
      assert.ok(['attack', 'guard', 'trick'].includes(round.opponent), `${key} duel exchange ${index + 1} has an invalid move`);
    });
  } else if (game.type === 'battle') {
    assert.ok(game.prompt && game.backdrop && game.playerArt, `${key} battle needs an objective, backdrop and player art`);
    assert.ok(fs.existsSync(game.backdrop), `${key} battle backdrop is missing: ${game.backdrop}`);
    assert.ok(fs.existsSync(game.playerArt), `${key} battle player art is missing: ${game.playerArt}`);
    assert.ok(Number(game.playerHealth) > 0 && Number(game.attackPower) > 0, `${key} battle needs positive player stats`);
    assert.ok(Array.isArray(game.waves) && game.waves.length >= 2, `${key} battle needs at least two waves`);
    game.waves.forEach((wave, index) => {
      assert.ok(wave.name && wave.art && fs.existsSync(wave.art), `${key} battle wave ${index + 1} needs existing opponent art`);
      assert.ok(Number(wave.health) > 0 && Number(wave.damage) > 0 && Number(wave.speed) > 0 && Number(wave.attackRate) > 0, `${key} battle wave ${index + 1} needs positive combat stats`);
    });
  } else if (game.type === 'catch') {
    assert.ok(game.prompt && ['peach', 'web'].includes(game.theme), `${key} catch game needs an objective and known theme`);
    assert.ok(Number(game.duration) >= 15 && Number(game.targetScore) >= 5, `${key} catch game needs a meaningful duration and target`);
    assert.ok(Number(game.lives) >= 1 && Number(game.spawnRate) >= 300, `${key} catch game needs valid hazard tuning`);
    if (game.backdrop) assert.ok(fs.existsSync(game.backdrop), `${key} catch backdrop is missing: ${game.backdrop}`);
  }
  assert.equal(test.miniGameScoreLimit(game) > 0, true, `${key} needs a positive score limit`);
  assert.ok(test.miniGamePassScore(game) > 0 && test.miniGamePassScore(game) <= test.miniGameScoreLimit(game), `${key} pass score must fit its score limit`);
  Object.keys(game.reward?.relations || {}).forEach(character => {
    assert.ok(allCharacterInfo[character], `${key} interaction rewards unknown relationship character ${character}`);
    assert.ok(!playerAliases.has(character), `${key} interaction cannot award relationship points to the player`);
  });
  Object.keys(game.reward?.routes || {}).forEach(route => {
    assert.ok(['defiance', 'bond', 'discipline', 'insight'].includes(route), `${key} interaction rewards unknown route ${route}`);
  });
  Object.entries(game.reward?.flags || {}).forEach(([flag, value]) => {
    if (!flagOrigins.has(flag)) flagOrigins.set(flag, new Set());
    flagOrigins.get(flag).add(JSON.stringify(value));
  });
  Object.keys(game.masteryReward?.relations || {}).forEach(character => {
    assert.ok(allCharacterInfo[character], `${key} mastery rewards unknown relationship character ${character}`);
    assert.ok(!playerAliases.has(character), `${key} mastery cannot award relationship points to the player`);
  });
  Object.keys(game.masteryReward?.routes || {}).forEach(route => {
    assert.ok(['defiance', 'bond', 'discipline', 'insight'].includes(route), `${key} mastery rewards unknown route ${route}`);
  });
  Object.entries(game.masteryReward?.flags || {}).forEach(([flag, value]) => {
    if (!flagOrigins.has(flag)) flagOrigins.set(flag, new Set());
    flagOrigins.get(flag).add(JSON.stringify(value));
  });
});
assert.ok(miniGameTypeCounts.quiz >= 9, 'quiz interactions must retain the authored lore challenges');
assert.ok(miniGameTypeCounts.duel >= 2, 'at least two hand-duel interactions are required');
assert.ok(miniGameTypeCounts.battle >= 4, 'at least four side-view battles are required');
assert.ok(miniGameTypeCounts.catch >= 2, 'at least two falling-object interactions are required');
assert.ok(fs.existsSync('assets/minigames/duel-hands.png'), 'the duel hand sprite sheet is missing');
assert.ok(fs.existsSync('assets/minigames/peach-items.png'), 'the peach item sprite sheet is missing');
assert.equal(test.duelOutcome('guard', 'attack'), 'win', 'guard must beat attack');
assert.equal(test.duelOutcome('attack', 'trick'), 'win', 'attack must beat trick');
assert.equal(test.duelOutcome('trick', 'guard'), 'win', 'trick must beat guard');
assert.equal(test.duelOutcome('attack', 'guard'), 'loss', 'the reverse matchup must lose');
assert.equal(test.duelOutcome('trick', 'trick'), 'draw', 'matching moves must draw');

assert.ok(Object.keys(branch.branchEchoes).length >= 25, 'branch echoes need to cover about 25 scenes');
Object.entries(branch.branchEchoes).forEach(([key, entries]) => {
  assert.ok(branch.sceneChoices[key], `${key} echo target must be a real scene`);
  entries.forEach(entry => {
    if (entry.when.flag) {
      const [flag, value] = entry.when.flag;
      assert.ok(flagOrigins.has(flag), `${key} echo flag ${flag} has no choice origin`);
      assert.ok(flagOrigins.get(flag).has(JSON.stringify(value)), `${key} echo flag ${flag}=${JSON.stringify(value)} has no matching choice origin`);
    }
    if (entry.line.speaker) {
      const directDialogue = /^“[\s\S]+”$/u.test(entry.line.text.trim());
      const silentThought = entry.line.voice === false && /^（[\s\S]+）$/u.test(entry.line.text.trim());
      assert.ok(directDialogue || silentThought, `${key} character echo must be direct dialogue or an explicitly silent parenthesized thought`);
    }
    if (entry.when.relation) assert.ok(allCharacterInfo[entry.when.relation[0]], `${key} echo uses unknown relationship character`);
    if (entry.when.route) assert.ok(['defiance', 'bond', 'discipline', 'insight'].includes(entry.when.route[0]), `${key} echo uses unknown route`);
  });
});
const silentEndingThought = branch.branchEchoes['8:1'].map(entry => entry.line).find(line => /看见结局/.test(line.text));
assert.equal(silentEndingThought.kind, '心理活动', 'the “看见结局” reflection must be staged as inner thought');
assert.equal(silentEndingThought.voice, false, 'inner thought must not be voiced');
assert.match(silentEndingThought.text, /^（[\s\S]+）$/u, 'inner thought must remain parenthesized');

Object.keys(branch.relationDefaults).forEach(character => {
  assert.ok(allCharacterInfo[character], `relation default uses unknown character ${character}`);
  assert.ok(!playerAliases.has(character), `the player cannot appear in relationship defaults (${character})`);
});
assert.equal(branch.relationDefaults.石猴, undefined, 'Stone Monkey must not be a relationship target');
assert.equal(branch.relationDefaults.悟空, undefined, 'Wukong must not be a relationship target');

test.state.marks = [{ chapter: 0, trial: 0, choice: 0, trait: 'resolve', relations: { 石猴: 7, 悟空: 9, 群猴: 1 }, flags: {}, routes: {} }];
test.state.furthestScene = 0;
test.recalculateScores(0);
assert.equal(Object.hasOwn(test.state.relationships, '石猴'), false, 'recalculation must discard legacy Stone Monkey self-relationship data');
assert.equal(Object.hasOwn(test.state.relationships, '悟空'), false, 'recalculation must discard legacy Wukong self-relationship data');
assert.ok(!test.encounteredCharacters().some(character => playerAliases.has(character)), 'the relationship ledger must exclude the player');
test.state.marks = [];
test.recalculateScores();

Object.entries(test.defaultArt).forEach(([role, source]) => {
  assert.ok(fs.existsSync(source), `${role} art is missing: ${source}`);
});

const reinforcedBusts = ['悟净', '菩提', '八戒', '观音', '铁扇', '白骨', '红孩', '如来'];
const reinforcedAlpha = Object.fromEntries(reinforcedBusts.map(role => {
  const coverage = pngAlphaCoverage(test.defaultArt[role]);
  assert.ok(coverage.visible > 0, `${role} bust needs a visible silhouette`);
  assert.ok(coverage.ratio >= 0.9, `${role} bust is still translucent (${(coverage.ratio * 100).toFixed(2)}% solid)`);
  return [role, coverage.ratio];
}));

const actionSheets = [
  'assets/minigames/fighters/wukong/great-sage/action-sheet.png',
  'assets/minigames/fighters/wukong/pilgrim-circlet/action-sheet.png',
  'assets/minigames/fighters/heaven-soldier/action-sheet.png',
  'assets/minigames/fighters/nezha/action-sheet.png',
  'assets/minigames/fighters/black-bear/action-sheet.png',
  'assets/minigames/fighters/red-boy/action-sheet.png',
  'assets/minigames/fighters/bull-demon/warrior-action-sheet.png',
  'assets/minigames/fighters/bull-demon/true-form-action-sheet.png'
];
const actionSheetAlpha = Object.fromEntries(actionSheets.map(source => {
  assert.ok(fs.existsSync(source), `action sprite sheet is missing: ${source}`);
  const coverage = pngAlphaCoverage(source, { columns: 4, rows: 2 });
  assert.equal(coverage.width, 1776, `${source} must keep the canonical four-column width`);
  assert.equal(coverage.height, 888, `${source} must keep the canonical two-row height`);
  assert.equal(coverage.width % 4, 0, `${source} width must divide into four sprite columns`);
  assert.equal(coverage.height % 2, 0, `${source} height must divide into two sprite rows`);
  assert.ok(coverage.coverage >= 0.12 && coverage.coverage <= 0.33, `${source} visible subject density must stay near 12%-32% after fringe cleanup (found ${(coverage.coverage * 100).toFixed(2)}%)`);
  assert.deepEqual(coverage.corners, { topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0 }, `${source} must keep transparent corners without an opaque frame`);
  coverage.cellVisible.forEach((pixels, index) => assert.ok(pixels >= 1000, `${source} sprite cell ${index + 1} needs a visible character pose`));
  return [source, coverage.cellVisible];
}));

const timelineOptions = [branch.sceneChoices['0:0'][0], branch.sceneChoices['0:1'][0]];
test.state.chapter = 0;
test.state.trial = 0;
test.state.marks = timelineOptions.map((option, trial) => ({
  chapter: 0,
  trial,
  choice: 0,
  optionId: option.id,
  trait: option.trait,
  relations: option.relations,
  flags: option.flags,
  routes: option.routes
}));
test.recalculateScores(0);
assert.equal(test.state.flags.bornDefiant, true, 'current timeline must include earlier decisions');
assert.equal(test.state.flags.waterCurtainBold, undefined, 'revisiting an early scene cannot inherit future flags');
assert.equal(test.state.resolve, 1, 'timeline cutoff must exclude future trait scores');
assert.equal(test.state.decisionHistory.length, 1, 'active decision history must follow the same timeline cutoff');
test.recalculateScores(1);
assert.equal(test.state.flags.waterCurtainBold, true, 'advancing the cutoff must restore the next decision');
assert.equal(test.state.resolve, 2, 'timeline cutoff must restore scores as scenes are reached');
test.state.furthestScene = 1;
test.state.completedMiniGames = { '0:1': { skipped: false, rewarded: true, score: 3 } };
test.truncateFutureProgress();
assert.equal(test.state.marks.length, 1, 'rewriting history must remove later choices');
assert.equal(Object.keys(test.state.completedMiniGames).length, 0, 'rewriting history must remove later interaction results');
assert.equal(test.state.furthestScene, 0, 'rewriting history must move the active frontier to the chosen scene');
test.state.marks = [];
test.state.completedMiniGames = {};
test.recalculateScores();

assert.equal(test.autoDelayFor({ speaker: '悟空', text: '很短。' }), 2000, 'text-only auto play should wait about two seconds');
assert.equal(test.autoDelayFor({ speaker: '悟空', text: '长'.repeat(80) }, { hasVoice: true }), 420, 'voiced auto play must wait for TTS to finish, then only a short beat');

const sanitizedMiniGames = test.sanitizeMiniGameResults({
  '0:1': { skipped: false, rewarded: true, score: 999 },
  '99:99': { skipped: false, rewarded: true, score: 3 },
  '0:2': 'broken'
});
assert.deepEqual(Object.keys(sanitizedMiniGames), ['0:1'], 'save recovery must discard unknown or malformed interaction results');
assert.equal(sanitizedMiniGames['0:1'].score, test.miniGameScoreLimit(branch.miniGames['0:1']), 'save recovery must clamp quiz scores');
assert.equal(sanitizedMiniGames['0:1'].version, 1, 'legacy interaction results must remain loadable as version 1 records');
const sanitizedActionGames = test.sanitizeMiniGameResults({
  '1:2': { version: 2, skipped: false, rewarded: true, score: 999, grade: 'S', rating: 999, metrics: { collected: 9, completed: true, unsafe: 'discard' } },
  '1:5': { skipped: false, rewarded: true, score: 999 },
  '1:6': { skipped: false, rewarded: true, score: 999 }
});
assert.equal(sanitizedActionGames['1:2'].score, branch.miniGames['1:2'].targetScore, 'save recovery must clamp catch scores');
assert.equal(sanitizedActionGames['1:2'].version, 2, 'version 2 interaction results must retain their schema version');
assert.equal(sanitizedActionGames['1:2'].rating, 100, 'version 2 ratings must be clamped');
assert.deepEqual(sanitizedActionGames['1:2'].metrics, { collected: 9, completed: true }, 'version 2 metrics must discard nonnumeric save payloads');
assert.equal(sanitizedActionGames['1:5'].score, branch.miniGames['1:5'].waves.length, 'save recovery must clamp battle scores');
assert.equal(sanitizedActionGames['1:6'].score, branch.miniGames['1:6'].rounds.length, 'save recovery must clamp duel scores');

let confirmationRan = false;
test.openConfirmation({ title: '确认测试', text: '确认框必须留在游戏内。', onConfirm: () => { confirmationRan = true; } }, element('confirmation-trigger'));
assert.ok(element('#confirmationModal').classList.contains('open'), 'custom confirmation must open as an in-game modal');
test.closeConfirmation({ restoreFocus: false, confirm: true });
assert.equal(confirmationRan, true, 'custom confirmation must run its confirmed action');
assert.equal(element('#confirmationModal').classList.contains('open'), false, 'custom confirmation must close before running its action');

function assetSources(value, sources = []) {
  if (typeof value === 'string') {
    if (value.startsWith('assets/')) sources.push(value);
    return sources;
  }
  if (Array.isArray(value)) value.forEach(entry => assetSources(entry, sources));
  else if (value && typeof value === 'object') Object.values(value).forEach(entry => assetSources(entry, sources));
  return sources;
}

const branchAssets = new Set(assetSources([
  branch.periodArt,
  branch.performanceArt,
  branch.sceneBackdrops,
  branch.transitionArt,
  branch.sceneScripts,
  branch.miniGames
]));
branchAssets.forEach(source => assert.ok(fs.existsSync(source), `branch asset is missing: ${source}`));
actionSheets.forEach(source => assert.ok(branchAssets.has(source), `action sprite sheet must remain referenced by gameplay configuration: ${source}`));

const usedActorSources = new Set(assetSources([
  test.defaultArt,
  canonical.sceneArt,
  canonical.sceneScripts,
  branch.periodArt,
  branch.performanceArt,
  branch.sceneScripts
]).filter(source => source.startsWith('assets/characters/')));
assert.equal(usedActorSources.size, 61, 'the runtime should continue using 61 dedicated character sources');
assert.deepEqual([...Object.keys(test.actorFraming).sort()], [...usedActorSources].sort(), 'every used character source needs one framing record and no stale records');
const framingScaleRanges = {
  close: [0.7, 0.85],
  half: [0.75, 1.2],
  full: [1.1, 1.75],
  wide: [0.85, 1],
  'scene-prop': [0.95, 1.1]
};
usedActorSources.forEach(source => {
  const framing = test.actorFraming[source];
  assert.ok(['close', 'half', 'full', 'wide', 'scene-prop'].includes(framing.mode), `${source} has an unknown framing mode`);
  assert.ok(Number.isFinite(framing.scale) && framing.scale > 0.6 && framing.scale < 2, `${source} framing scale is unsafe`);
  const [minimumScale, maximumScale] = framingScaleRanges[framing.mode];
  assert.ok(framing.scale >= minimumScale && framing.scale <= maximumScale, `${source} uses ${framing.scale} outside the calibrated ${framing.mode} range`);
  assert.ok(Number.isFinite(framing.x) && Number.isFinite(framing.y), `${source} framing offsets must be numeric`);
  if (framing.mode !== 'scene-prop') assert.ok(Math.abs(framing.x) <= 4 && Math.abs(framing.y) <= 8, `${source} framing correction must stay slight`);
  assert.equal(test.framingFor(source), framing, `${source} must resolve framing by source, independent of emotion/action`);
});

const stablePerformanceFrames = {
  '石猴幼年': [
    'assets/characters/wukong/stone-child/neutral.png',
    'assets/characters/wukong/stone-child/determined.png',
    'assets/characters/wukong/stone-child/thoughtful.png'
  ],
  '悟空方寸山': [
    'assets/characters/wukong/disciple-no-circlet/alert.png',
    'assets/characters/wukong/disciple-no-circlet/humble.png',
    'assets/characters/wukong/disciple-no-circlet/neutral.png'
  ],
  '悟空猴王': [
    'assets/characters/wukong/monkey-king-no-circlet/determined.png',
    'assets/characters/wukong/monkey-king-no-circlet/neutral.png'
  ],
  '悟空大圣': [
    'assets/characters/wukong/great-sage/defiant-portrait.png',
    'assets/characters/wukong/great-sage/neutral-portrait.png'
  ],
  '悟空取经': [
    'assets/characters/wukong-released.png',
    'assets/characters/wukong/pilgrim-circlet/angry-strike.png',
    'assets/characters/wukong/pilgrim-circlet/pained-recoil.png',
    'assets/characters/wukong/pilgrim-circlet/thoughtful.png'
  ],
  '玄奘取经': [
    'assets/characters/tang/pilgrim/relieved.png',
    'assets/characters/tang/pilgrim/stern.png',
    'assets/characters/tang/pilgrim/worried.png'
  ],
  '八戒取经': [
    'assets/characters/bajie/pilgrim/cheerful.png',
    'assets/characters/bajie/pilgrim/protective.png',
    'assets/characters/bajie/pilgrim/worried-portrait.png'
  ],
  '悟净取经': [
    'assets/characters/sha/pilgrim/guard.png',
    'assets/characters/sha/pilgrim/thoughtful-portrait.png',
    'assets/characters/sha/pilgrim/wounded.png'
  ]
};
Object.entries(stablePerformanceFrames).forEach(([period, sources]) => {
  const frames = sources.map(source => test.actorFraming[source]);
  assert.equal(new Set(frames.map(frame => frame.scale)).size, 1, `${period} expression swaps must keep one stage height`);
  assert.equal(new Set(frames.map(frame => frame.mode)).size, 1, `${period} expression swaps must keep one crop mode`);
});

const extendedRoles = ['群猴', '龙王', '阎王', '太白', '玉帝', '王母', '哪吒', '李靖', '二郎', '老君', '唐王', '魏征', '白龙', '金池', '女王', '六耳', '镇元', '老鼋'];
const extendedSources = extendedRoles.map(role => test.defaultArt[role]);
assert.equal(new Set(extendedSources).size, extendedSources.length, 'extended roles cannot reuse placeholder art');

assert.match(branch.periodArt['3:2'].悟空, /no-circlet/, 'released Wukong must be without the fillet');
assert.match(branch.periodArt['3:3'].悟空.beforeFlag, /no-circlet/, 'pre-hat Wukong must be without the fillet');
assert.match(branch.periodArt['3:3'].悟空.afterFlag, /wukong-released/, 'post-hat Wukong must wear the fillet');
assert.equal(branch.performanceArt['3:3'].悟空, undefined, 'pilgrimage circlet art cannot appear before the fillet is worn');

test.state.chapter = 3;
test.state.trial = 2;
test.state.flags = {};
assert.match(test.artFor('悟空', 'strike', true, 'angry', {}), /no-circlet/, '3:2 runtime art must stay without the fillet');
test.state.trial = 3;
assert.match(test.artFor('悟空', 'listen', true, 'calm', {}), /no-circlet/, '3:3 runtime art must begin without the fillet');
test.state.flags.filletWorn = true;
assert.match(test.artFor('悟空', 'listen', true, 'calm', {}), /wukong-released/, '3:3 runtime art must gain the fillet only after the flag');
test.state.trial = 4;
assert.match(test.artFor('悟空', 'strike', true, 'angry', {}), /pilgrim-circlet\/angry-strike/, '3:4 runtime art must use the new circlet state');

[
  ['悟空', '3:4', /wukong\/pilgrim-circlet/],
  ['玄奘', '3:0', /tang\/pilgrim/],
  ['八戒', '3:7', /bajie\/pilgrim/],
  ['悟净', '4:1', /sha\/pilgrim/]
].forEach(([role, key, pattern]) => {
  const states = new Set(Object.values(branch.performanceArt[key][role]).filter(source => typeof source === 'string' && pattern.test(source)));
  assert.ok(states.size >= 3, `${role} must have at least three distinct pilgrimage state files at ${key}`);
});

const whiteBoneSequence = [...new Set(branch.sceneScripts['4:7']
  .map(line => line.art?.白骨)
  .filter(Boolean))];
assert.deepEqual(whiteBoneSequence, [
  'assets/characters/white-bone/disguises/maiden-offering.png',
  'assets/characters/white-bone/disguises/old-woman-accusing.png',
  'assets/characters/white-bone/disguises/old-man-accusing.png',
  'assets/characters/white-bone/true-form-reveal-portrait.png'
], 'White Bone Spirit must change in original-story order');
test.state.chapter = 4;
test.state.trial = 7;
assert.match(test.artFor('白骨', 'advance', true, 'sly', branch.sceneScripts['4:7'][0]), /maiden-offering/, '4:7 must open with the maiden disguise');
assert.match(test.artFor('白骨', 'startle', true, 'surprised', branch.sceneScripts['4:7'].at(-1)), /true-form-reveal-portrait/, '4:7 must close on the revealed true form');
assert.deepEqual([...branch.castOverrides['4:5']], ['悟空', '镇元']);

test.state.marks = [];
test.state.completedMiniGames = { '4:7': { skipped: false, rewarded: true, score: 3 } };
test.recalculateScores();
assert.equal(test.state.flags.whiteBoneDiscerned, true, 'rewarded interactions must persist their flags');
assert.equal(test.state.relationships.玄奘, 1, 'rewarded interactions must affect relationships');
assert.equal(test.state.routeScores.insight, 1, 'rewarded interactions must affect routes');
test.state.completedMiniGames = {};
test.recalculateScores();

const lateMiniGameEchoes = [
  ['4:7', 4, 8, /三次变化的脚印/],
  ['5:5', 5, 6, /辨清三昧火/],
  ['6:7', 6, 8, /共同经历已经先于胜负/],
  ['7:3', 7, 4, /息火、生风、降雨/],
  ['8:7', 8, 8, /逐卷分开、缓缓揭页/]
];
lateMiniGameEchoes.forEach(([sourceKey, chapter, trial, pattern]) => {
  test.state.completedMiniGames = { [sourceKey]: { skipped: false, rewarded: true, score: 3 } };
  test.recalculateScores();
  test.state.chapter = chapter;
  test.state.trial = trial;
  assert.ok(test.storyLines().some(line => pattern.test(line.text)), `${sourceKey} reward needs a visible echo at ${chapter}:${trial}`);
});
test.state.completedMiniGames = {};
test.recalculateScores();

['2:5', '2:6', '3:4', '3:5', '4:5', '4:7', '5:0', '5:2', '5:3', '6:5', '6:7', '8:7'].forEach(key => {
  assert.ok(branch.sceneBackdrops[key], `${key} needs a dedicated backdrop`);
});

const endingTitles = new Set();
for (const route of ['defiance', 'bond', 'discipline', 'insight']) {
  test.state.completed = false;
  test.state.routeScores = { defiance: 0, bond: 0, discipline: 0, insight: 0, [route]: 99 };
  test.state.flags = {};
  test.state.relationships = {};
  test.finish();
  endingTitles.add(element('#endingTitle').textContent);
}
assert.equal(endingTitles.size, 4, 'the four main routes need distinct endings');

const fusionPairs = [
  ['defiance', 'bond'],
  ['defiance', 'discipline'],
  ['defiance', 'insight'],
  ['bond', 'discipline'],
  ['bond', 'insight'],
  ['discipline', 'insight']
];
const fusionTexts = new Set();
fusionPairs.forEach(([primary, secondary]) => {
  test.state.completed = false;
  test.state.routeScores = { defiance: 0, bond: 0, discipline: 0, insight: 0, [primary]: 40, [secondary]: 39 };
  test.state.flags = {};
  test.state.relationships = {};
  test.finish();
  const text = element('#endingText').textContent;
  assert.match(text, /并行/, `${primary}/${secondary} needs a fusion ending paragraph`);
  fusionTexts.add(text);
});
assert.equal(fusionTexts.size, 6, 'all six route pairs need distinct fusion ending text');

const endingFlagCases = [
  [{ dragonDeal: 'coerced' }, /东海仍将强取神珍/],
  [{ filletResponse: 'covenant' }, /两界山定下的咒界/],
  [{ whiteDragonMeeting: 'recognized' }, /鹰愁涧少去的一场恶斗/],
  [{ wuzhuangFruitMethod: 'stole' }, /五庄观那枚背人摘下/],
  [{ whiteBoneMethod: 'captured' }, /白骨真形曾被留到/],
  [{ exileResponse: 'left-help' }, /逐走之日留下的救命毫毛/],
  [{ redBoyEnding: 'consented' }, /红孩儿记得莲台前/],
  [{ daughterFarewell: 'honest' }, /西梁城门那场坦白/],
  [{ fanApproach: 'force' }, /闯洞强夺的第一棒/],
  [{ flameResolution: 'returned' }, /芭蕉扇如约回到/],
  [{ monkeyIdentityProof: 'memories' }, /真假行者最终由共同经历/],
  [{ sixEarEnding: 'spared' }, /六耳没有以尸身/],
  [{ scriptureTrust: 'verified' }, /灵山也曾递来无字白本/],
  [{ wetScriptures: 'documented' }, /晒石上粘破的经页/],
  [{ finalVow: 'record-causes' }, /八十一难的误认/]
];
endingFlagCases.forEach(([flags, pattern]) => {
  test.state.completed = false;
  test.state.routeScores = { defiance: 50, bond: 0, discipline: 0, insight: 0 };
  test.state.flags = flags;
  test.state.relationships = {};
  test.finish();
  assert.match(element('#endingText').textContent, pattern, `ending needs flag echo for ${JSON.stringify(flags)}`);
});

assert.equal(test.relationStanding(12), '深契');
assert.equal(test.relationStanding(5), '亲厚');
assert.equal(test.relationStanding(1), '相近');
assert.equal(test.relationStanding(0), '初识');
assert.equal(test.relationStanding(-1), '生隙');
assert.equal(test.relationStanding(-4), '疏离');
assert.equal(test.relationStanding(-10), '结怨');

const htmlSource = fs.readFileSync('index.html', 'utf8');
assert.doesNotMatch(htmlSource, /幕间旁白|第 01 \/ 81 幕|幕中提要|返回本幕|id="stageCue"/, 'player-facing UI cannot use screenplay terminology or stage cues');
assert.match(htmlSource, /id="trialLabel">第 01 \/ 81 难</, 'progress must read as game challenges rather than screenplay acts');
assert.match(htmlSource, /class="desktop-shortcuts"[\s\S]*<kbd>Enter<\/kbd>[\s\S]*<kbd>1–4<\/kbd>[\s\S]*<kbd>A<\/kbd>[\s\S]*<kbd>S<\/kbd>/, 'desktop HUD must explain keyboard shortcuts');
assert.match(htmlSource, /id="choiceTimer"[^>]*hidden[\s\S]*id="choiceTimerFill"/, 'choices need a visible ten-second countdown');
assert.doesNotMatch(htmlSource, /id="choiceImpact"/, 'response dialogue must not mix cumulative trait totals into the line');
assert.doesNotMatch(runtimeSource, /本次选择 ·/, 'response dialogue must stay simple instead of announcing cumulative choice totals');
assert.match(htmlSource, /id="startMenu"[\s\S]*id="startContinue"[\s\S]*id="startNew"[\s\S]*id="startArchive"[\s\S]*id="startSound"/, 'the game needs a full start menu with continue, new journey, archive and sound options');
assert.match(htmlSource, /class="start-brand"[\s\S]*id="startTitle"[\s\S]*class="start-menu-panel"[\s\S]*id="startJournal"[\s\S]*id="startRelations"/, 'the start menu must separate the title from options and keep journal plus relations on the main menu');
assert.match(htmlSource, /family=Ma\+Shan\+Zheng/, 'the start title needs a calligraphic display font');
assert.match(htmlSource, /id="journeyArchive"[\s\S]*id="archiveScroll"/, 'completion history needs a dedicated continuous 81-trial archive');
assert.match(htmlSource, /id="endingHero"[\s\S]*id="endingArchive"[\s\S]*id="endingReview"[\s\S]*id="endingMenu"[\s\S]*id="restartJourney"/, 'the ending must offer art, archive, review, menu and optional restart actions');
assert.match(htmlSource, /id="routeCompass"/, 'pause menu needs the route compass');
assert.match(htmlSource, /id="relationsBtn"/, 'pause menu needs the relationship ledger entry');
assert.match(htmlSource, /id="pauseCheckpoint"/, 'pause menu needs a clear current checkpoint');
assert.match(htmlSource, /id="confirmationModal"[^>]*aria-hidden="true"/, 'destructive actions need an in-game confirmation modal');
function cssZIndex(source, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = source.match(new RegExp(`${escaped}\\{[^}]*z-index:(\\d+)`));
  return Number(match && match[1]);
}
assert.match(htmlSource, /role="alertdialog"/, 'destructive confirmation needs alertdialog semantics');
assert.match(htmlSource, /id="stageBackdrop"[^>]*decoding="async"[^>]*fetchpriority="high"/, 'the first backdrop needs explicit decode and priority hints');
assert.equal((htmlSource.match(/class="actor-anchor"/g) || []).length, 2, 'both actor slots need an independent framing layer');
assert.equal((htmlSource.match(/class="actor-motion"/g) || []).length, 2, 'both actor slots need an independent motion layer');
['defiance', 'bond', 'discipline', 'insight'].forEach(route => {
  assert.match(htmlSource, new RegExp(`id="${route}RouteScore"`), `route compass needs ${route} score`);
});

const cssSource = fs.readFileSync('shadowplay.css', 'utf8');
assert.ok(
  cssZIndex(cssSource, '.confirmation-modal') > cssZIndex(cssSource, '.start-menu'),
  'new-journey confirmation must sit above the start menu or the menu becomes inert and unclickable'
);
assert.ok(
  cssZIndex(cssSource, '.confirmation-modal') > cssZIndex(cssSource, '.ending-modal'),
  'ending restart confirmation must sit above the ending card'
);
const miniGameCssSource = fs.readFileSync('shadowplay-minigames.css', 'utf8');
const miniGameEngineSource = fs.readFileSync('shadowplay-minigames.js', 'utf8');
for (let chapter = 0; chapter < 9; chapter += 1) {
  assert.ok(cssSource.includes(`data-chapter="${chapter}"`), `chapter ${chapter} needs its own lighting grade`);
}
assert.match(cssSource, /@keyframes puppetLift/, 'shadow puppets need a pick-up entrance animation');
assert.match(cssSource, /@keyframes actorPoseSwap\{from\{opacity:\.48\}to\{opacity:1\}\}/, 'expression swaps need a scale-free dissolve');
assert.match(cssSource, /@keyframes endingUnfurl/, 'ending needs vertical scroll unfurl animation');
assert.match(cssSource, /scene-curtain\.chapter-turn/, 'chapter transitions need a slower curtain state');
assert.match(cssSource, /@media\(prefers-reduced-motion:reduce\)/, 'motion needs a reduced-motion fallback');
assert.match(cssSource, /\.hud-button,\.pause-button\{min-height:44px\}/, 'HUD touch controls need a 44px target');
assert.match(cssSource, /\.desktop-shortcuts\{display:flex/, 'desktop shortcuts need a persistent HUD presentation');
assert.match(cssSource, /\.choice-timer\.urgent/, 'choice countdown needs an urgent state');
assert.match(cssSource, /\.choice-timer\[hidden\]\{display:none!important\}/, 'the countdown must be completely absent outside active choices');
assert.match(cssSource, /data-presentation="character"[\s\S]{0,700}align-items:center;justify-content:center;text-align:center/, 'spoken character lines must be centered in their dialogue surface');
assert.match(cssSource, /data-presentation="character"[^}]*story-copy h1\{position:absolute;top:12px;left:132px;display:block[^}]*font:500 10px/, 'character scene titles must be compact corner context rather than headline content');
assert.match(cssSource, /data-presentation="narrator"[\s\S]{0,500}#345564/, 'narration needs a visually distinct cool-toned reading surface');
assert.match(cssSource, /data-presentation="narrator"[^}]*story-copy[^}]*display:flex[^}]*align-items:center;justify-content:center;text-align:center/, 'narration copy must be vertically and horizontally centered');
assert.match(cssSource, /data-presentation="narrator"[^}]*story-copy p\{[^}]*font-size:clamp\(19px,1\.75vw,27px\)[^}]*text-align:center/, 'narration paragraphs must be large and centered');
assert.match(cssSource, /data-line-kind="心理活动"[^}]*story-copy p\{[^}]*color:#c9c1b4/, 'silent thoughts need a subdued parenthesized presentation');
assert.match(cssSource, /\.start-vista i:nth-child\(1\)[^}]*huaguo-birth-stage\.png[\s\S]*\.start-vista i:nth-child\(2\)[^}]*changan-departure\.png[\s\S]*\.start-vista i:nth-child\(3\)[^}]*lingshan-stage\.png/, 'start menu needs a three-stop animated journey vista');
assert.match(cssSource, /\.archive-entries\{display:block;border-top:/, 'the 81-trial archive must be one continuous top-to-bottom stream');
assert.match(cssSource, /\.archive-scroll\{overflow-y:auto;overflow-x:hidden/, 'the full archive needs one uninterrupted vertical scroll surface');
assert.doesNotMatch(cssSource, /\.archive-chapter>h3\{position:sticky/, 'chapter headings must not interrupt continuous long-scroll reading');
assert.match(cssSource, /\.cast-stage:not\(\.is-single\) \.stage-actor-left\{left:-7%\}/, 'mobile actors need separated fixed crop windows');
assert.match(cssSource, /\.character,\.cast-stage\.is-single \.stage-actor-left\{width:72%;height:98%\}/, 'mobile single and paired actors must keep one fixed frame size');
assert.match(cssSource, /\.dialogue-deck\.choice-ready\{max-height:72dvh\}/, 'mobile four-choice scenes need extra vertical room');
assert.match(cssSource, /width:min\(1500px,calc\(100% - clamp\(84px,16vw,296px\)\)\)/, 'desktop actor slots need a stable centered stage width');
assert.match(cssSource, /\.actor-anchor\{[^}]*--actor-frame-x[^}]*--actor-frame-y[^}]*scale\(var\(--actor-frame-scale\)\)/s, 'source framing must live on the outer actor layer');
assert.match(cssSource, /\.actor-motion\{[^}]*--actor-shift-x[^}]*scaleX\(var\(--actor-facing\)\)[^}]*--actor-tilt/s, 'performance motion must live on the inner actor layer');
assert.match(cssSource, /\.character\{\s*--actor-frame-scale:[^}]*transition:none;[^}]*will-change:auto/s, 'focus light must switch immediately instead of retaining the previous actor during interpolation');
assert.match(cssSource, /\.character img,\.stage-actor-right img,\.cast-stage\.is-single \.stage-actor-left img\{[^}]*object-fit:cover[^}]*object-position:center top[^}]*transform:none!important/s, 'character images need one fixed Galgame crop window without their own geometry transform');
assert.match(cssSource, /data-frame-mode="full"[\s\S]{0,180}object-fit:contain[\s\S]{0,80}object-position:center bottom/, 'full-figure portraits must keep weapons and props inside the frame');
assert.match(cssSource, /\.cast-stage\.is-single \.stage-actor-left\{width:min\(43%,510px\);height:100%\}/, 'single-character scenes must keep the same desktop scale');
const artKindBlocks = cssSource.match(/[^{}]*data-art-kind[^{}]*\{[^{}]*\}/g) || [];
artKindBlocks.forEach(block => assert.doesNotMatch(block, /(?:^|[;{])\s*(?:width|height)\s*:/, 'art kind may change masking but never actor frame dimensions'));
const actionBlocks = cssSource.match(/\.character\[data-action="[^"]+"\]\{[^{}]*\}/g) || [];
assert.ok(actionBlocks.length >= 8, 'actor action rules are missing');
actionBlocks.forEach(block => assert.doesNotMatch(block, /--actor-scale\s*:/, 'dialogue actions must not resize actors'));
actionBlocks.forEach(block => assert.doesNotMatch(block, /--actor-frame-scale\s*:/, 'dialogue actions cannot alter source framing'));
assert.match(cssSource, /\.character\[data-action\]\{--actor-shift-y:0px\}/, 'completed actions must return to one vertical baseline');
assert.match(cssSource, /puppet-enter\.beat-enter \.actor-motion/, 'puppet entrance animation must preserve the outer framing scale');
const focusedLightRules = [...cssSource.matchAll(/[^{}]*\.is-focused[^{}]*\{[^{}]*filter:brightness\(([\d.]+)\)[^{}]*\}/g)];
assert.ok(focusedLightRules.length >= 10, 'focused actors need a base, narration, character and expression light');
focusedLightRules.forEach(([, brightness]) => {
  assert.ok(Number(brightness) >= 1.1 && Number(brightness) <= 1.3, `focused actor brightness must preserve costume detail (found ${brightness})`);
});
assert.match(cssSource, /\.character\.is-focused\{filter:brightness\(1\.17\)/, 'the active performer needs a clear key light without overexposure');
assert.match(cssSource, /data-character="菩提"[^}]*data-character="悟净"[^}]*brightness\(1\.28\)[^}]*drop-shadow\(0 0 7px rgba\(255,238,185,\.94\)\)[^}]*drop-shadow\(0 0 42px rgba\(235,177,57,\.78\)\)/, 'Bodhi and Wujing need an unmistakable gold key light');
assert.match(cssSource, /data-character="观音"[^}]*brightness\(1\.14\)/, 'Guanyin needs a lower white-costume key light');
assert.match(cssSource, /\.character\.is-listening,\.character\[data-art-kind="portrait"\]\.is-listening\{opacity:\.58;filter:brightness\(\.78\)/, 'desktop listeners need to recede behind the active performer while remaining readable');
assert.match(cssSource, /\.character\[data-character="菩提"\]\.is-listening,\.character\[data-character="悟净"\]\.is-listening\{opacity:\.66;filter:brightness\(\.92\)/, 'dark-costumed listeners need extra residual light');
assert.match(cssSource, /\.character\[data-art-kind="portrait"\]\.is-listening\{opacity:\.52;filter:brightness\(\.74\)/, 'mobile portrait listeners need the same focus hierarchy');
assert.match(cssSource, /@media\(max-width:850px\)[\s\S]*?\.character\{--actor-viewport-scale:\.76\}/, 'mobile actor art needs a restrained fixed scale');
assert.match(cssSource, /@media\(max-width:430px\)[\s\S]*?\.character\{--actor-viewport-scale:\.72\}/, 'narrow phones need a smaller fixed actor scale');
assert.match(runtimeSource, /choiceTimeLimit = 10000/, 'choices must default to a ten-second response window');
assert.match(runtimeSource, /commitChoice\(-1, \{ optionOverride: timedSilenceOption/, 'choice timeout must produce an explicit silence decision');
assert.match(runtimeSource, /interlude\.addEventListener\('click', beginScene\)/, 'the full transition surface must advance on click');
assert.match(runtimeSource, /const endingVisuals = \{[\s\S]*defiance:[\s\S]*bond:[\s\S]*discipline:[\s\S]*insight:/, 'all four route endings need distinct visual treatments');
assert.match(runtimeSource, /data\.chapterData\.forEach\([\s\S]*chapter\.trials\.forEach/, 'the completion archive must render all nine chapters and all 81 trials');
assert.doesNotMatch(runtimeSource, /互动 \$\{gameResult\.grade/, 'the archive must not expose an unexplained raw letter grade');
assert.match(runtimeSource, /互动结果：\$\{gameGradeLabel\}（\$\{grade\}级）/, 'the archive must explain each interaction grade in Chinese');
assert.match(runtimeSource, /overrideClick\('#endingReview', \(\) => openJourneyArchive\(\{ reviewMode: true \}\)\)/, 'free review must open the visible 81-trial selector above the ending');
assert.match(fs.readFileSync('shadowplay-runtime.js', 'utf8'), /syncModalState\(\);\s*showStartMenu\(\);\s*\}\)\(\);\s*$/, 'startup must stop at the start menu instead of entering the story immediately');
const bgmFiles = [
  'assets/audio/bgm/title.mp3',
  'assets/audio/bgm/vol-01-huaguo.mp3',
  'assets/audio/bgm/vol-02-qitian.mp3',
  'assets/audio/bgm/vol-03-dongtu.mp3',
  'assets/audio/bgm/vol-04-gui-zheng.mp3',
  'assets/audio/bgm/vol-05-baigu.mp3',
  'assets/audio/bgm/vol-06-huoyun.mp3',
  'assets/audio/bgm/vol-07-tongtian.mp3',
  'assets/audio/bgm/vol-08-huoyan.mp3',
  'assets/audio/bgm/vol-09-lingshan.mp3',
  'assets/audio/bgm/battle.mp3'
];
bgmFiles.forEach(source => assert.ok(fs.existsSync(source), `background music is missing: ${source}`));
assert.equal(test.bgmTrackFor({ menu: true }), 'assets/audio/bgm/title.mp3', 'start menu must use the title theme');
assert.equal(test.bgmTrackFor({ menu: true, battle: true, chapter: 7 }), 'assets/audio/bgm/title.mp3', 'the start menu theme outranks battle and chapter cues');
assert.equal(test.bgmTrackFor({ battle: true, chapter: 3 }), 'assets/audio/bgm/battle.mp3', 'combat encounters must switch to the battle loop');
assert.equal(test.bgmTrackFor({ battle: false, chapter: 3 }), 'assets/audio/bgm/vol-04-gui-zheng.mp3', 'quizzes must keep the chapter theme instead of the battle loop');
assert.deepEqual([0, 1, 2, 3, 4, 5, 6, 7, 8].map(chapter => test.bgmTrackFor({ chapter })), bgmFiles.slice(1, 10), 'each volume needs its own looping chapter theme');
assert.equal(test.bgmTrackFor({ completed: true, chapter: 0 }), 'assets/audio/bgm/vol-09-lingshan.mp3', 'the ending keeps the Spirit Mountain theme');
assert.match(runtimeSource, /function syncBgm\(/, 'one helper must own background-music start, fade and mute');
assert.match(runtimeSource, /function showStartMenu\(\)[\s\S]*syncBgm\(/, 'opening the start menu must sync background music');
assert.match(runtimeSource, /function showInterlude\(\)[\s\S]*syncBgm\(/, 'chapter cards must sync the current volume theme');
assert.match(runtimeSource, /function startMiniGame\(\)[\s\S]*syncBgm\(/, 'opening an interaction must resync background music');
assert.match(runtimeSource, /combatOpen = miniOpen && \['battle', 'duel', 'catch'\]/, 'only combat interactions may switch to the battle loop');
assert.match(runtimeSource, /option\.play && canOpenSceneInteraction/, 'combat must wait for an explicit player choice');
assert.match(runtimeSource, /function toggleSound\([\s\S]*syncBgm\(/, 'one mute helper must control start-menu and in-game sound');
assert.match(runtimeSource, /overrideClick\('#mainMenuBtn', \(\) => \{\s*save\(\);/, 'returning to the start menu must persist the current line');
assert.match(runtimeSource, /musicVolume/, 'music volume must be part of the shared save');
assert.match(runtimeSource, /sfxVolume/, 'sound-effect volume must be part of the shared save');
assert.match(htmlSource, /id="startMusicVolume"/, 'the start menu needs a music volume slider');
assert.match(htmlSource, /id="pauseMusicVolume"/, 'the pause menu needs the same music volume slider');
assert.match(htmlSource, /id="startSeal"/, 'the title seal must be interactive');
assert.match(cssSource, /\.ktv-char\.is-sung\{color:#f4d56a/, 'spoken characters need karaoke highlighting');
assert.match(runtimeSource, /function isRevisitingScene\(\)/, 'reviewing a past trial needs an explicit revisit check');
assert.match(runtimeSource, /function startMiniGame\(\)[\s\S]*alreadyPlayed && !isRevisitingScene/, 'completed minigames must still open when the player is reviewing');
assert.match(runtimeSource, /replay: alreadyPlayed/, 'review replays must be marked so rewards are not granted twice');
assert.match(cssSource, /\.start-brand h1\{/, 'the start title must live in its own brand block');
assert.match(cssSource, /bottom:min\(36vh,268px\)/, 'mountain-prison art must sit above the dialogue box');
assert.notEqual(canonical.sceneArt['1:8']?.悟空, 'assets/characters/wukong-imprisoned.png', 'the palm wager must not show Wukong already crushed');
assert.notEqual(branch.periodArt['1:8']?.悟空, 'assets/characters/wukong-imprisoned.png', 'the palm wager period art must stay the standing Great Sage');
assert.equal(branch.periodArt['2:0']?.悟空, 'assets/characters/wukong-imprisoned.png', 'five hundred years under the mountain must use the crushed portrait');
assert.equal(branch.periodArt['3:1']?.悟空, 'assets/characters/wukong-imprisoned.png', 'the Two-Frontier rescue must still show Wukong under the mountain');
assert.match(cssSource, /\.battle-meter-track\{[^}]*height:12px/, 'battle health bars must stay thick enough to read at the top of the fight');
assert.match(cssSource, /\.battle-hud[^}]*z-index:4/, 'battle health bars must stay above the playfield instead of sliding under it');
assert.equal(test.actorFraming['assets/characters/wukong-imprisoned.png'].y, 0, 'Wukong under the mountain cannot be shifted off the visible stage');
assert.equal(test.actorFraming['assets/characters/tang/pilgrim/worried.png'].mode, 'half', 'pilgrim Xuanzang cannot use a close-up crop that fills the screen with his face');
assert.ok(test.actorFraming['assets/characters/wukong/mountain-prison-no-circlet/relieved.png'].scale <= 1.2, 'released-from-mountain Wukong must keep his head inside the frame');
test.state.chapter = 2;
test.state.trial = 0;
assert.ok(test.storyLines().filter(line => line.speaker === '悟空').length >= 2, 'the mountain-prison scene needs more than one spoken line');
test.state.trial = 1;
assert.ok(test.storyLines().some(line => line.speaker === '如来'), 'Tathagata must speak when he appears to send the scriptures east');
assert.ok(test.storyLines().some(line => line.speaker === '观音'), 'Guanyin must answer when she is present for the scripture decree');
test.state.chapter = 3;
test.state.trial = 2;
assert.ok(test.storyLines().some(line => line.speaker === '玄奘'), 'Xuanzang must speak after lifting the mountain seal');
test.state.chapter = 3;
test.state.trial = 5;
assert.ok(test.storyLines().filter(line => line.speaker === '金池').length >= 2, 'Jinchi must speak back and forth before the monastery choice');
assert.equal(test.storyLines().some(line => /袈裟已被|黑风山的黑熊精趁乱盗走/.test(line.text || '')), false, 'Guanyin monastery cannot resolve the stolen robe before the player chooses');
assert.equal(test.choicesForPosition(3, 5).some(option => option.play), false, 'the monastery quiz must not sit on top of the robe choice');
assert.equal(test.interactionGate(branch.miniGames['3:5']), 'off', 'unused quizzes must stay off the choice beat');
test.state.trial = 6;
assert.ok(test.storyLines().filter(line => line.speaker === '妖').length >= 2, 'the black bear must answer Wukong before any duel');
assert.equal(test.storyLines().some(line => /久战难胜|请观音相助/.test(line.text || '')), false, 'Black Wind Mountain cannot finish the bear before the player chooses');
assert.equal(test.choicesForPosition(3, 6).filter(option => option.play).map(option => option.id).join(','), 'fight-for-the-robe', 'only choosing to duel the bear may start the battle');
assert.equal(test.interactionGate(branch.miniGames['3:6']), 'choice', 'the black-bear battle must wait for a duel choice');
assert.equal(test.interactionGate(branch.miniGames['0:0']), 'off', 'story quizzes must not open on the choice screen');
assert.equal(branch.miniGames['0:0'].placement, 'story', 'kept lore tests sit in the middle of spoken scenes');
assert.equal(branch.miniGames['0:0'].rounds.length, 1, 'a quiz should ask only one question');
test.state.chapter = 0;
test.state.trial = 0;
assert.match(runtimeSource, /function closeMiniGame\([\s\S]*syncBgm\(/, 'leaving a minigame must restore the chapter theme');
assert.match(runtimeSource, /function finish\(\)[\s\S]*syncBgm\(/, 'the ending must keep or restore the closing theme');
assert.match(runtimeSource, /overrideClick\('#soundBtn', \(\) => toggleSound/, 'the pause mute switch must use the shared sound helper');
assert.match(runtimeSource, /overrideClick\('#startSound', \(\) => toggleSound/, 'the start-menu mute switch must use the shared sound helper');
assert.match(runtimeSource, /kind === 'whoosh' \|\| kind === 'page'/, 'transitions and dialogue need distinct movement/page sounds');
assert.match(runtimeSource, /kind === 'clack' \|\| kind === 'confirm'/, 'confirmation and impact sounds need distinct synthesis');
assert.match(runtimeSource, /createDelay\(0\.2\)/, 'pluck sound needs a Karplus-Strong delay');
assert.match(runtimeSource, /\[1, 1\.42, 1\.91, 2\.48, 3\.17\]/, 'gong needs multiple sine partials');
assert.match(runtimeSource, /createBufferSource\(\)/, 'drum and clapper need noise pulses');
assert.doesNotMatch(runtimeSource, /window\.confirm\(/, 'native confirmation cannot break the theatre presentation');
assert.match(runtimeSource, /function syncModalState\(\)/, 'modal focus and background isolation need one synchronized path');
assert.match(miniGameEngineSource, /const stopActivity = \(\) => \{[\s\S]*clearTimeout[\s\S]*cancelAnimationFrame[\s\S]*disposers\.forEach[\s\S]*keys\.clear\(\)/s, 'real-time interactions must cancel animation frames, timers and temporary listeners');
assert.match(runtimeSource, /function cleanupMiniGameActivity\(\) \{[\s\S]*miniGameSession\?\.destroy\?\.\(\)[\s\S]*cleanupLegacyMiniGameActivity\(\)/s, 'the runtime must destroy engine sessions before legacy cleanup');
assert.match(runtimeSource, /if \(miniGameState\.type === 'duel'\)[\s\S]*startBattleGame\(\)[\s\S]*startCatchGame\(\)/, 'the interaction runtime must dispatch every authored game type');
assert.match(runtimeSource, /const interludeCutoff = state\.completed \? currentSceneIndex\(\) : currentSceneIndex\(\) - 1/, 'interludes must not inherit future decisions while revisiting');
assert.doesNotMatch(runtimeSource, /kind:\s*'演出提示'|台词落下|人物不向前移动|立于幕(?:左|右|心|前)/u, 'runtime cannot generate screenplay directions');
assert.match(cssSource, /assets\/minigames\/duel-hands\.png/, 'duel and catch controls must use the painted Wukong/Erlang hand sheet');
assert.match(cssSource, /assets\/minigames\/peach-items\.png/, 'the peach game must use the painted falling-item sheet');
assert.match(`${cssSource}\n${miniGameCssSource}`, /@media\(prefers-reduced-motion:reduce\)[\s\S]*battle-fighter\.attacking[\s\S]*catch-arena\.hit/s, 'real-time interaction flourishes need a reduced-motion fallback');

const voiceSource = fs.readFileSync('voice-adapter.js', 'utf8');
assert.match(voiceSource, /input\.kind === '演出提示'/, 'stage directions must remain unvoiced');
assert.match(voiceSource, /requestController\?\.abort\(\)/, 'stopping voice must abort an unfinished external TTS request');
assert.match(voiceSource, /URL\.revokeObjectURL\(audioObjectUrl\)/, 'interrupted blob audio must release its object URL');
assert.match(voiceSource, /addEventListener\('pagehide', stop\)/, 'voice must stop when the page is discarded');
assert.match(voiceSource, /wait\(baked \? 20000 : 12000/, 'dialogue must wait for baked or live TTS before falling back to the browser');
assert.match(voiceSource, /let baked = resolver \? null : readCachedOutput\(key\)/, 'playback must reuse a preloaded baked clip instead of falling back to the browser');

const voiceCast = JSON.parse(fs.readFileSync('voice-cast.json', 'utf8')).characters;
const bakedManifest = JSON.parse(fs.readFileSync('assets/voice/manifest.json', 'utf8'));
const cleanVoiceText = text => String(text || '')
  .replace(/（[^（）]*）/g, ' ')
  .replace(/\([^()]*\)/g, ' ')
  .replace(/[“”「」『』]/g, '')
  .replace(/\s+/g, ' ')
  .trim();
let bakedLastLines = 0;
for (let chapter = 0; chapter < 9; chapter += 1) {
  for (let trial = 0; trial < 9; trial += 1) {
    const key = `${chapter}:${trial}`;
    test.state.chapter = chapter;
    test.state.trial = trial;
    test.state.pendingChoice = null;
    const lines = test.storyLines();
    const last = [...lines].reverse().find(line => test.voiceCue(line).enabled && test.voiceCue(line).text);
    assert.ok(last, `${key} needs a voiced last line`);
    assert.equal(last.kind, '转场字幕', `${key} must end on the authored closing narration, not a leftover character line`);
    const cue = test.voiceCue(last);
    const character = cue.narrator ? '旁白' : cue.character;
    const profile = voiceCast[character];
    assert.ok(profile, `${key} last line uses unknown voice profile ${character}`);
    const bakedKey = JSON.stringify([cleanVoiceText(cue.text), character, profile.voice, profile.rate, profile.pitch, profile.volume]);
    assert.ok(bakedManifest[bakedKey], `${key} last line must be pre-rendered: ${cleanVoiceText(cue.text).slice(0, 24)}`);
    bakedLastLines += 1;
  }
}
assert.equal(bakedLastLines, 81, 'all 81 scene closings must be baked');

const manifestSource = fs.readFileSync('ASSET_MANIFEST.md', 'utf8');
assert.doesNotMatch(manifestSource, /由舞台羽化遮罩接入/, 'asset documentation cannot claim portraits still use a CSS mask');

console.log(JSON.stringify({
  scenes: 81,
  playerScenes: playerSceneKeys.length,
  cutscenes: cutsceneKeys.length,
  options: optionTotal,
  silentOptions,
  screenplayStageDirections: 0,
  explicitSceneChoices: Object.keys(branch.sceneChoices).length,
  echoScenes: Object.keys(branch.branchEchoes).length,
  echoLines: Object.values(branch.branchEchoes).reduce((total, entries) => total + entries.length, 0),
  characterKeys: Object.keys(test.defaultArt).length,
  independentExtendedRoles: extendedRoles.length,
  routeEndings: [...endingTitles],
  fusionEndings: fusionTexts.size,
  endingFlagEchoes: endingFlagCases.length,
  miniGames: Object.keys(branch.miniGames).length,
  miniGameTypes: miniGameTypeCounts,
  lateMiniGames: lateMiniGames.length,
  lateMiniGameEchoes: lateMiniGameEchoes.length,
  playerDecisionActors: responseActorTotal,
  framedActorSources: usedActorSources.size,
  sourceCalibratedActorFraming: true,
  cutsceneSkipToNextDecision: true,
  galgameDialogueOverlap: true,
  focusedPerformerBrightnessRange: '1.12-1.20',
  instantFocusSwitch: true,
  mobileActorScale: '0.72-0.76',
  reinforcedBustAlpha: Object.fromEntries(Object.entries(reinforcedAlpha).map(([role, ratio]) => [role, `${(ratio * 100).toFixed(1)}%`])),
  actionSpriteSheets: Object.fromEntries(Object.entries(actionSheetAlpha).map(([source, cells]) => [source, cells.length])),
  relationshipLedger: true,
  chapterLightingGrades: 9,
  synthesizedSoundTypes: 7,
  timelineCutoff: true,
  customConfirmation: true,
  mobileTouchTargets: true,
  voiceCleanup: true,
  saveRecovery: true
}, null, 2));
