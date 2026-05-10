window.SpeakerAudio = (() => {
  let ctx;

  function ensure() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctx.state === "suspended") ctx.resume();
  }

  function tone(freq, duration, type = "sine", gain = 0.04) {
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const vol = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq * 0.72), now + duration);
    vol.gain.setValueAtTime(gain, now);
    vol.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(vol).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  function noise(duration, gain = 0.05) {
    if (!ctx) return;
    const frames = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i += 1) data[i] = Math.random() * 2 - 1;
    const source = ctx.createBufferSource();
    const vol = ctx.createGain();
    vol.gain.setValueAtTime(gain, ctx.currentTime);
    vol.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    source.buffer = buffer;
    source.connect(vol).connect(ctx.destination);
    source.start();
  }

  return {
    unlock: ensure,
    place() {
      ensure();
      tone(310, 0.12, "triangle", 0.045);
      tone(470, 0.14, "sine", 0.03);
    },
    upgrade() {
      ensure();
      tone(420, 0.1, "square", 0.035);
      setTimeout(() => tone(680, 0.12, "triangle", 0.04), 70);
    },
    hit() {
      tone(250, 0.06, "triangle", 0.025);
    },
    leak() {
      ensure();
      noise(0.16, 0.06);
      tone(90, 0.18, "sawtooth", 0.035);
    },
    win() {
      ensure();
      [440, 554, 659, 880].forEach((f, i) => setTimeout(() => tone(f, 0.16, "triangle", 0.045), i * 90));
    }
  };
})();
