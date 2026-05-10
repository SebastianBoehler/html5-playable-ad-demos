(() => {
  const C = window.SpeakerConfig;
  const S = window.SpeakerSprites;
  const A = window.SpeakerAudio;
  const P = window.SpeakerPath;
  const canvas = document.querySelector("#gameCanvas");
  const ctx = canvas.getContext("2d");
  const ui = window.SpeakerUI(C);
  const buttons = ui.buttons;

  const renderer = window.SpeakerRender(ctx, C, S);
  const path = P.build(C.path);
  const state = {};
  let lastTime = 0;
  let view = { sx: 1, sy: 1 };

  function reset() {
    Object.assign(state, {
      mode: "start",
      coins: C.initialCoins,
      lives: C.initialLives,
      waveIndex: 0,
      spawnClock: 0,
      queue: [],
      enemies: [],
      towers: [],
      projectiles: [],
      particles: [],
      time: 0,
      shake: 0
    });
    ui.updateHud(state);
  }

  function startGame() {
    A.unlock();
    reset();
    state.mode = "playing";
    ui.showPlaying();
    startWave();
    ui.toast("Tap glowing pads to place speakers");
  }

  function startWave() {
    const wave = C.waves[state.waveIndex];
    let t = 1;
    state.queue = [];
    for (const group of wave.groups) {
      for (let i = 0; i < group.count; i += 1) {
        state.queue.push({ at: t, type: group.type });
        t += group.gap;
      }
      t += 0.8;
    }
    state.spawnClock = 0;
    ui.toast(wave.name);
    ui.updateHud(state);
  }

  function pointAt(distance) {
    return P.pointAt(path, distance);
  }

  function update(dt) {
    if (state.mode !== "playing") return;
    state.time += dt;
    state.shake = Math.max(0, state.shake - dt * 18);
    spawn(dt);
    updateEnemies(dt);
    updateTowers(dt);
    updateProjectiles(dt);
    updateParticles(dt);
    checkWaveDone();
  }

  function spawn(dt) {
    state.spawnClock += dt;
    while (state.queue[0] && state.queue[0].at <= state.spawnClock) {
      const item = state.queue.shift();
      const data = C.enemies[item.type];
      const p = pointAt(0);
      state.enemies.push({
        ...data,
        type: item.type,
        x: p.x,
        y: p.y,
        dist: 0,
        hp: data.hp,
        maxHp: data.hp,
        seed: Math.random() * 1000
      });
    }
  }

  function updateEnemies(dt) {
    for (const e of state.enemies) {
      e.dist += e.speed * dt;
      if (e.dist >= path.total) {
        e.dead = true;
        state.lives -= e.damage;
        state.shake = 1;
        A.leak();
        ui.toast(`Noise hit the party -${e.damage}`);
        ui.updateHud(state);
      } else {
        Object.assign(e, pointAt(e.dist));
      }
    }
    state.enemies = state.enemies.filter((e) => !e.dead);
    if (state.lives <= 0) finish(false);
  }

  function updateTowers(dt) {
    for (const tower of state.towers) {
      tower.cooldown -= dt;
      const stats = C.tower.levels[tower.level - 1];
      const target = bestTarget(tower, stats.range);
      if (target) tower.angle = Math.atan2(target.y - tower.y, target.x - tower.x);
      if (target && tower.cooldown <= 0) {
        tower.cooldown = stats.rate;
        state.projectiles.push({
          x: tower.x,
          y: tower.y - 12,
          target,
          damage: stats.damage,
          speed: 370,
          color: stats.color,
          life: 0
        });
      }
    }
  }

  function bestTarget(tower, range) {
    return state.enemies
      .filter((e) => Math.hypot(e.x - tower.x, e.y - tower.y) <= range)
      .sort((a, b) => b.dist - a.dist)[0];
  }

  function updateProjectiles(dt) {
    for (const p of state.projectiles) {
      p.life += dt;
      if (!p.target || p.target.dead) {
        p.dead = true;
        continue;
      }
      const dx = p.target.x - p.x;
      const dy = p.target.y - p.y;
      const dist = Math.hypot(dx, dy);
      const step = p.speed * dt;
      if (dist <= step + 8) {
        hitEnemy(p.target, p);
        p.dead = true;
      } else {
        p.x += (dx / dist) * step;
        p.y += (dy / dist) * step;
      }
    }
    state.projectiles = state.projectiles.filter((p) => !p.dead);
    state.enemies = state.enemies.filter((e) => !e.dead);
  }

  function hitEnemy(enemy, projectile) {
    enemy.hp -= projectile.damage;
    A.hit();
    burst(enemy.x, enemy.y, projectile.color, 8);
    if (enemy.hp <= 0) {
      enemy.dead = true;
      state.coins += enemy.reward;
      burst(enemy.x, enemy.y, enemy.color, 16);
      ui.updateHud(state);
    }
  }

  function burst(x, y, color, count) {
    for (let i = 0; i < count; i += 1) {
      const a = Math.random() * Math.PI * 2;
      const speed = 20 + Math.random() * 74;
      state.particles.push({
        x,
        y,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
        life: 0.7 + Math.random() * 0.25,
        size: 3 + Math.random() * 5,
        color
      });
    }
  }

  function updateParticles(dt) {
    for (const p of state.particles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 70 * dt;
      p.life -= dt;
    }
    state.particles = state.particles.filter((p) => p.life > 0);
  }

  function checkWaveDone() {
    if (state.queue.length || state.enemies.length || state.projectiles.length) return;
    if (state.waveIndex >= C.waves.length - 1) {
      finish(true);
    } else {
      state.waveIndex += 1;
      state.coins += 45;
      startWave();
    }
  }

  function finish(won) {
    if (state.mode !== "playing") return;
    state.mode = "end";
    if (won) A.win();
    ui.showEnd(won);
  }

  function tap(x, y) {
    if (state.mode !== "playing") return;
    const pad = C.pads.find((p) => Math.hypot(p.x - x, p.y - y) < 34);
    if (!pad) return;
    const tower = state.towers.find((t) => t.pad === pad.id);
    if (tower) return upgrade(tower);
    if (state.coins < C.tower.cost) return ui.toast("Need more coins");
    state.coins -= C.tower.cost;
    state.towers.push({ pad: pad.id, x: pad.x, y: pad.y, level: 1, cooldown: 0, angle: 0 });
    A.place();
    burst(pad.x, pad.y, "#21d4a2", 14);
    ui.toast("Speaker placed");
    ui.updateHud(state);
  }

  function upgrade(tower) {
    if (tower.level >= C.tower.levels.length) return ui.toast("Speaker maxed");
    const cost = C.tower.upgradeBase * tower.level;
    if (state.coins < cost) return ui.toast(`Upgrade needs ${cost} coins`);
    state.coins -= cost;
    tower.level += 1;
    tower.cooldown = 0;
    A.upgrade();
    burst(tower.x, tower.y, C.tower.levels[tower.level - 1].color, 20);
    ui.toast(`Upgraded to level ${tower.level}`);
    ui.updateHud(state);
  }

  function render() {
    renderer.draw(state, path, view);
    requestAnimationFrame(loop);
  }

  function loop(now) {
    const dt = Math.min(0.033, (now - lastTime) / 1000 || 0);
    lastTime = now;
    update(dt);
    render();
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    view = { sx: canvas.width / C.size.width, sy: canvas.height / C.size.height };
  }

  function pointerPos(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * C.size.width,
      y: ((event.clientY - rect.top) / rect.height) * C.size.height
    };
  }

  canvas.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    const p = pointerPos(event);
    tap(p.x, p.y);
  });
  buttons.start.addEventListener("click", startGame);
  buttons.restart.addEventListener("click", startGame);
  buttons.cta.addEventListener("click", () => {
    buttons.cta.textContent = "Offer saved";
    ui.toast("Prototype CTA captured");
  });
  window.addEventListener("resize", resize);

  reset();
  resize();
  requestAnimationFrame(loop);
})();
