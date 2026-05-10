const product = document.querySelector("#product");
const productStage = document.querySelector("#productStage");
const stickerLayer = document.querySelector("#stickerLayer");
const colorPalette = document.querySelector("#colorPalette");
const stickerPalette = document.querySelector("#stickerPalette");
const startScreen = document.querySelector("#startScreen");
const endScreen = document.querySelector("#endScreen");
const startButton = document.querySelector("#startButton");
const finishButton = document.querySelector("#finishButton");
const shopButton = document.querySelector("#shopButton");
const againButton = document.querySelector("#againButton");
const summary = document.querySelector("#summary");
const cartStatus = document.querySelector("#cartStatus");
const unlockNote = document.querySelector("#unlockNote");

const colors = [
  { name: "Volt green", shortName: "Green", value: "#18b883" },
  { name: "Launch blue", shortName: "Blue", value: "#246bfe" },
  { name: "Coral red", shortName: "Coral", value: "#ef4d5f" },
];

const stickers = [
  { name: "Reflective patch", label: "REFL", color: "#17212b" },
  { name: "Turbo tag", label: "TURBO", color: "#f5a623" },
  { name: "City badge", label: "CITY", color: "#7c5cff" },
];

let selectedColor = colors[0];
let placedStickers = [];
let dragState = null;

function buildPalettes() {
  colors.forEach((color) => {
    const button = document.createElement("button");
    button.className = "color-option";
    button.type = "button";
    button.dataset.color = color.name;
    button.innerHTML = `<span class="swatch" style="--swatch: ${color.value}"></span><span>${color.shortName}</span>`;
    button.addEventListener("click", () => selectColor(color));
    colorPalette.appendChild(button);
  });

  stickers.forEach((sticker) => {
    const button = document.createElement("button");
    button.className = "sticker-option";
    button.type = "button";
    button.textContent = sticker.label;
    button.dataset.name = sticker.name;
    button.style.setProperty("--sticker-bg", sticker.color);
    button.addEventListener("pointerdown", (event) => beginDrag(event, sticker));
    stickerPalette.appendChild(button);
  });

  syncColorButtons();
  showSprintUnlocks();
}

function selectColor(color) {
  selectedColor = color;
  product.style.setProperty("--product-color", color.value);
  syncColorButtons();
}

function syncColorButtons() {
  document.querySelectorAll(".color-option").forEach((button) => {
    button.classList.toggle("active", button.dataset.color === selectedColor.name);
  });
}

function beginDrag(event, sticker) {
  event.preventDefault();
  const ghost = document.createElement("div");
  ghost.className = "drag-ghost";
  ghost.textContent = sticker.label;
  ghost.style.setProperty("--sticker-bg", sticker.color);
  document.body.appendChild(ghost);

  dragState = { sticker, ghost };
  moveGhost(event.clientX, event.clientY);
  // Pointer capture keeps the drag stable even if the finger leaves the source button.
  event.currentTarget.setPointerCapture(event.pointerId);
}

function moveGhost(x, y) {
  if (!dragState) return;
  dragState.ghost.style.left = `${x}px`;
  dragState.ghost.style.top = `${y}px`;
}

function finishDrag(event) {
  if (!dragState) return;

  const rect = product.getBoundingClientRect();
  const inside =
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom;

  if (inside) {
    addSticker(dragState.sticker, event.clientX - rect.left, event.clientY - rect.top, rect);
  }

  dragState.ghost.remove();
  dragState = null;
}

function addSticker(sticker, localX, localY, rect) {
  const node = document.createElement("div");
  // Store positions as percentages so placed stickers survive responsive resizing.
  const xPercent = clamp((localX / rect.width) * 100, 12, 88);
  const yPercent = clamp((localY / rect.height) * 100, 18, 82);

  node.className = "placed-sticker";
  node.textContent = sticker.label;
  node.style.left = `${xPercent}%`;
  node.style.top = `${yPercent}%`;
  node.style.setProperty("--sticker-bg", sticker.color);
  stickerLayer.appendChild(node);

  placedStickers.push({ name: sticker.name, label: sticker.label, xPercent, yPercent });
}

function finishCustomization() {
  const stickerNames = placedStickers.map((item) => item.name);
  const detail = stickerNames.length ? stickerNames.join(", ") : "no stickers";
  summary.textContent = `Volt Runner Studio pair, ${selectedColor.name}, ${detail}. Launch price: EUR 129.`;
  cartStatus.textContent = "";
  shopButton.textContent = "Add to cart";
  shopButton.disabled = false;
  endScreen.classList.remove("hidden");
}

function resetCustomization() {
  selectedColor = colors[0];
  placedStickers = [];
  stickerLayer.replaceChildren();
  selectColor(selectedColor);
  cartStatus.textContent = "";
  endScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
}

function startCustomization() {
  startScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function showSprintUnlocks() {
  let unlocked = [];
  try {
    unlocked = JSON.parse(sessionStorage.getItem("voltRunnerPatches") || "[]");
  } catch {
    unlocked = [];
  }

  if (!unlocked.length) return;

  unlockNote.textContent = `Game unlocks available: ${unlocked.join(", ")}.`;
  document.querySelectorAll(".sticker-option").forEach((button) => {
    button.classList.toggle("unlocked", unlocked.includes(button.dataset.name));
  });
}

function addToCart() {
  cartStatus.textContent = "Added to demo cart. The playable ad would hand off to checkout here.";
  shopButton.textContent = "Added";
  shopButton.disabled = true;
}

document.addEventListener("pointermove", (event) => moveGhost(event.clientX, event.clientY));
document.addEventListener("pointerup", finishDrag);
productStage.addEventListener("contextmenu", (event) => event.preventDefault());
startButton.addEventListener("click", startCustomization);
finishButton.addEventListener("click", finishCustomization);
shopButton.addEventListener("click", addToCart);
againButton.addEventListener("click", resetCustomization);

buildPalettes();
selectColor(selectedColor);
