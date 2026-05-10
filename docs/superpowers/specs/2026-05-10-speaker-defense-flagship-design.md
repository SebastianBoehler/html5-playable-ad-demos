# Speaker Defense Flagship Design

## Goal

Upgrade the demo set from simple DOM interactables into a portfolio-ready pair:

- `Speaker Defense`: a flagship browser-game playable ad with real arcade/tower-defense structure.
- `Sneaker Studio`: a more premium product customizer that remains a direct playable ad.

The first demo should prove game-development ability. The second should prove product-focused interactive advertising.

## Direction

`Speaker Defense` is a short mobile-first tower defense game for a fictional portable speaker. Waves of noisy enemies move through a rooftop party scene. The player places speaker towers on marked pads. Towers fire animated sound waves, earn coins, upgrade, and protect the party. The product is part of the mechanics: bass, range, durability, and party energy become game verbs.

`Sneaker Studio` stays as the direct product ad companion, but receives visual polish rather than a full rebuild. It should feel like a premium configurator: richer product illustration, material swatches, better staging, and a cleaner commerce CTA.

## Architecture

Use framework-free HTML5 Canvas for `Speaker Defense`, with DOM only for the HUD, menus, and end card. This keeps the code readable, self-contained, and close to the original HTML/CSS/JS constraint while still allowing a more game-like render loop.

The `speaker-defense` folder will contain focused files under 300 lines:

- `index.html`: shell, HUD, menu, CTA.
- `style.css`: responsive layout and game UI chrome.
- `config.js`: waves, tower stats, path, pads, product copy.
- `audio.js`: small Web Audio effects.
- `sprites.js`: generated sprite/textured drawing helpers.
- `game.js`: state machine, input, loop, collisions, spawning, upgrades.
- `README.md`: local run and design rationale.

## Gameplay

The session lasts about 75 seconds:

1. Start screen introduces the product fantasy.
2. Player places speakers on rooftop pads by tapping an available pad.
3. Enemies follow a visible path toward the party.
4. Towers fire sound-wave projectiles automatically.
5. Defeated enemies grant coins.
6. Tapping an occupied pad upgrades that speaker if enough coins are available.
7. Surviving all waves wins; too many enemies reaching the party loses.
8. End screen presents a product-style CTA.

## Visual Style

`Speaker Defense` should look like a small classic browser game, not a UI toy:

- rooftop/city background with parallax-like layers
- textured speaker towers and enemy sprites drawn on canvas
- animated sound-wave projectiles and hit particles
- visible path, tower pads, health/coin/wave HUD
- camera shake, flashes, and sound cues for impact

`Sneaker Studio` should keep the existing interaction model but look more premium:

- deeper stage lighting
- larger shoe art and material panels
- clearer swatches and patches
- stronger final product card

## Testing

Verify:

- mobile viewport around 390x844
- no page scrolling during play
- pad taps place and upgrade towers
- enemies follow the path and damage the base
- waves complete and end screen appears
- no console errors
- GitHub Pages still serves the landing page and demos
