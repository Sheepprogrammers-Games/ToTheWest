const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const minigameSource = fs.readFileSync('shadowplay-minigames.js', 'utf8');
const runtimeSource = fs.readFileSync('shadowplay-runtime.js', 'utf8');
assert.match(minigameSource, /pendingPattern/, 'melee approach must keep the chosen pattern');
assert.match(minigameSource, /setPointerCapture/, 'charge button must capture the pointer');
assert.doesNotMatch(minigameSource, /kind === 'green'[\s\S]{0,80}combo = 0/, 'green peaches must not reset combo');
assert.match(minigameSource, /currentMark = tally\.children\[roundIndex\][\s\S]*currentMark\.dataset\.outcome = outcome/, 'the fifth duel result must update its visible tally before completion');
assert.match(minigameSource, /element\.classList\.toggle\('uses-sprite', usesSprite\)/, 'battle fighters must explicitly mark sprite-sheet rendering');
const minigameCss = fs.readFileSync('shadowplay-minigames.css', 'utf8');
assert.match(minigameCss, /\.battle-fighter\.uses-sprite \.battle-fighter-motion\{inset:3% 6%;overflow:hidden\}/, 'battle sprite sheets must be clipped inward so neighboring weapons do not float into the frame');
assert.match(runtimeSource, /if \(isPlayerScene\(state\.chapter, state\.trial\)\) \{\s*enterChoices\(\{ skipInteraction: true \}\);/, 'skipping dialogue must reach the decision instead of forcing a combat encounter');
assert.match(runtimeSource, /shouldOfferStoryQuizAt\(state\.lineIndex\)/, 'lore tests must sit in the middle of a scene instead of beside choices');

class FakeTarget {
  constructor(counters) {
    this.counters = counters;
    this.listeners = new Map();
  }

  addEventListener(type, listener) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(listener);
    this.counters.added += 1;
  }

  removeEventListener(type, listener) {
    this.listeners.get(type)?.delete(listener);
    this.counters.removed += 1;
  }

  dispatch(type, details = {}) {
    const event = { type, preventDefault() {}, ...details };
    [...(this.listeners.get(type) || [])].forEach(listener => listener(event));
  }
}

class FakeNode extends FakeTarget {
  constructor(documentRef, tagName = 'div') {
    super(documentRef.counters);
    this.ownerDocument = documentRef;
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.parentNode = null;
    this.dataset = {};
    this.attributes = new Map();
    this.hidden = false;
    this.disabled = false;
    this.textContent = '';
    this.className = '';
    this.style = {
      values: new Map(),
      setProperty(name, value) { this.values.set(name, value); },
      removeProperty(name) { this.values.delete(name); }
    };
    const classes = new Set();
    this.classList = {
      add: (...names) => names.forEach(name => classes.add(name)),
      remove: (...names) => names.forEach(name => classes.delete(name)),
      toggle: (name, force) => {
        const enabled = force === undefined ? !classes.has(name) : Boolean(force);
        if (enabled) classes.add(name); else classes.delete(name);
        return enabled;
      },
      contains: name => classes.has(name)
    };
  }

  append(...children) {
    children.forEach(child => {
      child.parentNode = this;
      this.children.push(child);
    });
  }

  replaceChildren(...children) {
    this.children.forEach(child => { child.parentNode = null; });
    this.children = [];
    this.append(...children);
  }

  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  getAttribute(name) { return this.attributes.get(name) || null; }
  removeAttribute(name) { this.attributes.delete(name); }
  focus() {}
  setPointerCapture() {}

  remove() {
    if (!this.parentNode) return;
    this.parentNode.children = this.parentNode.children.filter(child => child !== this);
    this.parentNode = null;
  }

  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }

  querySelectorAll(selector) {
    const tag = selector.toUpperCase();
    const result = [];
    const visit = node => {
      node.children.forEach(child => {
        if (child.tagName === tag) result.push(child);
        visit(child);
      });
    };
    visit(this);
    return result;
  }
}

class FakeDocument extends FakeTarget {
  constructor(counters) {
    super(counters);
    this.counters = counters;
    this.hidden = false;
  }

  createElement(tagName) { return new FakeNode(this, tagName); }
}

const counters = { added: 0, removed: 0, nextTimer: 0, nextFrame: 0, clearedTimers: [], cancelledFrames: [] };
const document = new FakeDocument(counters);
const window = new FakeTarget(counters);
window.performance = { now: () => 1000 };
window.setTimeout = () => ++counters.nextTimer;
window.clearTimeout = timer => counters.clearedTimers.push(timer);
window.requestAnimationFrame = () => ++counters.nextFrame;
window.cancelAnimationFrame = frame => counters.cancelledFrames.push(frame);

vm.runInNewContext(fs.readFileSync('shadowplay-minigames.js', 'utf8'), {
  window,
  document,
  Date,
  Math,
  Object,
  Array,
  Number,
  String,
  Boolean,
  Set,
  Map
});

const engine = window.ShadowplayMinigames;
assert.ok(engine, 'the mini-game engine must register itself');

assert.equal(engine.gradeFor(100), 'S');
assert.equal(engine.gradeFor(90), 'S');
assert.equal(engine.gradeFor(89), 'A');
assert.equal(engine.gradeFor(75), 'A');
assert.equal(engine.gradeFor(74), 'B');
assert.equal(engine.gradeFor(60), 'B');
assert.equal(engine.gradeFor(59), 'C');
assert.equal(engine.gradeFor(40), 'C');
assert.equal(engine.gradeFor(39), 'D');
assert.equal(engine.gradeFor(-20), 'D');

const perfectBattle = engine.buildResult({
  type: 'battle',
  playerHealth: 100,
  parTime: 35,
  timeLimit: 45,
  waves: [{}, {}]
}, {
  score: 2,
  metrics: { completed: true, elapsedMs: 30000, enemyDamageRatio: 1, remainingHealth: 100, maximumHealth: 100, preciseCounters: 3, hitsTaken: 0 }
});
assert.deepEqual({ version: perfectBattle.version, rating: perfectBattle.rating, grade: perfectBattle.grade, passed: perfectBattle.passed }, { version: 2, rating: 100, grade: 'S', passed: true });
assert.ok(Object.isFrozen(perfectBattle) && Object.isFrozen(perfectBattle.metrics), 'version 2 results must be immutable save records');

const pool = ['attack', 'guard', 'trick'].flatMap(opponent => Array.from({ length: 3 }, (unused, index) => ({
  opponent,
  tell: `${opponent}-${index}`
})));
const duel = { id: 'regression-duel', type: 'duel', roundCount: 5, roundPool: pool };
const signatures = new Set();
for (let attempt = 0; attempt < 200; attempt += 1) {
  const first = engine.createDuelRounds(duel, attempt);
  const second = engine.createDuelRounds(duel, attempt);
  assert.deepEqual(first, second, `duel attempt ${attempt} must be deterministic`);
  assert.equal(first.length, 5);
  assert.deepEqual(new Set(first.map(round => round.opponent)), new Set(['attack', 'guard', 'trick']), `duel attempt ${attempt} must represent every move`);
  for (let index = 2; index < first.length; index += 1) {
    assert.ok(first[index].opponent !== first[index - 1].opponent || first[index].opponent !== first[index - 2].opponent, `duel attempt ${attempt} cannot contain three identical moves in succession`);
  }
  signatures.add(first.map(round => round.tell).join('|'));
}
assert.ok(signatures.size >= 20, 'restarts need meaningful deterministic clue variation');
assert.equal(engine.duelOutcome('attack', 'trick'), 'win');
assert.equal(engine.duelOutcome('guard', 'attack'), 'win');
assert.equal(engine.duelOutcome('trick', 'guard'), 'win');
assert.equal(engine.duelOutcome('attack', 'attack'), 'draw');

const requiredNodes = Object.fromEntries(['miniGameProgress', 'miniGamePrompt', 'miniGamePlayfield', 'miniGameOptions', 'miniGameResult']
  .map(id => [id, document.createElement('div')]));
const root = document.createElement('section');
root.querySelector = selector => selector.startsWith('#') ? requiredNodes[selector.slice(1)] || null : FakeNode.prototype.querySelector.call(root, selector);
const session = engine.mount({
  root,
  game: {
    id: 'cleanup-battle',
    type: 'battle',
    timeLimit: 45,
    backdrop: 'test.png',
    playerArt: 'player.png',
    playerHealth: 100,
    waves: [{ name: '测试对手', art: 'enemy.png', health: 10, patterns: [] }]
  }
});
const controls = requiredNodes.miniGamePlayfield.querySelectorAll('button');
assert.equal(controls.length, 4, 'battle must mount four touch controls');
controls[3].dispatch('click');
assert.ok(counters.nextTimer >= 2, 'battle interaction must schedule temporary effects');
assert.ok(counters.added > 0, 'battle interaction must install temporary listeners');
session.destroy();
assert.equal(counters.clearedTimers.length, counters.nextTimer, 'destroy must clear every active timeout');
assert.deepEqual(counters.cancelledFrames, [counters.nextFrame], 'destroy must cancel the active animation frame');
assert.equal(counters.removed, counters.added, 'destroy must remove every temporary listener');
assert.equal(session.restart(), false, 'a destroyed session cannot restart');

console.log(JSON.stringify({
  resultVersion: perfectBattle.version,
  gradeBoundaries: 'S/A/B/C/D',
  deterministicDuelAttempts: 200,
  distinctDuelOrders: signatures.size,
  cleanup: {
    timers: counters.clearedTimers.length,
    frames: counters.cancelledFrames.length,
    listeners: counters.removed
  }
}, null, 2));
