const playfield = document.querySelector("#playfield");
const orderName = document.querySelector("#orderName");
const nextTarget = document.querySelector("#nextTarget");
const recipeView = document.querySelector("#recipe");
const timerView = document.querySelector("#timer");
const quality = document.querySelector(".quality");
const qualityFill = document.querySelector("#qualityFill");
const dropLayer = document.querySelector("#dropLayer");
const splashLayer = document.querySelector("#splashLayer");
const cup = document.querySelector("#cup");
const cupText = document.querySelector("#cupText");
const startScreen = document.querySelector("#startScreen");
const endScreen = document.querySelector("#endScreen");
const startButton = document.querySelector("#startButton");
const restartButton = document.querySelector("#restartButton");
const claimButton = document.querySelector("#claimButton");
const rating = document.querySelector("#rating");
const summary = document.querySelector("#summary");

const GAME_SECONDS = 25;
const drops = [
  { id: "ice", label: "ICE", color: "#7fb7d8" },
  { id: "brew", label: "BREW", color: "#523b2a" },
  { id: "milk", label: "MILK", color: "#b7d8cc" },
  { id: "vanilla", label: "VAN", color: "#c99a4a" },
];
const decoy = { id: "decoy", label: "BAD", color: "#d14b4b", decoy: true };
const orders = [
  { name: "Iced Vanilla", recipe: ["ice", "brew", "milk", "vanilla"] },
  { name: "Classic Cold Brew", recipe: ["ice", "brew", "brew"] },
  { name: "Creamy Draft", recipe: ["brew", "milk", "ice"] },
];

let running = false;
let qualityScore = 100;
let served = 0;
let timeLeft = GAME_SECONDS;
let cupX = 210;
let activeDrops = [];
let order = orders[0];
let step = 0;
let lastFrame = 0;
let lastSpawn = 0;
let startedAt = 0;
let frameId = 0;
let audioContext = null;

function startGame() {
  ensureAudio();
  resetGame();
  running = true;
  startScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
  startedAt = performance.now();
  lastFrame = startedAt;
  frameId = requestAnimationFrame(tick);
}

function resetGame() {
  cancelAnimationFrame(frameId);
  activeDrops.forEach((drop) => drop.node.remove());
  activeDrops = [];
  splashLayer.replaceChildren();
  running = false;
  qualityScore = 100;
  served = 0;
  step = 0;
  timeLeft = GAME_SECONDS;
  cupX = playfield.clientWidth / 2;
  nextOrder();
  updateCup();
  updateUi();
}

function tick(now) {
  if (!running) return;

  const dt = Math.min(34, now - lastFrame);
  lastFrame = now;
  timeLeft = Math.max(0, GAME_SECONDS - Math.floor((now - startedAt) / 1000));

  if (now - lastSpawn > 520) {
    spawnDrop();
    lastSpawn = now;
  }

  moveDrops(dt);
  updateUi();

  if (timeLeft <= 0 || qualityScore <= 0) {
    endGame();
    return;
  }

  frameId = requestAnimationFrame(tick);
}

function spawnDrop() {
  const item = chooseDrop();
  const node = document.createElement("div");
  const x = 32 + Math.random() * (playfield.clientWidth - 90);
  const drop = { ...item, x, y: -70, speed: 160 + served * 8, node };

  node.className = `drop ${item.target ? "target" : "decoy"}`;
  node.innerHTML = `<span>${item.label}</span>`;
  node.style.setProperty("--drop-color", item.color);
  node.style.setProperty("--x", `${x}px`);
  node.style.setProperty("--y", `${drop.y}px`);
  activeDrops.push(drop);
  dropLayer.appendChild(node);
}

function moveDrops(dt) {
  const catchY = playfield.clientHeight - 132;
  let clearForNextStep = false;

  activeDrops = activeDrops.filter((drop) => {
    drop.y += drop.speed * (dt / 1000);
    drop.node.style.setProperty("--y", `${drop.y}px`);

    if (drop.y > catchY && Math.abs(drop.x + 29 - cupX) < 60) {
      clearForNextStep = catchDrop(drop) || clearForNextStep;
      drop.node.remove();
      return false;
    }

    if (drop.y > playfield.clientHeight) {
      drop.node.remove();
      return false;
    }

    return true;
  });

  if (clearForNextStep) clearActiveDrops();
}

function catchDrop(drop) {
  const target = getTargetDrop();
  const correct = drop.target === true && target && drop.id === target.id;
  showSplash(correct ? "GOOD +1" : "BAD -20", drop.x + 29, drop.y, correct);
  cup.classList.remove("hit", "bad");
  playfield.classList.remove("good-hit", "bad-hit");
  quality.classList.remove("bad");
  void cup.offsetWidth;
  cup.classList.add(correct ? "hit" : "bad");
  playfield.classList.add(correct ? "good-hit" : "bad-hit");

  if (!correct) {
    qualityScore = Math.max(0, qualityScore - 20);
    quality.classList.add("bad");
    playTone(120, 0.16, "sawtooth", 0.12);
    return false;
  }

  playTone(660, 0.09, "sine", 0.08);
  step += 1;
  if (step === order.recipe.length) {
    served += 1;
    qualityScore = Math.min(100, qualityScore + 8);
    showSplash("ORDER!", drop.x + 29, drop.y - 34, true, "order");
    playfield.classList.add("order-complete");
    setTimeout(() => playfield.classList.remove("order-complete"), 540);
    playTone(880, 0.08, "triangle", 0.08);
    nextOrder();
  }

  updateUi();
  return true;
}

function nextOrder() {
  order = orders[Math.floor(Math.random() * orders.length)];
  step = 0;
  orderName.textContent = order.name;
  renderRecipe();
  updateNextTarget();
}

function renderRecipe() {
  recipeView.replaceChildren();
  order.recipe.forEach((id, index) => {
    const item = drops.find((drop) => drop.id === id);
    const node = document.createElement("span");
    node.className = index < step ? "done" : index === step ? "next" : "";
    node.textContent = item.label;
    node.style.setProperty("--chip-color", item.color);
    recipeView.appendChild(node);
  });
}

function steer(clientX) {
  const rect = playfield.getBoundingClientRect();
  cupX = Math.min(rect.width - 58, Math.max(58, clientX - rect.left));
  updateCup();
}

function updateCup() {
  cup.style.setProperty("--cup-x", `${cupX}px`);
}

function updateUi() {
  timerView.textContent = String(timeLeft);
  cupText.textContent = String(served);
  qualityFill.style.setProperty("--quality", `${qualityScore}%`);
  updateNextTarget();
  renderRecipe();
}

function updateNextTarget() {
  const item = getTargetDrop();
  nextTarget.textContent = item ? item.label : "DONE";
}

function clearActiveDrops() {
  activeDrops.forEach((drop) => drop.node.remove());
  activeDrops = [];
}

function showSplash(text, x, y, good, extraClass = "") {
  const node = document.createElement("div");
  node.className = `splash${good ? " good" : ""}${extraClass ? ` ${extraClass}` : ""}`;
  node.textContent = text;
  node.style.setProperty("--splash-x", `${x}px`);
  node.style.setProperty("--splash-y", `${y}px`);
  splashLayer.appendChild(node);
  setTimeout(() => node.remove(), 680);
}

function chooseDrop() {
  if (Math.random() < 0.58) return { ...getTargetDrop(), target: true };
  return decoy;
}

function getTargetDrop() {
  return drops.find((drop) => drop.id === order.recipe[step]);
}

function ensureAudio() {
  if (!audioContext) audioContext = new AudioContext();
  if (audioContext.state === "suspended") audioContext.resume();
}

function playTone(frequency, duration, type, gainValue) {
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(gainValue, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
}

function endGame() {
  running = false;
  cancelAnimationFrame(frameId);
  rating.textContent = served < 3 ? "Cafe trainee" : served < 7 ? "Good service" : "Rush hour pro";
  summary.textContent = `${served} drinks served at ${qualityScore}% quality. Claim a demo starter pack.`;
  endScreen.classList.remove("hidden");
}

function claimOffer() {
  claimButton.textContent = "Pack claimed";
  claimButton.disabled = true;
}

playfield.addEventListener("pointerdown", (event) => {
  if (!running) return;
  playfield.setPointerCapture(event.pointerId);
  steer(event.clientX);
});
playfield.addEventListener("pointermove", (event) => {
  if (running) steer(event.clientX);
});
startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);
claimButton.addEventListener("click", claimOffer);
resetGame();
