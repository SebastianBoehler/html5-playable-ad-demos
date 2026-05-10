window.SpeakerRender = (ctx, C, S) => {
  function draw(state, path, view) {
    ctx.setTransform(view.sx, 0, 0, view.sy, 0, 0);
    ctx.clearRect(0, 0, C.size.width, C.size.height);
    const shake = state.shake
      ? {
          x: (Math.random() - 0.5) * 10 * state.shake,
          y: (Math.random() - 0.5) * 10 * state.shake
        }
      : { x: 0, y: 0 };

    ctx.save();
    ctx.translate(shake.x, shake.y);
    S.background(ctx, state.time || 0, shake);
    S.path(ctx, path.points);
    drawPartyBase();
    for (const pad of C.pads) {
      S.pad(
        ctx,
        pad,
        state.towers.find((t) => t.pad === pad.id),
        state.coins >= C.tower.cost,
        Math.sin((state.time || 0) * 5) * 2
      );
    }
    for (const tower of state.towers) S.speaker(ctx, tower.x, tower.y, tower.level, tower.angle);
    for (const p of state.projectiles) S.projectile(ctx, p);
    for (const e of state.enemies) {
      S.enemy(ctx, e, state.time || 0);
      drawHealth(e);
    }
    for (const p of state.particles) S.particle(ctx, p);
    ctx.restore();
  }

  function drawPartyBase() {
    ctx.fillStyle = "rgba(255, 183, 3, 0.18)";
    ctx.beginPath();
    ctx.arc(352, 470, 42, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffb703";
    ctx.font = "800 13px system-ui";
    ctx.fillText("PARTY", 330, 465);
    ctx.fillText("ZONE", 331, 481);
  }

  function drawHealth(e) {
    const w = 30;
    ctx.fillStyle = "rgba(0,0,0,0.42)";
    ctx.fillRect(e.x - w / 2, e.y - e.radius - 14, w, 4);
    ctx.fillStyle = "#21d4a2";
    ctx.fillRect(e.x - w / 2, e.y - e.radius - 14, w * Math.max(0, e.hp / e.maxHp), 4);
  }

  return { draw };
};
