window.SpeakerConfig = {
  size: { width: 390, height: 640 },
  initialCoins: 160,
  initialLives: 10,
  tower: {
    cost: 70,
    upgradeBase: 55,
    levels: [
      { range: 92, damage: 28, rate: 0.68, color: "#21d4a2" },
      { range: 114, damage: 42, rate: 0.55, color: "#5fa8ff" },
      { range: 136, damage: 60, rate: 0.44, color: "#ffb703" }
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
    static: { hp: 48, speed: 82, reward: 18, damage: 1, radius: 15, color: "#ff5c75" },
    drone: { hp: 40, speed: 112, reward: 20, damage: 1, radius: 13, color: "#9b7cff" },
    crusher: { hp: 112, speed: 58, reward: 34, damage: 2, radius: 19, color: "#ff9f1c" }
  },
  waves: [
    {
      name: "Static Swarm",
      groups: [
        { type: "static", count: 6, gap: 0.62 },
        { type: "drone", count: 3, gap: 0.74 }
      ]
    },
    {
      name: "Notification Rush",
      groups: [
        { type: "drone", count: 7, gap: 0.58 },
        { type: "static", count: 6, gap: 0.62 }
      ]
    },
    {
      name: "Bass Breaker",
      groups: [
        { type: "static", count: 5, gap: 0.52 },
        { type: "crusher", count: 3, gap: 0.9 },
        { type: "drone", count: 6, gap: 0.5 }
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
