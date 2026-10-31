const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '..');
const elements = new Map();
function element(key = '') {
  if (elements.has(key)) return elements.get(key);
  const classes = new Set();
  const attributes = new Map();
  const node = {
    key, hidden: false, textContent: '', innerHTML: '', dataset: {},
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
        return Boolean(force);
      }
    },
    setAttribute: (name, value) => attributes.set(name, String(value)),
    getAttribute: name => attributes.get(name) || null,
    addEventListener() {}, replaceWith() {}, replaceChildren() {}, append() {},
    appendChild() {}, focus() {}, cloneNode() { return element(`${key}:clone`); },
    querySelector: selector => element(`${key} ${selector}`),
    querySelectorAll: () => [], closest: () => null, matches: () => false, remove() {},
    get offsetWidth() { return 100; }, get offsetParent() { return {}; }, get children() { return []; }
  };
  elements.set(key, node);
  return node;
}
const document = {
  querySelector: selector => element(selector),
  createElement: tag => element(`created:${tag}`),
  addEventListener() {},
  activeElement: element('active')
};
const window = {
  localStorage: { getItem: () => null, setItem() {} },
  setTimeout: () => 0, clearTimeout() {}, setInterval: () => 0, clearInterval() {},
  requestAnimationFrame: callback => { callback(); return 0; },
  confirm: () => true
};
const context = { window, document, localStorage: window.localStorage, requestAnimationFrame: window.requestAnimationFrame, setTimeout: window.setTimeout, clearTimeout: window.clearTimeout, setInterval: window.setInterval, clearInterval: window.clearInterval, console, Math, Object, Array, Number, String, Boolean, JSON, Map, Set };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, 'canonical-story.js'), 'utf8'), context);
vm.runInContext(fs.readFileSync(path.join(root, 'story-branches.js'), 'utf8'), context);
let runtimeSource = fs.readFileSync(path.join(root, 'shadowplay-runtime.js'), 'utf8');
const footer = '  window.__shadowplayState = state;\n  if (oldReset) window.reset = reset;\n  syncModalState();\n  showStartMenu();';
runtimeSource = runtimeSource.replace(footer, [
  '  window.__shadowplayState = state;',
  '  window.__runtimeTest = { state, storyLines, responseLines, voiceCue, choicesForPosition };',
  '  if (oldReset) window.reset = reset;',
  '  syncModalState();',
  '  showInterlude();'
].join('\n'));
vm.runInContext(runtimeSource, context);

const cast = JSON.parse(fs.readFileSync(path.join(root, 'voice-cast.json'), 'utf8')).characters;
const test = window.__runtimeTest;
const clean = text => String(text || '')
  .replace(/（[^（）]*）/g, ' ')
  .replace(/\([^()]*\)/g, ' ')
  .replace(/[“”「」『』]/g, '')
  .replace(/\s+/g, ' ')
  .trim();

const cues = new Map();
const add = line => {
  const cue = test.voiceCue(line);
  const text = clean(cue.text);
  if (!text || cue.enabled === false) return;
  const character = cue.narrator ? '旁白' : cue.character;
  const profile = cast[character];
  if (!profile) return;
  const key = JSON.stringify([text, character, profile.voice, profile.rate, profile.pitch, profile.volume]);
  const id = crypto.createHash('sha1').update(key).digest('hex').slice(0, 16);
  cues.set(id, { id, key, text, character, voice: profile.voice, rate: profile.rate, pitch: profile.pitch, volume: profile.volume });
};

const story = window.canonicalShadowplayData.chapterData;
story.forEach((chapter, chapterIndex) => {
  chapter.trials.forEach((_, trialIndex) => {
    test.state.chapter = chapterIndex;
    test.state.trial = trialIndex;
    test.state.pendingChoice = null;
    test.storyLines().forEach(add);
    const echoes = window.shadowplayBranchData?.branchEchoes?.[`${chapterIndex}:${trialIndex}`] || [];
    echoes.forEach(entry => add(entry.line));
    const choices = test.choicesForPosition(chapterIndex, trialIndex) || [];
    choices.forEach((choice, choiceIndex) => {
      test.state.pendingChoice = choiceIndex;
      test.responseLines().forEach(add);
    });
    test.state.pendingChoice = null;
  });
});

const list = [...cues.values()];
const out = path.join(root, 'scripts', 'voice-cues.json');
fs.writeFileSync(out, JSON.stringify(list, null, 2));
const chars = list.reduce((acc, cue) => (acc[cue.character] = (acc[cue.character] || 0) + 1, acc), {});
const charsCount = list.reduce((sum, cue) => sum + cue.text.length, 0);
console.log(JSON.stringify({ cues: list.length, characters: chars, chars: charsCount, estimateMb24k: Number(((charsCount / 4) * 0.003).toFixed(2)) }, null, 2));
