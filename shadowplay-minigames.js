(() => {
  'use strict';

  const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, Number(value) || 0));
  const clampInteger = (value, minimum, maximum) => Math.trunc(clamp(value, minimum, maximum));
  const now = () => window.performance?.now?.() || Date.now();
  const duelMoves = Object.freeze({
    attack: Object.freeze({ seal: '攻', label: '直攻', detail: '压制变化' }),
    guard: Object.freeze({ seal: '架', label: '横架', detail: '截住攻势' }),
    trick: Object.freeze({ seal: '变', label: '变化', detail: '绕开守势' })
  });
  const duelBeats = Object.freeze({ attack: 'trick', guard: 'attack', trick: 'guard' });
  const gradeLabels = Object.freeze({ S: '无双', A: '上乘', B: '稳健', C: '过关', D: '未竟' });

  function miniGameType(game) {
    return ['quiz', 'duel', 'battle', 'catch'].includes(game?.type) ? game.type : 'quiz';
  }

  function scoreLimit(game) {
    if (!game) return 0;
    const type = miniGameType(game);
    if (type === 'battle') return Math.max(0, game.waves?.length || 0);
    if (type === 'catch') return Math.max(0, Number(game.targetScore) || 0);
    return Math.max(0, Number(game.roundCount) || game.rounds?.length || 0);
  }

  function passScore(game) {
    const limit = scoreLimit(game);
    const type = miniGameType(game);
    const fallback = type === 'quiz' ? Math.ceil(limit * 2 / 3)
      : type === 'duel' ? Math.ceil(limit / 2)
        : limit;
    return clampInteger(game?.passScore ?? fallback, 0, limit);
  }

  function gradeFor(rating) {
    const score = clampInteger(Math.round(Number(rating) || 0), 0, 100);
    if (score >= 90) return 'S';
    if (score >= 75) return 'A';
    if (score >= 60) return 'B';
    if (score >= 40) return 'C';
    return 'D';
  }

  function timeRating(metrics, game) {
    if (!metrics.completed) return 0;
    const parTime = Math.max(1, Number(game.parTime) || Number(game.duration) * 0.72 || 18);
    const timeLimit = Math.max(parTime + 1, Number(game.timeLimit) || Number(game.duration) || 45);
    const elapsed = Math.max(0, (Number(metrics.elapsedMs) || 0) / 1000);
    if (elapsed <= parTime) return 1;
    return clamp((timeLimit - elapsed) / (timeLimit - parTime), 0, 1);
  }

  function calculateRating(type, metrics = {}, game = {}) {
    if (type === 'battle') {
      const progress = clamp(metrics.enemyDamageRatio, 0, 1);
      const health = clamp((Number(metrics.remainingHealth) || 0) / Math.max(1, Number(metrics.maximumHealth) || Number(game.playerHealth) || 1), 0, 1);
      const counters = clamp((Number(metrics.preciseCounters) || 0) / 3, 0, 1);
      const hitControl = clamp(1 - (Number(metrics.hitsTaken) || 0) / 5, 0, 1);
      return Math.round((progress * 0.5 + health * 0.2 + counters * 0.15 + hitControl * 0.1 + timeRating(metrics, game) * 0.05) * 100);
    }
    if (type === 'catch') {
      const progress = clamp((Number(metrics.collected) || 0) / Math.max(1, Number(game.targetScore) || 1), 0, 1);
      const lives = clamp((Number(metrics.remainingLives) || 0) / Math.max(1, Number(game.lives) || 1), 0, 1);
      const combo = clamp((Number(metrics.maxCombo) || 0) / 5, 0, 1);
      const perfect = clamp((Number(metrics.perfectCatches) || 0) / Math.max(1, Number(metrics.collected) || 1), 0, 1);
      return Math.round((progress * 0.5 + lives * 0.15 + combo * 0.15 + perfect * 0.1 + timeRating(metrics, game) * 0.1) * 100);
    }
    if (type === 'duel') {
      const rounds = Math.max(1, Number(metrics.rounds) || scoreLimit(game) || 1);
      const wins = clamp((Number(metrics.wins) || 0) / rounds, 0, 1);
      const streak = clamp((Number(metrics.maxWinStreak) || 0) / 3, 0, 1);
      const draws = clamp((Number(metrics.draws) || 0) / rounds, 0, 1);
      return Math.round((wins * 0.7 + streak * 0.2 + draws * 0.1) * 100);
    }
    return Math.round(clamp((Number(metrics.correct) || 0) / Math.max(1, Number(metrics.rounds) || scoreLimit(game) || 1), 0, 1) * 100);
  }

  function buildResult(game, raw = {}) {
    const type = miniGameType(game);
    const maximum = scoreLimit(game);
    const score = clampInteger(raw.score, 0, maximum);
    const metrics = Object.freeze({ ...(raw.metrics || {}) });
    const rating = calculateRating(type, metrics, game);
    return Object.freeze({
      version: 2,
      type,
      score,
      maximum,
      passed: raw.passed === true || score >= passScore(game),
      rating,
      grade: gradeFor(rating),
      metrics,
      message: String(raw.message || '')
    });
  }

  function hashSeed(value) {
    let hash = 2166136261;
    const text = String(value || 'shadowplay');
    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function createRandom(seed) {
    let value = seed >>> 0;
    return () => {
      value += 0x6d2b79f5;
      let next = value;
      next = Math.imul(next ^ next >>> 15, next | 1);
      next ^= next + Math.imul(next ^ next >>> 7, next | 61);
      return ((next ^ next >>> 14) >>> 0) / 4294967296;
    };
  }

  function shuffled(values, random) {
    const result = [...values];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const target = Math.floor(random() * (index + 1));
      [result[index], result[target]] = [result[target], result[index]];
    }
    return result;
  }

  function orderDuelRounds(rounds, random) {
    const moves = Object.keys(duelMoves);
    const buckets = Object.fromEntries(moves.map(move => [move, shuffled(rounds.filter(round => round.opponent === move), random)]));
    const remaining = Object.fromEntries(moves.map(move => [move, buckets[move].length]));
    const sequence = [];
    const arrange = () => {
      if (sequence.length === rounds.length) return true;
      const previous = sequence.at(-1);
      const beforePrevious = sequence.at(-2);
      const candidates = shuffled(moves.filter(move => remaining[move] > 0 && !(move === previous && move === beforePrevious)), random)
        .sort((left, right) => remaining[right] - remaining[left]);
      for (const move of candidates) {
        sequence.push(move);
        remaining[move] -= 1;
        if (arrange()) return true;
        remaining[move] += 1;
        sequence.pop();
      }
      return false;
    };
    if (!arrange()) return shuffled(rounds, random);
    return sequence.map(move => buckets[move].pop());
  }

  function createDuelRounds(game, attempt = 0) {
    const source = Array.isArray(game?.roundPool) && game.roundPool.length ? game.roundPool : game?.rounds || [];
    const pool = source.map((round, index) => ({ ...round, sourceIndex: index }))
      .filter(round => duelMoves[round.opponent] && round.tell);
    const count = Math.min(pool.length, Math.max(1, Number(game?.roundCount) || 5));
    if (!count) return [];
    const random = createRandom(hashSeed(`${game.id || 'duel'}:${attempt}`));
    const selected = [];
    if (count >= 3) {
      Object.keys(duelMoves).forEach(move => {
        const candidates = pool.filter(round => round.opponent === move && !selected.some(candidate => candidate.sourceIndex === round.sourceIndex));
        if (candidates.length) selected.push(candidates[Math.floor(random() * candidates.length)]);
      });
    }
    shuffled(pool.filter(round => !selected.some(candidate => candidate.sourceIndex === round.sourceIndex)), random)
      .slice(0, Math.max(0, count - selected.length))
      .forEach(round => selected.push(round));
    const ordered = orderDuelRounds(selected.slice(0, count), random);
    return ordered.map(({ sourceIndex, ...round }) => Object.freeze(round));
  }

  function duelOutcome(playerMove, opponentMove) {
    if (playerMove === opponentMove) return 'draw';
    return duelBeats[playerMove] === opponentMove ? 'win' : 'loss';
  }

  function createNode(documentRef, tag, className = '', text = '') {
    const node = documentRef.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function mount({ game, root, sound = () => {}, reducedMotion = false, onComplete = () => {} }) {
    if (!game || !root?.querySelector) throw new Error('A mini-game configuration and root element are required.');
    const documentRef = root.ownerDocument || document;
    const nodes = {
      progress: root.querySelector('#miniGameProgress'),
      prompt: root.querySelector('#miniGamePrompt'),
      playfield: root.querySelector('#miniGamePlayfield'),
      options: root.querySelector('#miniGameOptions'),
      result: root.querySelector('#miniGameResult')
    };
    if (Object.values(nodes).some(node => !node)) throw new Error('The mini-game root is missing required elements.');

    let attempt = 0;
    let destroyed = false;
    let completed = false;
    let frame = null;
    let lastResult = null;
    let keys = new Set();
    const timers = new Set();
    let disposers = [];

    const play = kind => {
      try { sound(kind); } catch (error) {}
    };
    const schedule = (callback, delay) => {
      const timer = window.setTimeout(() => {
        timers.delete(timer);
        callback();
      }, delay);
      timers.add(timer);
      return timer;
    };
    const listen = (target, type, listener, options) => {
      target.addEventListener(type, listener, options);
      disposers.push(() => target.removeEventListener(type, listener, options));
    };
    const requestFrame = callback => {
      frame = window.requestAnimationFrame(callback);
      return frame;
    };
    const stopActivity = () => {
      timers.forEach(timer => window.clearTimeout(timer));
      timers.clear();
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = null;
      disposers.forEach(dispose => dispose());
      disposers = [];
      keys.clear();
    };
    const clearSurface = () => {
      nodes.playfield.replaceChildren();
      nodes.options.replaceChildren();
      nodes.options.hidden = false;
      nodes.playfield.hidden = false;
      delete nodes.options.dataset.layout;
      delete nodes.playfield.dataset.theme;
      nodes.result.textContent = '';
    };
    const finish = raw => {
      if (destroyed || completed) return;
      completed = true;
      stopActivity();
      lastResult = buildResult(game, raw);
      onComplete(lastResult);
    };

    function startQuiz() {
      const rounds = game.rounds || [];
      let roundIndex = 0;
      let score = 0;
      const startedAt = now();
      nodes.playfield.hidden = true;
      const render = () => {
        if (destroyed || completed) return;
        const round = rounds[roundIndex];
        if (!round) {
          finish({
            score,
            metrics: { correct: score, rounds: rounds.length, completed: true, elapsedMs: now() - startedAt },
            message: `答对 ${score} / ${rounds.length} 题。`
          });
          return;
        }
        nodes.progress.textContent = `互动 · ${roundIndex + 1} / ${rounds.length}`;
        nodes.prompt.textContent = round.prompt;
        nodes.result.textContent = '';
        nodes.options.hidden = false;
        nodes.options.replaceChildren();
        round.options.forEach((text, index) => {
          const button = createNode(documentRef, 'button', '', text);
          button.type = 'button';
          button.dataset.option = String(index);
          button.setAttribute('aria-keyshortcuts', String(index + 1));
          listen(button, 'click', () => {
            if (completed || button.disabled) return;
            const correct = index === round.answer;
            if (correct) score += 1;
            play(correct ? 'pluck' : 'drum');
            [...nodes.options.children].forEach((candidate, candidateIndex) => {
              candidate.disabled = true;
              candidate.classList.toggle('correct', candidateIndex === round.answer);
              candidate.classList.toggle('incorrect', candidateIndex === index && !correct);
            });
            const resultText = correct
              ? round.success || '判断正确，可以继续前进。'
              : round.failure || `这一步偏了，正确判断是“${round.options[round.answer]}”。`;
            nodes.result.textContent = resultText;
            schedule(() => {
              roundIndex += 1;
              render();
            }, Math.max(1050, Math.min(2050, 720 + resultText.length * 40)));
          });
          nodes.options.append(button);
        });
        window.requestAnimationFrame(() => nodes.options.querySelector('button')?.focus());
      };
      render();
    }

    function startDuel() {
      const rounds = createDuelRounds(game, attempt);
      let roundIndex = 0;
      let wins = 0;
      let draws = 0;
      let streak = 0;
      let maxWinStreak = 0;
      const outcomes = [];
      const startedAt = now();
      nodes.playfield.dataset.theme = 'duel';
      nodes.options.dataset.layout = 'duel';

      const render = () => {
        if (destroyed || completed) return;
        const round = rounds[roundIndex];
        if (!round) {
          finish({
            score: wins,
            metrics: { wins, draws, rounds: rounds.length, maxWinStreak, completed: true, elapsedMs: now() - startedAt },
            message: `五次斗法赢下 ${wins} 手，最长连胜 ${maxWinStreak} 手。`
          });
          return;
        }
        nodes.progress.textContent = `斗法 · ${roundIndex + 1} / ${rounds.length}`;
        nodes.prompt.textContent = game.prompt;
        nodes.result.textContent = '';
        nodes.playfield.replaceChildren();
        nodes.options.replaceChildren();

        const board = createNode(documentRef, 'div', 'duel-board');
        board.dataset.attempt = String(attempt + 1);
        const tally = createNode(documentRef, 'div', 'duel-tally');
        tally.setAttribute('aria-label', `已胜 ${wins} 手`);
        rounds.forEach((unused, index) => {
          const mark = createNode(documentRef, 'i', 'duel-mark');
          mark.dataset.outcome = outcomes[index] || 'pending';
          tally.append(mark);
        });
        const tell = createNode(documentRef, 'p', 'duel-tell', `预兆：${round.tell}`);
        const hands = createNode(documentRef, 'div', 'duel-hands');
        const playerSide = createNode(documentRef, 'div', 'duel-side duel-player');
        const playerHand = createNode(documentRef, 'i', 'duel-hand');
        playerHand.dataset.row = 'wukong';
        playerHand.dataset.move = 'waiting';
        playerHand.setAttribute('aria-hidden', 'true');
        playerSide.append(createNode(documentRef, 'strong', '', '孙悟空'), playerHand);
        const versus = createNode(documentRef, 'b', 'duel-versus');
        versus.append(createNode(documentRef, 'span', '', '斗'));
        const opponentSide = createNode(documentRef, 'div', 'duel-side duel-opponent');
        const opponentHand = createNode(documentRef, 'i', 'duel-hand');
        opponentHand.dataset.row = game.opponentRow || 'erlang';
        opponentHand.dataset.move = 'waiting';
        opponentHand.setAttribute('aria-hidden', 'true');
        opponentSide.append(createNode(documentRef, 'strong', '', game.opponentName), opponentHand);
        hands.append(playerSide, versus, opponentSide);
        board.append(tally, tell, hands);
        nodes.playfield.append(board);

        Object.entries(duelMoves).forEach(([move, meta], index) => {
          const button = createNode(documentRef, 'button', 'duel-move');
          button.type = 'button';
          button.dataset.move = move;
          button.dataset.option = String(index);
          button.setAttribute('aria-keyshortcuts', String(index + 1));
          button.append(createNode(documentRef, 'span', 'duel-move-seal', meta.seal), createNode(documentRef, 'b', '', meta.label), createNode(documentRef, 'small', '', meta.detail));
          listen(button, 'click', () => {
            if (completed || button.disabled) return;
            const outcome = duelOutcome(move, round.opponent);
            if (outcome === 'win') {
              wins += 1;
              streak += 1;
              maxWinStreak = Math.max(maxWinStreak, streak);
            } else {
              if (outcome === 'draw') draws += 1;
              streak = 0;
            }
            outcomes[roundIndex] = outcome;
            const currentMark = tally.children[roundIndex];
            if (currentMark) currentMark.dataset.outcome = outcome;
            tally.setAttribute('aria-label', `已胜 ${wins} 手，完成 ${roundIndex + 1} / ${rounds.length} 手`);
            playerHand.dataset.move = move;
            opponentHand.dataset.move = round.opponent;
            board.dataset.revealed = 'true';
            [...nodes.options.children].forEach(candidate => { candidate.disabled = true; });
            button.classList.add(outcome);
            const resultText = outcome === 'win'
              ? `${duelMoves[move].label}克住${duelMoves[round.opponent].label}，你赢下一手。`
              : outcome === 'loss'
                ? `${duelMoves[round.opponent].label}抢得先机，这一手落后。`
                : `两边同时使出${duelMoves[move].label}，这一手相持。`;
            nodes.result.textContent = resultText;
            play(outcome === 'win' ? 'pluck' : outcome === 'loss' ? 'drum' : 'clack');
            schedule(() => {
              roundIndex += 1;
              render();
            }, reducedMotion ? 720 : 1180);
          });
          nodes.options.append(button);
        });
        window.requestAnimationFrame(() => nodes.options.querySelector('button')?.focus());
      };
      render();
    }

    function meter(label, value, maximum) {
      const wrap = createNode(documentRef, 'div', 'battle-meter');
      wrap.append(createNode(documentRef, 'span', '', label));
      const track = createNode(documentRef, 'i', 'battle-meter-track');
      track.setAttribute('role', 'progressbar');
      track.setAttribute('aria-label', label);
      track.setAttribute('aria-valuemin', '0');
      track.setAttribute('aria-valuemax', String(maximum));
      wrap.append(track);
      updateMeter(track, value, maximum);
      return { wrap, track };
    }

    function updateMeter(track, value, maximum) {
      const safeValue = clamp(value, 0, Math.max(1, maximum));
      track.setAttribute('aria-valuenow', String(Math.round(safeValue)));
      track.style.setProperty('--meter-value', `${safeValue / Math.max(1, maximum) * 100}%`);
    }

    function bindHeldControl(button, key, keySet) {
      const activePointers = new Set();
      const press = event => {
        event.preventDefault();
        activePointers.add(event.pointerId);
        keySet.add(key);
        button.classList.add('pressed');
        button.setPointerCapture?.(event.pointerId);
      };
      const release = event => {
        event.preventDefault();
        activePointers.delete(event.pointerId);
        if (!activePointers.size) {
          keySet.delete(key);
          button.classList.remove('pressed');
        }
      };
      listen(button, 'pointerdown', press);
      listen(button, 'pointerup', release);
      listen(button, 'pointercancel', release);
      listen(button, 'lostpointercapture', release);
    }

    function startBattle() {
      const waves = game.waves || [];
      const timeLimit = Math.max(15, Number(game.timeLimit) || 45);
      const playerMaximum = Math.max(1, Number(game.playerHealth) || 100);
      const totalEnemyHealth = waves.reduce((total, wave) => total + Math.max(1, Number(wave.health) || 1), 0);
      const random = createRandom(hashSeed(`${game.id || 'battle'}:${attempt}`));
      clearSurface();
      nodes.playfield.dataset.theme = 'battle';
      nodes.options.hidden = true;
      nodes.progress.textContent = `战斗 · 1 / ${waves.length}`;

      const shell = createNode(documentRef, 'div', 'battle-shell');
      const hud = createNode(documentRef, 'div', 'battle-hud');
      const playerMeter = meter('悟空 · 气血', playerMaximum, playerMaximum);
      const centerHud = createNode(documentRef, 'div', 'battle-center-hud');
      const waveLabel = createNode(documentRef, 'strong', 'battle-wave-label', waves[0]?.name || '山门阵');
      const timeLabel = createNode(documentRef, 'span', 'battle-time', `${timeLimit} 秒`);
      centerHud.append(waveLabel, timeLabel);
      const enemyMeter = meter(`${waves[0]?.name || '对手'} · 气血`, waves[0]?.health || 1, waves[0]?.health || 1);
      hud.append(playerMeter.wrap, centerHud, enemyMeter.wrap);
      const scene = createNode(documentRef, 'div', 'battle-scene');
      scene.dataset.encounter = game.encounter || 'heaven';
      scene.style.backgroundImage = `linear-gradient(rgba(3,3,4,.12),rgba(3,3,4,.62)),url("${game.backdrop}")`;
      const weather = createNode(documentRef, 'i', 'battle-weather');
      const warning = createNode(documentRef, 'i', 'battle-warning');
      warning.setAttribute('aria-hidden', 'true');
      const hazardLayer = createNode(documentRef, 'div', 'battle-hazards');
      const projectileLayer = createNode(documentRef, 'div', 'battle-projectiles');
      const player = createNode(documentRef, 'div', 'battle-fighter battle-player');
      player.setAttribute('role', 'img');
      player.setAttribute('aria-label', '孙悟空');
      const playerMotion = createNode(documentRef, 'span', 'battle-fighter-motion');
      const playerImage = createNode(documentRef, 'img');
      playerImage.alt = '';
      playerMotion.append(playerImage);
      player.append(playerMotion);
      const enemy = createNode(documentRef, 'div', 'battle-fighter battle-enemy');
      enemy.setAttribute('role', 'img');
      const enemyMotion = createNode(documentRef, 'span', 'battle-fighter-motion');
      const enemyImage = createNode(documentRef, 'img');
      enemyImage.alt = '';
      enemyMotion.append(enemyImage);
      enemy.append(enemyMotion);
      const spark = createNode(documentRef, 'i', 'battle-spark');
      const assist = createNode(documentRef, 'p', 'battle-assist');
      const combo = createNode(documentRef, 'b', 'battle-combo');
      const status = createNode(documentRef, 'p', 'battle-status', '锣鼓压阵，悟空横棒守住山门。');
      scene.append(weather, warning, hazardLayer, projectileLayer, player, enemy, spark, assist, combo, status);

      const controls = createNode(documentRef, 'div', 'mini-touch-controls battle-controls');
      const left = createNode(documentRef, 'button', '', '←');
      left.type = 'button';
      left.setAttribute('aria-label', '向左移动');
      left.dataset.key = 'A / ←';
      const right = createNode(documentRef, 'button', '', '→');
      right.type = 'button';
      right.setAttribute('aria-label', '向右移动');
      right.dataset.key = 'D / →';
      const attack = createNode(documentRef, 'button', 'action battle-attack', '棒');
      attack.type = 'button';
      attack.setAttribute('aria-label', '短按轻击，长按蓄力');
      attack.dataset.key = 'J / Space';
      const dodge = createNode(documentRef, 'button', 'action battle-dodge', '闪');
      dodge.type = 'button';
      dodge.setAttribute('aria-label', '闪身躲避');
      dodge.dataset.key = 'K / Shift';
      controls.append(left, right, attack, dodge);
      shell.append(hud, scene, controls);
      nodes.playfield.append(shell);

      const battle = {
        startedAt: now(),
        lastFrame: 0,
        pausedAt: 0,
        pauseStarted: 0,
        playerX: 20,
        playerHealth: playerMaximum,
        playerMaximum,
        playerState: '',
        playerStateUntil: 0,
        enemyX: 80,
        enemyHealth: 1,
        enemyMaximum: 1,
        enemyState: '',
        enemyStateUntil: 0,
        waveIndex: 0,
        completedWaves: 0,
        damageDealt: 0,
        nextPatternAt: 0,
        patternIndex: 0,
        previousPattern: '',
        pendingPattern: null,
        activePattern: null,
        stunnedUntil: 0,
        attackReady: 0,
        dodgeReady: 0,
        invulnerableUntil: 0,
        chargeStarted: 0,
        projectiles: [],
        hitsTaken: 0,
        preciseCounters: 0,
        combo: 0,
        maxCombo: 0,
        lastComboAt: 0,
        assistTriggered: false,
        enemyDown: false,
        ended: false
      };
      keys = new Set();

      const frameSource = (frames, stateName, fallback) => {
        if (frames?.sheet) {
          const cell = frames.states?.[stateName] || frames.states?.idle || [0, 0];
          return {
            source: frames.sheet,
            columns: Math.max(1, Number(frames.columns) || 4),
            rows: Math.max(1, Number(frames.rows) || 2),
            column: Math.max(0, Number(cell[0]) || 0),
            row: Math.max(0, Number(cell[1]) || 0)
          };
        }
        return { source: frames?.[stateName] || frames?.idle || fallback };
      };
      const setFighterState = (element, image, frames, stateName, fallback) => {
        const frame = frameSource(frames, stateName, fallback);
        const source = frame.source;
        const usesSprite = Boolean(frame.columns);
        element.classList.toggle('uses-sprite', usesSprite);
        if (element.dataset.state === stateName && image.getAttribute('src') === source) return;
        element.dataset.state = stateName;
        if (usesSprite) {
          image.dataset.sprite = 'true';
          image.style.setProperty('--sprite-columns', String(frame.columns));
          image.style.setProperty('--sprite-rows', String(frame.rows));
          image.style.setProperty('--sprite-column', String(frame.column));
          image.style.setProperty('--sprite-row', String(frame.row));
          image.style.setProperty('--sprite-offset-x', `${-frame.column * 100 / frame.columns}%`);
          image.style.setProperty('--sprite-offset-y', `${-frame.row * 100 / frame.rows}%`);
        } else {
          element.classList.remove('uses-sprite');
          delete image.dataset.sprite;
          image.style.removeProperty('--sprite-columns');
          image.style.removeProperty('--sprite-rows');
          image.style.removeProperty('--sprite-column');
          image.style.removeProperty('--sprite-row');
          image.style.removeProperty('--sprite-offset-x');
          image.style.removeProperty('--sprite-offset-y');
        }
        image.onerror = () => {
          image.onerror = null;
          element.classList.remove('uses-sprite');
          delete image.dataset.sprite;
          image.removeAttribute('style');
          if (image.getAttribute('src') !== fallback) image.src = fallback;
        };
        if (source && image.getAttribute('src') !== source) image.src = source;
      };
      const setStatus = text => { status.textContent = text; };
      const setCombo = () => {
        combo.textContent = battle.combo >= 2 ? `${battle.combo} 连` : '';
        combo.classList.toggle('visible', battle.combo >= 2);
      };
      const burstSpark = position => {
        spark.style.left = `${position}%`;
        spark.classList.remove('burst');
        void spark.offsetWidth;
        spark.classList.add('burst');
      };
      const clearWarning = () => {
        warning.classList.remove('visible');
        delete warning.dataset.pattern;
        hazardLayer.replaceChildren();
        scene.classList.remove('black-wind');
      };
      const currentWave = () => waves[battle.waveIndex] || {};

      const showAssist = label => {
        assist.textContent = `助战：${label}`;
        assist.classList.add('visible');
        schedule(() => assist.classList.remove('visible'), reducedMotion ? 500 : 1050);
      };
      const maybeAssist = current => {
        if (battle.assistTriggered || !game.assist) return;
        const countersReady = !game.assist.triggerCounters || battle.preciseCounters >= game.assist.triggerCounters;
        const comboReady = !game.assist.triggerCombo || battle.maxCombo >= game.assist.triggerCombo;
        if (!countersReady || !comboReady) return;
        battle.assistTriggered = true;
        battle.stunnedUntil = Math.max(battle.stunnedUntil, current + (game.assist.duration || 900));
        showAssist(game.assist.label || '同伴封住退路');
        play('gong');
      };

      const loadWave = index => {
        const wave = waves[index];
        if (!wave) return;
        battle.waveIndex = index;
        battle.enemyX = 80;
        battle.enemyHealth = Math.max(1, Number(wave.health) || 1);
        battle.enemyMaximum = battle.enemyHealth;
        battle.enemyDown = false;
        battle.activePattern = null;
        battle.pendingPattern = null;
        battle.projectiles.forEach(projectile => projectile.node.remove());
        battle.projectiles = [];
        battle.nextPatternAt = now() + 780;
        battle.patternIndex = 0;
        clearWarning();
        enemy.className = 'battle-fighter battle-enemy';
        enemy.dataset.tone = wave.tone || game.encounter || 'heaven';
        enemy.setAttribute('aria-label', wave.name);
        setFighterState(enemy, enemyImage, wave.frames, 'idle', wave.art);
        setFighterState(player, playerImage, game.playerFrames, 'idle', game.playerArt);
        waveLabel.textContent = wave.name;
        enemyMeter.wrap.querySelector('span').textContent = `${wave.name} · 气血`;
        enemyMeter.track.setAttribute('aria-label', wave.name);
        enemyMeter.track.setAttribute('aria-valuemax', String(battle.enemyMaximum));
        updateMeter(enemyMeter.track, battle.enemyHealth, battle.enemyMaximum);
        nodes.progress.textContent = `战斗 · ${index + 1} / ${waves.length}`;
        setStatus(index ? `${wave.name}杀入战场，下一阵接上。` : '敌军逼近，悟空横棒守住山门。');
      };

      const finishBattle = (message, completedBattle = false) => {
        if (battle.ended && !completedBattle && battle.playerHealth > 0) return;
        battle.ended = true;
        controls.querySelectorAll('button').forEach(button => { button.disabled = true; });
        const elapsedMs = Math.max(0, now() - battle.startedAt - battle.pausedAt);
        finish({
          score: battle.completedWaves,
          passed: completedBattle,
          metrics: {
            completed: completedBattle,
            elapsedMs,
            remainingHealth: battle.playerHealth,
            maximumHealth: battle.playerMaximum,
            enemyDamageRatio: clamp(battle.damageDealt / Math.max(1, totalEnemyHealth), 0, 1),
            preciseCounters: battle.preciseCounters,
            hitsTaken: battle.hitsTaken,
            maxCombo: battle.maxCombo
          },
          message
        });
      };

      const finishWave = current => {
        if (battle.enemyDown) return;
        battle.enemyDown = true;
        battle.activePattern = null;
        battle.completedWaves = battle.waveIndex + 1;
        clearWarning();
        enemy.classList.add('defeated');
        setFighterState(enemy, enemyImage, currentWave().frames, 'defeated', currentWave().art);
        play('gong');
        if (battle.waveIndex + 1 >= waves.length) {
          battle.ended = true;
          setFighterState(player, playerImage, game.playerFrames, 'victory', game.playerArt);
          controls.querySelectorAll('button').forEach(button => { button.disabled = true; });
          setStatus('最后一阵退去，悟空收棒守住山门。');
          schedule(() => finishBattle(`击退 ${waves.length} 阵，精准反击 ${battle.preciseCounters} 次。`, true), reducedMotion ? 350 : 760);
        } else {
          setStatus(`${currentWave().name}退阵，锣点一转，下一阵将至。`);
          schedule(() => loadWave(battle.waveIndex + 1), reducedMotion ? 360 : 720);
        }
      };

      const damageEnemy = (amount, current) => {
        const before = battle.enemyHealth;
        battle.enemyHealth = Math.max(0, battle.enemyHealth - Math.max(0, amount));
        battle.damageDealt += before - battle.enemyHealth;
        if (before > battle.enemyHealth) play('impact');
        updateMeter(enemyMeter.track, battle.enemyHealth, battle.enemyMaximum);
        battle.enemyStateUntil = current + 220;
        setFighterState(enemy, enemyImage, currentWave().frames, 'hit', currentWave().art);
        enemy.classList.add('hit');
        schedule(() => enemy.classList.remove('hit'), reducedMotion ? 80 : 210);
        burstSpark((battle.playerX + battle.enemyX) / 2);
        if (battle.enemyHealth <= 0) finishWave(current);
      };

      const hitPlayer = (damage, message, current) => {
        if (battle.ended || current < battle.invulnerableUntil) return false;
        battle.playerHealth = Math.max(0, battle.playerHealth - Math.max(1, Number(damage) || 1));
        battle.hitsTaken += 1;
        battle.combo = 0;
        setCombo();
        battle.invulnerableUntil = current + 520;
        battle.playerStateUntil = current + 280;
        setFighterState(player, playerImage, game.playerFrames, 'hit', game.playerArt);
        player.classList.add('hit');
        schedule(() => player.classList.remove('hit'), reducedMotion ? 90 : 250);
        updateMeter(playerMeter.track, battle.playerHealth, battle.playerMaximum);
        setStatus(message);
        play('drum');
        if (battle.playerHealth <= 0) {
          battle.ended = true;
          setFighterState(player, playerImage, game.playerFrames, 'defeated', game.playerArt);
          schedule(() => finishBattle(`击退 ${battle.completedWaves} / ${waves.length} 阵，悟空暂且收棒。`), reducedMotion ? 300 : 650);
        }
        return true;
      };

      const clearPattern = (current, cooldown) => {
        battle.activePattern = null;
        battle.pendingPattern = null;
        battle.nextPatternAt = current + Math.max(320, Number(cooldown) || 720);
        clearWarning();
      };

      const patternLabel = pattern => pattern.name || ({ melee: '近身重击', projectile: '飞兵回旋', lane: '地面火路', charge: '冲阵', slam: '震地', feint: '虚实枪势' }[pattern.type] || '攻势');

      const beginPattern = (pattern, current) => {
        const telegraph = Math.max(260, Number(pattern.telegraph) || 620);
        const lanes = [17, 50, 83];
        const safeLane = pattern.type === 'lane' ? lanes[Math.floor(random() * lanes.length)] : null;
        battle.activePattern = {
          pattern,
          phase: 'telegraph',
          startedAt: current,
          executeAt: current + telegraph,
          lanes: pattern.type === 'lane' ? lanes : null,
          safeLane,
          burstIndex: 0,
          lane: safeLane,
          hit: false
        };
        warning.dataset.pattern = pattern.type;
        warning.style.left = `${pattern.type === 'lane' ? 50 : battle.enemyX}%`;
        warning.classList.add('visible');
        if (pattern.type === 'lane') {
          lanes.forEach(lane => {
            const laneNode = createNode(documentRef, 'i', 'battle-lane-warning');
            laneNode.style.left = `${lane}%`;
            laneNode.style.width = `${Number(pattern.width) || 22}%`;
            if (lane === safeLane) laneNode.dataset.safe = 'true';
            hazardLayer.append(laneNode);
          });
        }
        if (pattern.type === 'feint') scene.classList.add('black-wind');
        setFighterState(enemy, enemyImage, currentWave().frames, 'charge', currentWave().art);
        setStatus(pattern.type === 'lane'
          ? '三昧火先染红地面，只留一条未燃的火路。'
          : `${currentWave().name}蓄起“${patternLabel(pattern)}”，先看预兆再动。`);
        play('drum');
      };

      const spawnProjectile = (pattern, current) => {
        const node = createNode(documentRef, 'i', 'battle-projectile');
        node.dataset.kind = pattern.kind || 'weapon';
        projectileLayer.append(node);
        const direction = battle.playerX < battle.enemyX ? -1 : 1;
        battle.projectiles.push({
          node,
          x: battle.enemyX,
          vx: direction * Math.max(24, Number(pattern.speed) || 44),
          returning: pattern.returning === true,
          returned: false,
          damage: Math.max(1, Number(pattern.damage) || 14),
          nextHit: current
        });
        setStatus(pattern.returning ? '火轮掠过后仍会折返，不能只躲第一程。' : '飞兵离手，横移或闪身都能让开。');
      };

      const resolvePattern = (active, current) => {
        const pattern = active.pattern;
        const distance = Math.abs(battle.enemyX - battle.playerX);
        if (pattern.type === 'feint' && active.phase === 'telegraph') {
          active.phase = 'followup';
          active.executeAt = current + Math.max(180, Number(pattern.followup) || 300);
          warning.classList.remove('visible');
          setStatus('黑风中的第一记是假势，真正枪锋紧跟在后。');
          return;
        }
        if (pattern.type === 'charge' && active.phase === 'telegraph') {
          active.phase = 'dashing';
          active.direction = battle.playerX < battle.enemyX ? -1 : 1;
          active.endsAt = current + Math.max(380, Number(pattern.duration) || 720);
          warning.classList.remove('visible');
          setFighterState(enemy, enemyImage, currentWave().frames, 'attack', currentWave().art);
          setStatus('本相冲阵已经发动，引他撞向山壁。');
          return;
        }
        if (pattern.type === 'projectile') spawnProjectile(pattern, current);
        else if (pattern.type === 'lane') {
          const width = Number(pattern.width) || 22;
          const lanes = active.lanes || [active.lane];
          const lane = lanes[active.burstIndex] ?? active.lane;
          const safe = lane === active.safeLane;
          if (!safe && Math.abs(battle.playerX - lane) <= width / 2) {
            hitPlayer(pattern.damage, '三昧火沿地面卷来，悟空被热浪逼退。', current);
          } else {
            setStatus(safe ? '这一路未燃，正是落脚处。' : '火路烧过空处。');
          }
          active.burstIndex += 1;
          if (active.burstIndex < lanes.length) {
            active.phase = 'bursting';
            active.executeAt = current + Math.max(220, Number(pattern.burstGap) || 280);
            warning.style.left = `${lanes[active.burstIndex]}%`;
            return;
          }
          setStatus('三路火势过尽，红孩儿正在换气。');
        } else {
          const range = pattern.type === 'slam' ? Number(pattern.range) || 100 : Number(pattern.range) || 18;
          if (distance <= range) hitPlayer(pattern.damage, `${patternLabel(pattern)}落下，悟空受势后撤。`, current);
          else setStatus(`${patternLabel(pattern)}落空，正是还手的空当。`);
        }
        clearPattern(current, pattern.cooldown);
      };

      const updateActivePattern = (current, delta) => {
        const active = battle.activePattern;
        if (!active) return;
        if (active.phase === 'dashing') {
          battle.enemyX = clamp(battle.enemyX + active.direction * (Number(active.pattern.speed) || 105) * delta, 4, 96);
          if (!active.hit && Math.abs(battle.enemyX - battle.playerX) <= 9) {
            active.hit = hitPlayer(active.pattern.damage, '牛魔本相正面撞来，悟空被撞得后退。', current);
          }
          if (current >= active.endsAt || battle.enemyX <= 4 || battle.enemyX >= 96) {
            battle.stunnedUntil = current + Math.max(650, Number(active.pattern.stun) || 1050);
            setStatus('冲撞撞上山壁，牛魔王暂时无法还手。');
            clearPattern(current, active.pattern.cooldown || 950);
          }
          return;
        }
        if (current >= active.executeAt) resolvePattern(active, current);
      };

      const choosePattern = () => {
        const patterns = currentWave().patterns || game.patterns || [{ type: 'melee', name: '兵器重击', telegraph: 590, damage: currentWave().damage || 14, range: 18, interruptible: true }];
        if (!patterns.length) return null;
        let candidate = patterns[battle.patternIndex % patterns.length];
        battle.patternIndex += 1;
        if (patterns.length > 1 && candidate.type === battle.previousPattern && random() > 0.46) {
          candidate = patterns[battle.patternIndex % patterns.length];
          battle.patternIndex += 1;
        }
        battle.previousPattern = candidate.type;
        return candidate;
      };

      const performAttack = charged => {
        const current = now();
        if (battle.ended || battle.enemyDown || current < battle.attackReady) return;
        battle.attackReady = current + (charged ? 780 : 360);
        battle.playerStateUntil = current + (charged ? 390 : 210);
        setFighterState(player, playerImage, game.playerFrames, charged ? 'chargeAttack' : 'attack', game.playerArt);
        player.classList.toggle('charged', charged);
        player.classList.add('attacking');
        schedule(() => {
          player.classList.remove('attacking', 'charged');
        }, reducedMotion ? 90 : charged ? 380 : 200);
        play(charged ? 'gong' : 'strike');
        const distance = Math.abs(battle.enemyX - battle.playerX);
        const active = battle.activePattern;
        const precise = Boolean(active && active.phase !== 'dashing' && !(active.pattern.type === 'feint' && active.phase === 'telegraph') && active.pattern.interruptible !== false && active.executeAt - current >= 0 && active.executeAt - current <= 180);
        const range = charged ? 23 : 18;
        if (distance > range) {
          battle.combo = 0;
          setCombo();
          setStatus(charged ? '蓄力一棒扫过空处，重势也需要距离。' : '金箍棒扫过空处，须再近一些。');
          return;
        }
        if (current - battle.lastComboAt <= 1800) battle.combo += 1;
        else battle.combo = 1;
        battle.lastComboAt = current;
        battle.maxCombo = Math.max(battle.maxCombo, battle.combo);
        setCombo();
        let damage = Math.max(1, Number(game.attackPower) || 18) * (charged ? 1.8 : 1);
        if (precise) {
          battle.preciseCounters += 1;
          damage += 7;
          battle.stunnedUntil = current + 700;
          clearPattern(current, 760);
          setStatus('棒锋卡在落招前截断蓄势，精准反击！');
        } else setStatus(charged ? '蓄力棒势压下，对手被震开。' : '金箍棒命中，对手向后退开。');
        damageEnemy(damage, current);
        maybeAssist(current);
      };

      const beginCharge = event => {
        if (event) event.preventDefault();
        const current = now();
        if (battle.ended || current < battle.attackReady || battle.chargeStarted) return;
        battle.chargeStarted = current;
        if (event?.pointerId != null) attack.setPointerCapture?.(event.pointerId);
        attack.classList.add('pressed', 'charging');
        setFighterState(player, playerImage, game.playerFrames, 'charge', game.playerArt);
      };
      const releaseCharge = event => {
        if (event) event.preventDefault();
        if (!battle.chargeStarted) return;
        const held = now() - battle.chargeStarted;
        battle.chargeStarted = 0;
        attack.classList.remove('pressed', 'charging');
        performAttack(held >= 420);
      };
      const cancelCharge = event => {
        if (event) event.preventDefault();
        battle.chargeStarted = 0;
        attack.classList.remove('pressed', 'charging');
      };
      const dodgeAttack = event => {
        if (event) event.preventDefault();
        const current = now();
        if (battle.ended || current < battle.dodgeReady) return;
        battle.dodgeReady = current + 930;
        battle.invulnerableUntil = current + 430;
        const away = battle.enemyX >= battle.playerX ? -1 : 1;
        battle.playerX = clamp(battle.playerX + away * 13, 6, 94);
        battle.playerStateUntil = current + 330;
        dodge.style.setProperty('--cooldown', '1');
        schedule(() => dodge.style.setProperty('--cooldown', '0'), 930);
        setFighterState(player, playerImage, game.playerFrames, 'dodge', game.playerArt);
        player.classList.add('dodging');
        schedule(() => player.classList.remove('dodging'), reducedMotion ? 100 : 330);
        play('dodge');
        setStatus('身影一低，攻势从肩侧掠过。');
      };

      bindHeldControl(left, 'left', keys);
      bindHeldControl(right, 'right', keys);
      listen(attack, 'pointerdown', beginCharge);
      listen(attack, 'pointerup', releaseCharge);
      listen(attack, 'pointercancel', releaseCharge);
      listen(attack, 'lostpointercapture', releaseCharge);
      listen(dodge, 'click', dodgeAttack);
      listen(documentRef, 'keydown', event => {
        if (destroyed || completed) return;
        if (['ArrowLeft', 'a', 'A'].includes(event.key)) { event.preventDefault(); keys.add('left'); }
        if (['ArrowRight', 'd', 'D'].includes(event.key)) { event.preventDefault(); keys.add('right'); }
        if (!event.repeat && ['j', 'J'].includes(event.key) || !event.repeat && event.code === 'Space') { event.preventDefault(); beginCharge(); }
        if (!event.repeat && (event.key === 'k' || event.key === 'K' || event.key === 'Shift')) dodgeAttack(event);
      });
      listen(documentRef, 'keyup', event => {
        if (['ArrowLeft', 'a', 'A'].includes(event.key)) keys.delete('left');
        if (['ArrowRight', 'd', 'D'].includes(event.key)) keys.delete('right');
        if (['j', 'J'].includes(event.key) || event.code === 'Space') releaseCharge(event);
      });

      const pauseClock = () => {
        if (battle.pauseStarted || battle.ended) return;
        battle.pauseStarted = now();
        keys.clear();
        cancelCharge();
      };
      const resumeClock = () => {
        if (!battle.pauseStarted || battle.ended) return;
        const duration = now() - battle.pauseStarted;
        battle.pausedAt += duration;
        battle.nextPatternAt += duration;
        battle.stunnedUntil += duration;
        battle.invulnerableUntil += duration;
        battle.attackReady += duration;
        battle.dodgeReady += duration;
        battle.playerStateUntil += duration;
        battle.enemyStateUntil += duration;
        battle.lastComboAt += duration;
        if (battle.chargeStarted) battle.chargeStarted += duration;
        if (battle.activePattern) {
          battle.activePattern.executeAt += duration;
          if (battle.activePattern.endsAt) battle.activePattern.endsAt += duration;
        }
        battle.projectiles.forEach(projectile => {
          projectile.nextHit += duration;
        });
        battle.pauseStarted = 0;
        battle.lastFrame = now();
      };
      listen(window, 'blur', pauseClock);
      listen(window, 'focus', resumeClock);
      listen(documentRef, 'visibilitychange', () => documentRef.hidden ? pauseClock() : resumeClock());

      loadWave(0);
      const loop = timestamp => {
        if (destroyed || completed || battle.ended) return;
        const current = Number.isFinite(timestamp) ? timestamp : now();
        if (battle.pauseStarted) {
          requestFrame(loop);
          return;
        }
        const delta = battle.lastFrame ? Math.min(0.05, Math.max(0, (current - battle.lastFrame) / 1000)) : 0;
        battle.lastFrame = current;
        const direction = (keys.has('right') ? 1 : 0) - (keys.has('left') ? 1 : 0);
        const movementScale = battle.chargeStarted ? 0.38 : 1;
        battle.playerX = clamp(battle.playerX + direction * 33 * movementScale * delta, 6, 94);

        if (!battle.enemyDown && current >= battle.stunnedUntil) {
          updateActivePattern(current, delta);
          if (!battle.activePattern && current >= battle.nextPatternAt) {
            if (!battle.pendingPattern) battle.pendingPattern = choosePattern();
            const pattern = battle.pendingPattern;
            const distance = Math.abs(battle.enemyX - battle.playerX);
            if (pattern?.type === 'melee' && distance > (Number(pattern.range) || 18) - 2) {
              battle.enemyX += Math.sign(battle.playerX - battle.enemyX) * (Number(currentWave().speed) || 6.2) * delta;
            } else if (pattern) {
              battle.pendingPattern = null;
              beginPattern(pattern, current);
            }
          } else if (!battle.activePattern && Math.abs(battle.enemyX - battle.playerX) > 25) {
            battle.enemyX += Math.sign(battle.playerX - battle.enemyX) * (Number(currentWave().speed) || 5.6) * 0.55 * delta;
          }
        }

        battle.projectiles.slice().forEach(projectile => {
          projectile.x += projectile.vx * delta;
          projectile.node.style.left = `${projectile.x}%`;
          if (current >= projectile.nextHit && Math.abs(projectile.x - battle.playerX) <= 6) {
            if (hitPlayer(projectile.damage, '飞兵擦过悟空，悟空被迫后退。', current)) projectile.nextHit = current + 780;
          }
          if (projectile.returning && !projectile.returned && (projectile.x <= 3 || projectile.x >= 97)) {
            projectile.returned = true;
            projectile.vx *= -1;
            projectile.node.dataset.returning = 'true';
          } else if ((!projectile.returning || projectile.returned) && (projectile.x < -6 || projectile.x > 106)) {
            projectile.node.remove();
            battle.projectiles.splice(battle.projectiles.indexOf(projectile), 1);
          }
        });

        if (battle.playerStateUntil <= current && !battle.chargeStarted) {
          setFighterState(player, playerImage, game.playerFrames, direction ? 'move' : 'idle', game.playerArt);
        }
        if (battle.enemyStateUntil <= current && !battle.enemyDown) {
          const stateName = current < battle.stunnedUntil ? 'hit' : battle.activePattern ? battle.activePattern.phase === 'dashing' ? 'attack' : 'charge' : 'idle';
          setFighterState(enemy, enemyImage, currentWave().frames, stateName, currentWave().art);
        }
        const faceRight = battle.playerX <= battle.enemyX;
        player.style.setProperty('--fighter-facing', faceRight ? '1' : '-1');
        enemy.style.setProperty('--fighter-facing', faceRight ? '1' : '-1');
        player.style.left = `${battle.playerX}%`;
        enemy.style.left = `${battle.enemyX}%`;
        warning.style.left = warning.dataset.pattern === 'lane' ? warning.style.left : `${battle.enemyX}%`;
        attack.style.setProperty('--charge', battle.chargeStarted ? String(clamp((current - battle.chargeStarted) / 420, 0, 1)) : '0');
        const elapsed = Math.max(0, current - battle.startedAt - battle.pausedAt);
        const remaining = Math.max(0, Math.ceil(timeLimit - elapsed / 1000));
        timeLabel.textContent = `${remaining} 秒`;
        if (elapsed >= timeLimit * 1000) {
          finishBattle(`时限已到，击退 ${battle.completedWaves} / ${waves.length} 阵。`);
          return;
        }
        requestFrame(loop);
      };
      requestFrame(loop);
    }

    function startCatch() {
      const timeLimit = Math.max(10, Number(game.timeLimit) || Number(game.duration) || 24);
      const targetScore = Math.max(1, Number(game.targetScore) || 1);
      const maximumLives = Math.max(1, Number(game.lives) || 3);
      const random = createRandom(hashSeed(`${game.id || 'catch'}:${attempt}`));
      clearSurface();
      nodes.playfield.dataset.theme = 'catch';
      nodes.options.hidden = true;
      nodes.progress.textContent = game.theme === 'web' ? '身法 · 盘丝寻隙' : '身法 · 蟠桃落枝';

      const shell = createNode(documentRef, 'div', 'catch-shell');
      const hud = createNode(documentRef, 'div', 'catch-hud');
      const scoreLabel = createNode(documentRef, 'strong', '', `0 / ${targetScore}`);
      const comboLabel = createNode(documentRef, 'b', 'catch-combo', '连击 0');
      const livesLabel = createNode(documentRef, 'span', '', `护身 ${maximumLives}`);
      const timeLabel = createNode(documentRef, 'span', '', `${timeLimit} 秒`);
      hud.append(scoreLabel, comboLabel, livesLabel, timeLabel);
      const arena = createNode(documentRef, 'div', 'catch-arena');
      arena.dataset.theme = game.theme;
      arena.style.backgroundImage = `linear-gradient(rgba(3,3,4,.08),rgba(3,3,4,.58)),url("${game.backdrop || 'assets/backgrounds/peach-garden-stage.png'}")`;
      const path = createNode(documentRef, 'i', 'catch-path');
      const catcher = createNode(documentRef, 'i', 'catch-player');
      catcher.setAttribute('role', 'img');
      catcher.setAttribute('aria-label', '悟空接物的手');
      arena.append(path, catcher);
      const controls = createNode(documentRef, 'div', 'mini-touch-controls catch-controls');
      const left = createNode(documentRef, 'button', '', '←');
      left.type = 'button';
      left.setAttribute('aria-label', '向左移动');
      left.dataset.key = 'A / ←';
      const right = createNode(documentRef, 'button', '', '→');
      right.type = 'button';
      right.setAttribute('aria-label', '向右移动');
      right.dataset.key = 'D / →';
      controls.append(left, right);
      shell.append(hud, arena, controls);
      nodes.playfield.append(shell);

      const catchState = {
        startedAt: now(),
        lastFrame: now(),
        pausedAt: 0,
        pauseStarted: 0,
        nextSpawnAt: now() + 260,
        playerX: 50,
        score: 0,
        lives: maximumLives,
        items: [],
        dragging: false,
        combo: 0,
        maxCombo: 0,
        lastTargetAt: 0,
        perfectCatches: 0,
        hazards: 0,
        misses: 0,
        snaredUntil: 0,
        ended: false
      };
      keys = new Set();

      const setResult = text => { nodes.result.textContent = text; };
      const updateHud = () => {
        scoreLabel.textContent = `${catchState.score} / ${targetScore}`;
        comboLabel.textContent = `连击 ${catchState.combo}`;
        comboLabel.classList.toggle('active', catchState.combo >= 3);
        livesLabel.textContent = `护身 ${catchState.lives}`;
      };
      const removeItem = entry => {
        entry.node.remove();
        const index = catchState.items.indexOf(entry);
        if (index >= 0) catchState.items.splice(index, 1);
      };
      const finishCatch = (message, completedCatch = false) => {
        if (catchState.ended && !completedCatch) return;
        catchState.ended = true;
        controls.querySelectorAll('button').forEach(button => { button.disabled = true; });
        finish({
          score: catchState.score,
          passed: completedCatch,
          metrics: {
            completed: completedCatch,
            elapsedMs: Math.max(0, now() - catchState.startedAt - catchState.pausedAt),
            collected: catchState.score,
            remainingLives: catchState.lives,
            maxCombo: catchState.maxCombo,
            perfectCatches: catchState.perfectCatches,
            hazards: catchState.hazards,
            misses: catchState.misses
          },
          message
        });
      };
      const triggerPath = () => {
        path.classList.remove('open');
        void path.offsetWidth;
        path.classList.add('open');
        catchState.nextSpawnAt += 430;
        schedule(() => path.classList.remove('open'), reducedMotion ? 280 : 760);
        play('gong');
      };
      const collectItem = (entry, current) => {
        const target = entry.kind === 'ripe' || entry.kind === 'break';
        if (target) {
          const error = Math.abs(entry.x - catchState.playerX);
          const perfect = error <= 3.6;
          catchState.score = Math.min(targetScore, catchState.score + 1);
          catchState.combo = current - catchState.lastTargetAt <= (Number(game.comboWindow) || 2000) ? catchState.combo + 1 : 1;
          catchState.lastTargetAt = current;
          catchState.maxCombo = Math.max(catchState.maxCombo, catchState.combo);
          if (perfect) catchState.perfectCatches += 1;
          setResult(entry.kind === 'ripe'
            ? perfect ? '正中掌心，熟桃稳稳入手。' : '熟桃接住，枝叶没有受损。'
            : perfect ? '棒尖正中受力点，蛛网应声断开。' : '抓住一处破绽，白丝松开一层。');
          play('pluck');
          if (game.theme === 'web' && catchState.combo > 0 && catchState.combo % 3 === 0) triggerPath();
        } else if (entry.kind === 'green') {
          catchState.score = Math.max(0, catchState.score - 1);
          setResult('青桃尚未成熟，这一枚须放回枝头。');
          play('clack');
        } else {
          catchState.lives -= 1;
          catchState.hazards += 1;
          catchState.combo = 0;
          arena.classList.remove('hit');
          void arena.offsetWidth;
          arena.classList.add('hit');
          if (entry.kind === 'web') {
            catchState.snaredUntil = current + 1150;
            arena.classList.add('snared');
            schedule(() => arena.classList.remove('snared'), 1150);
          }
          setResult(entry.kind === 'token' ? '巡园天册撞落，护身减一。' : '蛛网收紧，悟空挣脱前身法受限。');
          play('drum');
        }
        removeItem(entry);
        updateHud();
        if (catchState.score >= targetScore) {
          finishCatch(game.theme === 'web'
            ? `${targetScore} 处破绽连成通路，最大连击 ${catchState.maxCombo}。`
            : `${targetScore} 枚熟桃稳稳入手，完美接取 ${catchState.perfectCatches} 枚。`, true);
        } else if (catchState.lives <= 0) {
          finishCatch(game.theme === 'web'
            ? `找到 ${catchState.score} / ${targetScore} 处破绽，蛛网先一步收紧。`
            : `接住 ${catchState.score} / ${targetScore} 枚熟桃，巡园天册已经惊动守卫。`);
        }
      };

      const spawnItem = () => {
        const chance = random();
        const weights = game.weights || (game.theme === 'web' ? { target: 0.68, soft: 0, hazard: 0.32 } : { target: 0.66, soft: 0.2, hazard: 0.14 });
        const kind = game.theme === 'web'
          ? chance < weights.target ? 'break' : 'web'
          : chance < weights.target ? 'ripe' : chance < weights.target + weights.soft ? 'green' : 'token';
        const item = createNode(documentRef, 'i', 'catch-item');
        item.dataset.kind = kind;
        if (kind === 'break') item.textContent = '破';
        if (kind === 'web') item.textContent = '网';
        item.setAttribute('role', 'img');
        item.setAttribute('aria-label', kind === 'ripe' ? '熟蟠桃' : kind === 'green' ? '青桃' : kind === 'token' ? '巡园天册' : kind === 'break' ? '蛛丝破绽' : '蛛网');
        const entry = { node: item, kind, x: 7 + random() * 86, y: -12, speed: 27 + random() * 9 + Math.min(8, catchState.combo) * 0.7 };
        item.style.left = `${entry.x}%`;
        item.style.top = `${entry.y}%`;
        arena.append(item);
        catchState.items.push(entry);
      };

      const updatePlayerFromPointer = event => {
        const bounds = arena.getBoundingClientRect();
        catchState.playerX = clamp((event.clientX - bounds.left) / Math.max(1, bounds.width) * 100, 6, 94);
      };
      listen(arena, 'pointerdown', event => {
        if (catchState.ended) return;
        catchState.dragging = true;
        arena.setPointerCapture?.(event.pointerId);
        updatePlayerFromPointer(event);
      });
      listen(arena, 'pointermove', event => {
        if (catchState.dragging) updatePlayerFromPointer(event);
      });
      const stopDrag = () => { catchState.dragging = false; };
      listen(arena, 'pointerup', stopDrag);
      listen(arena, 'pointercancel', stopDrag);
      bindHeldControl(left, 'left', keys);
      bindHeldControl(right, 'right', keys);
      listen(documentRef, 'keydown', event => {
        if (['ArrowLeft', 'a', 'A'].includes(event.key)) { event.preventDefault(); keys.add('left'); }
        if (['ArrowRight', 'd', 'D'].includes(event.key)) { event.preventDefault(); keys.add('right'); }
      });
      listen(documentRef, 'keyup', event => {
        if (['ArrowLeft', 'a', 'A'].includes(event.key)) keys.delete('left');
        if (['ArrowRight', 'd', 'D'].includes(event.key)) keys.delete('right');
      });

      const pauseClock = () => {
        if (catchState.pauseStarted || catchState.ended) return;
        catchState.pauseStarted = now();
        keys.clear();
      };
      const resumeClock = () => {
        if (!catchState.pauseStarted || catchState.ended) return;
        const duration = now() - catchState.pauseStarted;
        catchState.pausedAt += duration;
        catchState.nextSpawnAt += duration;
        catchState.snaredUntil += duration;
        catchState.lastTargetAt += duration;
        catchState.pauseStarted = 0;
        catchState.lastFrame = now();
      };
      listen(window, 'blur', pauseClock);
      listen(window, 'focus', resumeClock);
      listen(documentRef, 'visibilitychange', () => documentRef.hidden ? pauseClock() : resumeClock());

      const loop = timestamp => {
        if (destroyed || completed || catchState.ended) return;
        const current = Number.isFinite(timestamp) ? timestamp : now();
        if (catchState.pauseStarted) {
          requestFrame(loop);
          return;
        }
        const delta = Math.min(0.05, Math.max(0, (current - catchState.lastFrame) / 1000));
        catchState.lastFrame = current;
        if (catchState.combo && current - catchState.lastTargetAt > (Number(game.comboWindow) || 2000)) {
          catchState.combo = 0;
          updateHud();
        }
        const direction = (keys.has('right') ? 1 : 0) - (keys.has('left') ? 1 : 0);
        const snareScale = current < catchState.snaredUntil ? 0.42 : 1;
        catchState.playerX = clamp(catchState.playerX + direction * 46 * snareScale * delta, 6, 94);
        catcher.style.left = `${catchState.playerX}%`;
        while (current >= catchState.nextSpawnAt) {
          spawnItem();
          const comboPace = 1 - Math.min(8, catchState.combo) * 0.025;
          catchState.nextSpawnAt += (Number(game.spawnRate) || 720) * comboPace * (0.8 + random() * 0.36);
        }
        catchState.items.slice().forEach(entry => {
          if (catchState.ended) return;
          entry.y += entry.speed * delta;
          entry.node.style.top = `${entry.y}%`;
          if (entry.y >= 77 && entry.y <= 92 && Math.abs(entry.x - catchState.playerX) <= 9) collectItem(entry, current);
          else if (entry.y > 98) {
            if (entry.kind === 'ripe' || entry.kind === 'break') catchState.misses += 1;
            removeItem(entry);
          }
        });
        if (catchState.ended) return;
        const elapsed = Math.max(0, current - catchState.startedAt - catchState.pausedAt);
        timeLabel.textContent = `${Math.max(0, Math.ceil(timeLimit - elapsed / 1000))} 秒`;
        if (elapsed >= timeLimit * 1000) {
          finishCatch(`时限已到，完成 ${catchState.score} / ${targetScore}。`);
          return;
        }
        requestFrame(loop);
      };
      updateHud();
      requestFrame(loop);
    }

    function start() {
      stopActivity();
      completed = false;
      lastResult = null;
      clearSurface();
      const type = miniGameType(game);
      root.dataset.type = type;
      if (type === 'duel') startDuel();
      else if (type === 'battle') startBattle();
      else if (type === 'catch') startCatch();
      else startQuiz();
    }

    const session = Object.freeze({
      restart() {
        if (destroyed) return false;
        attempt += 1;
        play('drum');
        start();
        return true;
      },
      destroy() {
        if (destroyed) return;
        destroyed = true;
        stopActivity();
      },
      get result() { return lastResult; },
      get attempt() { return attempt; }
    });
    start();
    return session;
  }

  window.ShadowplayMinigames = Object.freeze({
    mount,
    miniGameType,
    scoreLimit,
    passScore,
    calculateRating,
    gradeFor,
    gradeLabels,
    buildResult,
    createDuelRounds,
    duelOutcome
  });
})();
