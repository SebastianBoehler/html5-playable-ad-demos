# HTML5 Playable Ad Demos

Two mobile-first HTML5 playable ad demos built for an Agentic Game Dev application. Both demos are standalone, framework-free, and run from static files.

Live site:

- `https://sebastianboehler.github.io/html5-playable-ad-demos/`

## Demos

### Speaker Defense

A canvas-based tower defense playable ad for a fictional portable speaker. The player places and upgrades speaker towers on a rooftop to stop waves of noise enemies before they reach the party.

This demo shows a more game-like browser experience: pathing, waves, targeting, upgrades, particles, sound cues, win/loss states, and mobile tap controls.

### Sneaker Studio

A direct product customization ad for a fictional sneaker studio. The player chooses a material color, drags patches onto the shoe, and finishes on a launch-style product card.

This demo shows product-focused interaction: touch dragging, visual customization, end-state summary, and commerce-style CTA flow.

## Why This Fits

The pair covers two relevant playable-ad directions:

- a real game loop with product-themed mechanics
- a direct product interaction that feels closer to an interactive ad

The implementation intentionally uses plain HTML, CSS, JavaScript, Canvas 2D, and Web Audio with no build step or external assets.

## Run Locally

Open `index.html` directly, or serve the repository root:

```bash
python3 -m http.server 8000
```

Then visit:

- `http://localhost:8000/`
- `http://localhost:8000/speaker-defense/`
- `http://localhost:8000/drag-customizer/`

## Deploy

This repository is ready for GitHub Pages from the `main` branch and repository root:

```text
Settings -> Pages -> Deploy from a branch -> main -> /root
```
