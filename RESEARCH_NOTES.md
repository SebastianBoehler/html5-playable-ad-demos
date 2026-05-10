# Research Notes: Playable Ads and Advergames

These notes summarize the design logic behind the two demos and how the prototypes map to current playable-ad practice.

## Market and format signals

- Playable ads are commonly structured as a short journey: tutorial prompt, interactive experience, end card and measurable action. IAB also describes brand playables as supporting extra outcomes such as couponing, sweepstakes, ticketing and m-commerce.
- Liftoff's 2025 Mobile Ad Creative Index reports that interactive ad spend grew year over year and that playable ads delivered much higher impression-to-install rates than non-playable formats for mobile games.
- Current industry writing converges on a short, mobile-first format: hook in the first seconds, one clear gesture, 10-20 seconds of interaction and a CTA end card.
- The state-of-the-art production problem is creative throughput: teams need many small variants, not one large game. This makes framework-free HTML5 prototypes useful for agentic generation, testing and mutation.

## Psychological principles used

- Product-mechanic fit: advergame research finds that interaction and fit between the game and the brand/product affect attitude toward the brand and purchase intention. The interaction should demonstrate the product, not sit beside it.
- Flow: short games work best when the challenge is immediately understandable, feedback is instant and the player can feel competent quickly.
- Endowment effect: customization can make a product feel more personally owned. The sneaker demo uses color and patch placement so the end card can say "your" product.
- Goal-gradient and rewarded action: progress toward a visible reward can increase persistence. The runner demo turns distance and patch collection into a CTA handoff.
- Autonomy and agency: letting the player choose, drag, collect or finish creates a stronger sense of participation than passive viewing.

## How this changed the demos

- `sprint-runner` is a gamified Volt Runner One shoe ad. The player steers a runner, collects patches and avoids obstacles before handing those patch names into the product customizer.
- `brew-rush` is a coffee catching game. It explores a food/beverage playable ad where the player learns the product by physically catching ingredients under time pressure.
- `skincare-lab` is a tactile skincare game. It explores a lifestyle playable ad where the player cleans soap and applies cream through continuous drag coverage.
- `drag-customizer` is now a fictional Volt Runner One sneaker ad with product name, price, feature chips, more detailed SVG product art and an Add to cart handoff.
- All demos keep one primary interaction, large mobile targets, short sessions, no external assets, no build step and a clear CTA.

## Strong next variants

- Add a short lead-in scene that visually sets up the product before the playable starts.
- Create 3-5 A/B variants from the same code: different CTA text, reward timing, colors, difficulty and end-card copy.
- Add a tiny local event log schema for generated training examples, such as `start`, `select_color`, `drop_patch`, `score`, `claim_offer`.
- Generate a more realistic product asset pack, then compare SVG-only versus image-rich variants for load time and perceived polish.
- Build one deliberately "ethical playable" variant that avoids fake buttons, misleading app-store handoffs and forced clicks.
