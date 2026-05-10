# HTML5 Game Demos

Three small mobile-first HTML5 game demos plus one direct product customizer for an Agentic Game Dev application. All demos are standalone, framework-free prototypes that run by opening `index.html`.

The root `index.html` is a shareable demo menu for GitHub Pages.

## Demos

### Volt Runner Sprint

A 20-second runner playable ad for the fictional Volt Runner One sneaker. The player drags left or right to steer a runner, collects the same patch concepts used in the customizer and avoids obstacles. It demonstrates a more game-like mobile loop with movement, spawning, collision checks, feedback and a CTA handoff into the customizer.

### Brew Rush

A 25-second dexterity playable ad for a fictional cold brew brand. The player drags a cup across a cafe counter to catch falling ingredients in the ticket order while avoiding wrong drops. It demonstrates product assembly, motion, urgency and food/beverage ad mechanics.

### Glow Lab Cleanse

A 25-second tactile skincare playable ad. The player scrubs soap spots off a face, then drags cream over the skin until coverage reaches the target. It demonstrates continuous touch input, progress coverage, visual transformation and lifestyle product framing.

### Drag-and-Drop Product Customizer

An extra direct product customization ad prototype for a fictional Volt Runner One sneaker. The player changes the shoe color, drags patches onto it, then finishes on a product card with price and a cart CTA.

## Why these fit playable ads

Playable ads need to communicate the core interaction in seconds, load fast and work reliably on mobile screens. These demos focus on short sessions, large controls, direct touch input, clear feedback and simple end states that could become a call to action or a labeled training example. Together they show multiple ad genres: runner game, catching/order assembly, tactile cleaning/coverage and direct product customization.

## Why these fit the Agentic Game Dev role

The demos are intentionally small and readable because they are designed as fast prototypes for AI-assisted and agentic development workflows. They show plain JavaScript, HTML5 interaction design, mobile game loops and ad-like interactables without relying on a framework or asset pipeline. That makes them easy to generate, modify, evaluate and use as examples for models that create interactive advertising experiences.

## Run locally

Open the demo menu:

- `index.html`

Or open an individual demo directly:

- `sprint-runner/index.html`
- `brew-rush/index.html`
- `skincare-lab/index.html`
- `drag-customizer/index.html`

Or run a local server from this directory:

```bash
python3 -m http.server 8000
```

Then visit:

- `http://localhost:8000/`
- `http://localhost:8000/sprint-runner/`
- `http://localhost:8000/brew-rush/`
- `http://localhost:8000/skincare-lab/`
- `http://localhost:8000/drag-customizer/`

## Deploy with GitHub Pages

Best option: make this `html5-game-demos` folder the repository root. Then GitHub Pages can serve the demo menu from:

- `https://YOUR_USER.github.io/YOUR_REPO/`

Steps:

1. Create a GitHub repository with this folder as the repo root.
2. Push the files to the `main` branch.
3. In the repository settings, open **Pages**.
4. Set the source to **Deploy from a branch**, branch `main`, folder `/root`.
5. Share the Pages URL once GitHub finishes publishing.

Alternative: if this folder is inside a larger repository, use these URLs:

   - `https://YOUR_USER.github.io/YOUR_REPO/html5-game-demos/sprint-runner/`
   - `https://YOUR_USER.github.io/YOUR_REPO/html5-game-demos/brew-rush/`
   - `https://YOUR_USER.github.io/YOUR_REPO/html5-game-demos/skincare-lab/`
   - `https://YOUR_USER.github.io/YOUR_REPO/html5-game-demos/drag-customizer/`

## Notes

- Plain HTML, CSS and JavaScript only.
- No external assets.
- No build step.
- Mobile-first and responsive.
- Kept deliberately compact for quick review and agentic iteration.
- See `RESEARCH_NOTES.md` for the playable-ad and advergame rationale behind the changes.
