const playfield = document.querySelector("#playfield");
const face = document.querySelector("#face");
const spotLayer = document.querySelector("#spotLayer");
const creamLayer = document.querySelector("#creamLayer");
const tool = document.querySelector("#tool");
const phaseText = document.querySelector("#phaseText");
const timerView = document.querySelector("#timer");
const progressLabel = document.querySelector("#progressLabel");
const progressValue = document.querySelector("#progressValue");
const meterFill = document.querySelector("#meterFill");
const prompt = document.querySelector("#prompt");
const startScreen = document.querySelector("#startScreen");
const endScreen = document.querySelector("#endScreen");
const startButton = document.querySelector("#startButton");
const restartButton = document.querySelector("#restartButton");
const claimButton = document.querySelector("#claimButton");
const rating = document.querySelector("#rating");
const summary = document.querySelector("#summary");

const GAME_SECONDS = 25;
const spotPositions = [[29, 28], [50, 23], [69, 34], [36, 52], [63, 56], [44, 73], [73, 73], [24, 67]];
let phase = "clean";
let spots = [];
let creamCells = new Set();
let timeLeft = GAME_SECONDS;
let running = false;
let startedAt = 0;
let timerId = 0;

function startGame() {
  resetGame();
  running = true;
  startScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
  startedAt = performance.now();
  timerId = window.setInterval(updateTimer, 120);
}

function resetGame() {
  window.clearInterval(timerId);
  phase = "clean";
  creamCells = new Set();
  timeLeft = GAME_SECONDS;
  running = false;
  claimButton.disabled = false;
  claimButton.textContent = "Get cream kit";
  tool.className = "tool";
  tool.style.opacity = "0";
  creamLayer.replaceChildren();
  buildSoap();
  updateUi();
}

function buildSoap() {
  spotLayer.replaceChildren();
  spots = spotPositions.map(([x, y], index) => {
    const node = document.createElement("span");
    node.className = "soap-spot";
    node.style.left = `${x}%`;
    node.style.top = `${y}%`;
    spotLayer.appendChild(node);
    return { id: index, x, y, node, cleaned: false };
  });
}

function handleDrag(event) {
  if (!running) return;

  moveTool(event.clientX, event.clientY);
  const local = getFacePoint(event.clientX, event.clientY);
  if (!local) return;

  if (phase === "clean") {
    cleanSoap(local);
  } else {
    applyCream(local);
  }

  updateUi();
}

function cleanSoap(point) {
  spots.forEach((spot) => {
    if (spot.cleaned) return;
    const distance = Math.hypot(point.x - spot.x, point.y - spot.y);
    if (distance < 13) {
      spot.cleaned = true;
      spot.node.remove();
    }
  });

  if (spots.every((spot) => spot.cleaned)) {
    phase = "cream";
    tool.classList.add("cream");
    prompt.textContent = "Now apply cream over the face until coverage reaches 85%.";
  }
}

function applyCream(point) {
  const key = `${Math.floor(point.x / 8)}-${Math.floor(point.y / 8)}`;
  if (creamCells.has(key)) return;

  creamCells.add(key);
  const dot = document.createElement("span");
  dot.className = "cream-dot";
  dot.style.left = `${point.x}%`;
  dot.style.top = `${point.y}%`;
  creamLayer.appendChild(dot);

  if (getCoverage() >= 85) endGame();
}

function getFacePoint(clientX, clientY) {
  const rect = face.getBoundingClientRect();
  const x = ((clientX - rect.left) / rect.width) * 100;
  const y = ((clientY - rect.top) / rect.height) * 100;
  if (Math.hypot(x - 50, y - 50) > 48) return null;
  return { x, y };
}

function moveTool(x, y) {
  tool.style.opacity = "1";
  tool.style.left = `${x}px`;
  tool.style.top = `${y}px`;
}

function updateTimer() {
  timeLeft = Math.max(0, GAME_SECONDS - Math.floor((performance.now() - startedAt) / 1000));
  updateUi();
  if (timeLeft <= 0) endGame();
}

function updateUi() {
  timerView.textContent = String(timeLeft);
  phaseText.textContent = phase === "clean" ? "Cleanse" : "Cream";
  if (phase === "clean") {
    const left = spots.filter((spot) => !spot.cleaned).length;
    progressLabel.textContent = "Soap left";
    progressValue.textContent = String(left);
    meterFill.style.setProperty("--meter", `${((spots.length - left) / spots.length) * 100}%`);
    return;
  }

  progressLabel.textContent = "Cream coverage";
  progressValue.textContent = `${getCoverage()}%`;
  meterFill.style.setProperty("--meter", `${getCoverage()}%`);
}

function getCoverage() {
  return Math.min(100, Math.round((creamCells.size / 54) * 100));
}

function endGame() {
  running = false;
  window.clearInterval(timerId);
  tool.style.opacity = "0";
  const coverage = getCoverage();
  rating.textContent = coverage >= 85 ? "Glow restored" : "Almost glowing";
  summary.textContent = `${coverage}% cream coverage. Glow Lab cream kit is ready.`;
  endScreen.classList.remove("hidden");
}

function claimOffer() {
  claimButton.textContent = "Kit saved";
  claimButton.disabled = true;
}

playfield.addEventListener("pointerdown", (event) => {
  if (!running) return;
  playfield.setPointerCapture(event.pointerId);
  handleDrag(event);
});
playfield.addEventListener("pointermove", handleDrag);
playfield.addEventListener("pointerup", () => { tool.style.opacity = "0"; });
startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);
claimButton.addEventListener("click", claimOffer);
resetGame();
