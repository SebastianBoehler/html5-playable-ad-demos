# Volt Runner Playable Ad Customizer

A mobile-first playable product ad prototype for a fictional sneaker, the Volt Runner One. The player customizes the shoe by selecting a color and dragging patch-style accessories onto the product, then finishes on a product card with price and cart CTA.

## Why this demo exists

- Demonstrates direct product interaction and conversion flow, a common playable-ad pattern.
- Uses Pointer Events for shared touch and mouse drag behavior.
- Keeps all visuals in HTML, CSS and detailed inline SVG, with no external assets.
- Produces an end-state summary that maps to an ad CTA, product recommendation or training example label.

## Run locally

Open `index.html` in a browser.

For a local server from the repository root:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000/html5-game-demos/drag-customizer/`.
