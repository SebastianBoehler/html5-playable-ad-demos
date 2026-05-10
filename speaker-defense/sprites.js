window.SpeakerSprites = (() => {
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();
  }

  function background(ctx, t, shake) {
    const g = ctx.createLinearGradient(0, 0, 0, 640);
    g.addColorStop(0, "#101a34");
    g.addColorStop(0.52, "#1b2d4d");
    g.addColorStop(1, "#302042");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 390, 640);

    ctx.save();
    ctx.translate(shake.x * 0.25, shake.y * 0.25);
    for (let i = 0; i < 9; i += 1) {
      const x = i * 54 - 18;
      const h = 64 + ((i * 23) % 50);
      ctx.fillStyle = i % 2 ? "#0b1328" : "#111d35";
      ctx.fillRect(x, 154 - h, 42, h);
      ctx.fillStyle = "rgba(255, 183, 3, 0.55)";
      for (let y = 126 - h; y < 140; y += 18) ctx.fillRect(x + 9, y, 6, 8);
    }
    ctx.restore();

    const floor = ctx.createLinearGradient(0, 186, 0, 640);
    floor.addColorStop(0, "#25334c");
    floor.addColorStop(1, "#111827");
    ctx.fillStyle = floor;
    ctx.fillRect(0, 176, 390, 464);
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    for (let y = 192 + (t * 10) % 22; y < 640; y += 22) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(390, y + 18);
      ctx.stroke();
    }
  }

  function path(ctx, points) {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(3, 7, 18, 0.58)";
    ctx.lineWidth = 54;
    trace(ctx, points);
    ctx.stroke();
    ctx.strokeStyle = "#45566f";
    ctx.lineWidth = 42;
    trace(ctx, points);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.setLineDash([18, 18]);
    ctx.lineWidth = 3;
    trace(ctx, points);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function trace(ctx, points) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (const p of points.slice(1)) ctx.lineTo(p.x, p.y);
  }

  function pad(ctx, pad, tower, affordable, pulse) {
    ctx.save();
    ctx.translate(pad.x, pad.y);
    ctx.fillStyle = tower ? "rgba(33, 212, 162, 0.16)" : affordable ? "rgba(255, 183, 3, 0.18)" : "rgba(255,255,255,0.07)";
    ctx.strokeStyle = tower ? "#21d4a2" : affordable ? "#ffb703" : "rgba(255,255,255,0.24)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 24 + pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.16)";
    ctx.fillRect(-15, -2, 30, 4);
    ctx.fillRect(-2, -15, 4, 30);
    ctx.restore();
  }

  function speaker(ctx, x, y, level, targetAngle) {
    const colors = ["#21d4a2", "#5fa8ff", "#ffb703"];
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(targetAngle || 0);
    ctx.fillStyle = "rgba(0,0,0,0.28)";
    ctx.beginPath();
    ctx.ellipse(0, 24, 25, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#e8eef7";
    roundRect(ctx, -16, -26, 32, 50, 8);
    ctx.fillStyle = "#111827";
    roundRect(ctx, -10, -20, 20, 38, 7);
    ctx.fillStyle = colors[level - 1];
    ctx.beginPath();
    ctx.arc(0, -8, 8 + level, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.58)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 11, 6 + level, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function enemy(ctx, e, t) {
    ctx.save();
    ctx.translate(e.x, e.y);
    const wobble = Math.sin(t * 7 + e.seed) * 2;
    ctx.fillStyle = "rgba(0,0,0,0.22)";
    ctx.beginPath();
    ctx.ellipse(0, e.radius + 5, e.radius, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = e.color;
    ctx.beginPath();
    if (e.type === "drone") {
      ctx.roundRect(-15, -9 + wobble, 30, 18, 8);
      ctx.fill();
      ctx.fillRect(-23, -3 + wobble, 46, 5);
    } else if (e.type === "crusher") {
      ctx.moveTo(0, -23 + wobble);
      ctx.lineTo(22, -4);
      ctx.lineTo(14, 20);
      ctx.lineTo(-14, 20);
      ctx.lineTo(-22, -4);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.arc(0, wobble, e.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.34)";
      ctx.fillRect(-3, -18 + wobble, 6, 36);
    }
    ctx.restore();
  }

  function projectile(ctx, p) {
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 4;
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 8 + Math.sin(p.life * 24) * 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function particle(ctx, p) {
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  return { background, path, pad, speaker, enemy, projectile, particle };
})();
