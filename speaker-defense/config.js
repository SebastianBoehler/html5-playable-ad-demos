window.SpeakerConfig = {
  size: { width: 390, height: 640 },
  initialCoins: 160,
  initialLives: 10,
  tower: {
    cost: 70,
    upgradeBase: 55,
    levels: [
      { range: 88, damage: 22, rate: 0.82, color: "#21d4a2" },
      { range: 108, damage: 34, rate: 0.68, color: "#5fa8ff" },
      { range: 130, damage: 48, rate: 0.54, color: "#ffb703" }
    ]
  },
  path: [
    { x: -26, y: 134 },
    { x: 104, y: 134 },
    { x: 104, y: 294 },
    { x: 260, y: 294 },
    { x: 260, y: 470 },
    { x: 418, y: 470 }
  ],
  pads: [
    { id: "a", x: 68, y: 218 },
    { id: "b", x: 174, y: 118 },
    { id: "c", x: 199, y: 379 },
    { id: "d", x: 316, y: 245 },
    { id: "e", x: 330, y: 548 }
  ],
  enemies: {
    static: { hp: 58, speed: 48, reward: 18, damage: 1, radius: 15, color: "#ff5c75" },
    drone: { hp: 42, speed: 72, reward: 20, damage: 1, radius: 13, color: "#9b7cff" },
    crusher: { hp: 130, speed: 34, reward: 34, damage: 2, radius: 19, color: "#ff9f1c" }
  },
  waves: [
    {
      name: "Static Swarm",
      groups: [
        { type: "static", count: 6, gap: 0.86 },
        { type: "drone", count: 3, gap: 1.02 }
      ]
    },
    {
      name: "Notification Rush",
      groups: [
        { type: "drone", count: 7, gap: 0.72 },
        { type: "static", count: 6, gap: 0.76 }
      ]
    },
    {
      name: "Bass Breaker",
      groups: [
        { type: "static", count: 5, gap: 0.66 },
        { type: "crusher", count: 3, gap: 1.12 },
        { type: "drone", count: 6, gap: 0.62 }
      ]
    }
  ],
  copy: {
    winTitle: "Party saved",
    winBody: "Your SoundCore Nova kit held the rooftop. Unlock the bass pack and build the setup.",
    loseTitle: "Noise broke through",
    loseBody: "Upgrade earlier and layer speakers near corners to keep the party alive.",
    cta: "Build speaker kit"
  }
};
