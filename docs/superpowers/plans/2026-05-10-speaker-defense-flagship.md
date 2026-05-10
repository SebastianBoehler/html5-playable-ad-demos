# Speaker Defense Flagship Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a polished canvas tower-defense playable ad and upgrade the sneaker customizer into the supporting premium product demo.

**Architecture:** `speaker-defense` is a framework-free Canvas game with DOM HUD/menu controls and small focused JavaScript modules. `drag-customizer` keeps its current behavior but receives a stronger visual presentation without changing the core interaction contract.

**Tech Stack:** HTML5, CSS, JavaScript modules via classic script tags, Canvas 2D, Web Audio, GitHub Pages.

---

### Task 1: Speaker Defense Game Shell

**Files:**
- Create: `speaker-defense/index.html`
- Create: `speaker-defense/style.css`
- Create: `speaker-defense/README.md`

- [ ] **Step 1: Create a mobile-first game page**

Add a canvas stage, HUD fields for wave/coins/party health, start/end overlays, and CTA buttons.

- [ ] **Step 2: Add responsive game chrome**

Style the page so the playfield fills an iPhone-sized viewport, disables touch scrolling during play, and presents the game as a polished product ad.

- [ ] **Step 3: Commit**

```bash
git add speaker-defense
git commit -m "feat(speaker-defense): add game shell"
```

### Task 2: Speaker Defense Data, Sprites, Audio

**Files:**
- Create: `speaker-defense/config.js`
- Create: `speaker-defense/sprites.js`
- Create: `speaker-defense/audio.js`

- [ ] **Step 1: Define game data**

Add path points, build pads, wave definitions, enemy stats, tower costs, upgrade stats, and product CTA copy.

- [ ] **Step 2: Add generated game art helpers**

Implement canvas drawing helpers for rooftop background, textured path, speaker towers, enemy sprites, sound-wave projectiles, and impact particles.

- [ ] **Step 3: Add Web Audio cues**

Implement small user-gesture-safe sounds for placing towers, hits, upgrades, damage, and victory.

- [ ] **Step 4: Commit**

```bash
git add speaker-defense/config.js speaker-defense/sprites.js speaker-defense/audio.js
git commit -m "feat(speaker-defense): add data art and audio"
```

### Task 3: Speaker Defense Game Loop

**Files:**
- Create: `speaker-defense/game.js`

- [ ] **Step 1: Implement state and scaling**

Create the state machine for start, playing, won, and lost. Fit the logical canvas to mobile and desktop screens using device pixel ratio.

- [ ] **Step 2: Implement placement and upgrades**

Pointer taps on empty pads place speakers when the player has coins. Pointer taps on occupied pads upgrade speakers when affordable.

- [ ] **Step 3: Implement waves and combat**

Spawn enemies, move them along the path, target them with towers, fire projectiles, apply damage, award coins, and reduce party health on leaks.

- [ ] **Step 4: Implement rendering and feedback**

Draw the background, path, pads, towers, enemies, projectiles, particles, HUD feedback, camera shake, and end screens.

- [ ] **Step 5: Commit**

```bash
git add speaker-defense/game.js
git commit -m "feat(speaker-defense): implement tower defense loop"
```

### Task 4: Sneaker Studio Polish

**Files:**
- Modify: `drag-customizer/index.html`
- Modify: `drag-customizer/style.css`
- Modify: `drag-customizer/product.css`
- Modify: `drag-customizer/README.md`

- [ ] **Step 1: Strengthen the product framing**

Rename the visible experience to `Sneaker Studio`, make the product stage larger, and tighten the CTA copy.

- [ ] **Step 2: Improve visual detail**

Add richer product lighting, premium material swatches, better patch buttons, and a stronger product-card feel.

- [ ] **Step 3: Commit**

```bash
git add drag-customizer
git commit -m "feat(sneaker-studio): polish product customizer"
```

### Task 5: Landing, Docs, QA, Publish

**Files:**
- Modify: `index.html`
- Modify: `landing.css`
- Modify: `README.md`

- [ ] **Step 1: Add Speaker Defense to the demo menu**

Make `Speaker Defense` the primary first card and keep `Sneaker Studio` as the direct product demo.

- [ ] **Step 2: Run syntax and file-size checks**

```bash
node --check speaker-defense/game.js
wc -l speaker-defense/* drag-customizer/* index.html landing.css README.md
```

- [ ] **Step 3: Browser test locally**

Run `python3 -m http.server 8010`, open `http://localhost:8010/`, test mobile viewport, place/upgrade towers, finish or lose a wave, and check console errors.

- [ ] **Step 4: Push to GitHub**

```bash
git add index.html landing.css README.md
git commit -m "docs: feature speaker defense on demo menu"
git push
```
