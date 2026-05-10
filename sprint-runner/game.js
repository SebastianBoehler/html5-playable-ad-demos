const playfield = document.querySelector("#playfield");
const runner = document.querySelector("#runner");
const feedbackLayer = document.querySelector("#feedbackLayer");
const startScreen = document.querySelector("#startScreen");
const endScreen = document.querySelector("#endScreen");
const startButton = document.querySelector("#startButton");
const restartButton = document.querySelector("#restartButton");
const claimButton = document.querySelector("#claimButton");
const scoreView = document.querySelector("#score");
const timerView = document.querySelector("#timer");
const summaryView = document.querySelector("#summary");
const ratingView = document.querySelector("#rating");
const offerStatus = document.querySelector("#offerStatus");

const GAME_SECONDS = 20;
const RUNNER_WIDTH = 58;
const RUNNER_HEIGHT = 92;
const SPAWN_MS = 640;
const patches = [
  { label: "REFL", name: "Reflective patch", color: "#17212b" },
  { label: "TURBO", name: "Turbo tag", color: "#f5a623" },
  { label: "CITY", name: "City badge", color: "#7c5cff" },
];

let running = false;
let score = 0;
let timeLeft = GAME_SECONDS;
let runnerX = 0;
let entities = [];
let collected = new Set();
let lastFrame = 0;
let lastSpawn = 0;
let startedAt = 0;
let frameId = 0;
let nextId = 1;

function startGame() {
  resetGame();
  running = true;
  startScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
  startedAt = performance.now();
  lastFrame = startedAt;
  lastSpawn = startedAt - SPAWN_MS;
  frameId = requestAnimationFrame(tick);
}

function resetGame() {
  cancelAnimationFrame(frameId);
  entities.forEach((entity) => entity.node.remove());
  entities = [];
  feedbackLayer.replaceChildren();
  collected = new Set();
  score = 0;
  timeLeft = GAME_SECONDS;
  running = false;
  nextId = 1;
  runnerX = (playfield.clientWidth - RUNNER_WIDTH) / 2;
  placeRunner();
  updateHud();
}

function tick(now) {
  if (!running) return;

  const dt = Math.min(34, now - lastFrame);
  lastFrame = now;
  timeLeft = Math.max(0, GAME_SECONDS - Math.floor((now - startedAt) / 1000));
  score += dt * 0.018;

  if (now - lastSpawn >= SPAWN_MS) {
    spawnEntity();
    lastSpawn = now;
  }

  moveEntities(dt);
  updateHud();

  if (timeLeft <= 0) {
    endGame();
    return;
  }

  frameId = requestAnimationFrame(tick);
}

function spawnEntity() {
  const laneWidth = playfield.clientWidth / 3;
  const lane = Math.floor(Math.random() * 3);
  const isPickup = Math.random() < 0.42;
  const patch = patches[Math.floor(Math.random() * patches.length)];
  const node = document.createElement("div");
  const size = isPickup ? 62 : 60;
  const x = lane * laneWidth + laneWidth / 2 - size / 2;
  const entity = {
    id: nextId++,
    kind: isPickup ? "pickup" : "obstacle",
    x,
    y: -70,
    w: size,
    h: isPickup ? 50 : 56,
    speed: 210 + score * 0.06,
    patch,
    node,
  };

  node.className = entity.kind;
  node.style.setProperty("--x", `${entity.x}px`);
  node.style.setProperty("--y", `${entity.y}px`);
  if (isPickup) {
    node.textContent = patch.label;
    node.style.setProperty("--patch-color", patch.color);
  }

  entities.push(entity);
  playfield.appendChild(node);
}

function moveEntities(dt) {
  const runnerBox = getRunnerBox();
  const limit = playfield.clientHeight + 80;

  entities = entities.filter((entity) => {
    entity.y += entity.speed * (dt / 1000);
    entity.node.style.setProperty("--y", `${entity.y}px`);

    if (overlaps(runnerBox, entity)) {
      handleCollision(entity);
      entity.node.remove();
      return false;
    }

    if (entity.y > limit) {
      entity.node.remove();
      return false;
    }

    return true;
  });
}

function handleCollision(entity) {
  if (entity.kind === "pickup") {
    score += 35;
    collected.add(entity.patch.name);
    showImpact("+35", entity, true);
    return;
  }

  score = Math.max(0, score - 45);
  showImpact("-45", entity, false);
  runner.classList.remove("hit");
  playfield.classList.remove("shake");
  scoreView.parentElement.classList.remove("score-hit");
  void playfield.offsetWidth;
  runner.classList.add("hit");
  playfield.classList.add("shake");
  scoreView.parentElement.classList.add("score-hit");
}

function steerFromClientX(clientX) {
  const rect = playfield.getBoundingClientRect();
  runnerX = clamp(clientX - rect.left - RUNNER_WIDTH / 2, 22, rect.width - RUNNER_WIDTH - 22);
  placeRunner();
}

function placeRunner() {
  const y = Math.max(250, playfield.clientHeight - RUNNER_HEIGHT - 28);
  runner.style.setProperty("--runner-x", `${runnerX}px`);
  runner.style.setProperty("--runner-y", `${y}px`);
}

function getRunnerBox() {
  const y = Math.max(250, playfield.clientHeight - RUNNER_HEIGHT - 28);
  return { x: runnerX + 8, y: y + 8, w: RUNNER_WIDTH - 16, h: RUNNER_HEIGHT - 14 };
}

function overlaps(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function endGame() {
  running = false;
  cancelAnimationFrame(frameId);
  entities.forEach((entity) => entity.node.remove());
  entities = [];
  const patchText = collected.size ? [...collected].join(", ") : "no patches collected";
  ratingView.textContent = getRating(score);
  summaryView.textContent = `${Math.round(score)}m run. Shoe perks tested: ${patchText}.`;
  offerStatus.textContent = "";
  claimButton.textContent = "Customize pair";
  claimButton.disabled = false;
  endScreen.classList.remove("hidden");
}

function getRating(value) {
  if (value < 180) return "Warm-up run";
  if (value < 320) return "Fast finish";
  return "Sprint ad pro";
}

function updateHud() {
  scoreView.textContent = String(Math.round(score));
  timerView.textContent = String(timeLeft);
}

function showImpact(text, entity, good) {
  const label = document.createElement("div");
  label.className = `impact-label${good ? " good" : ""}`;
  label.textContent = text;
  label.style.setProperty("--impact-x", `${entity.x + entity.w / 2}px`);
  label.style.setProperty("--impact-y", `${entity.y + entity.h / 2}px`);
  feedbackLayer.appendChild(label);
  setTimeout(() => label.remove(), 660);
}

function claimOffer() {
  try {
    sessionStorage.setItem("voltRunnerPatches", JSON.stringify([...collected]));
  } catch {
    // Some embedded file:// browsers block sessionStorage; navigation should still work.
  }
  window.location.href = new URL("../drag-customizer/index.html", window.location.href).href;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

playfield.addEventListener("pointerdown", (event) => {
  if (running) steerFromClientX(event.clientX);
});
playfield.addEventListener("pointermove", (event) => {
  if (running) steerFromClientX(event.clientX);
});
window.addEventListener("resize", placeRunner);
startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);
claimButton.addEventListener("click", claimOffer);
playfield.addEventListener("contextmenu", (event) => event.preventDefault());
resetGame();
