# Volt Runner Sprint Playable Ad

A mobile-first playable ad prototype for the fictional Volt Runner One sneaker. The player drags left or right to steer a runner, collects shoe patches and avoids obstacles during a 20-second sprint.

## Why this demo exists

- Shows a more game-like playable ad than a direct product customizer.
- Uses one-thumb steering, instant feedback, collision checks and a short timed game loop.
- Reuses the patch language from the sneaker customizer so both demos feel like one campaign.
- Ends with a CTA handoff to the customizer, passing collected patch names through session storage.

## Run locally

Open `index.html` in a browser.

For a local server from the repository root:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000/html5-game-demos/sprint-runner/`.
