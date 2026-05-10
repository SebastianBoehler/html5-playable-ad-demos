window.SpeakerPath = {
  build(points) {
    let total = 0;
    const segments = [];
    for (let i = 0; i < points.length - 1; i += 1) {
      const a = points[i];
      const b = points[i + 1];
      const len = Math.hypot(b.x - a.x, b.y - a.y);
      segments.push({ a, b, len, start: total });
      total += len;
    }
    return { points, segments, total };
  },

  pointAt(path, distance) {
    const d = Math.min(distance, path.total);
    const seg = path.segments.find((s) => d <= s.start + s.len) || path.segments.at(-1);
    const n = Math.max(0, Math.min(1, (d - seg.start) / seg.len));
    return {
      x: seg.a.x + (seg.b.x - seg.a.x) * n,
      y: seg.a.y + (seg.b.y - seg.a.y) * n
    };
  }
};
