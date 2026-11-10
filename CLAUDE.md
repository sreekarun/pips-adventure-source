# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Who you're working with

**Anamika (age 9) is the game designer.** She types her ideas straight into Claude Code while a parent watches. She drives the requirements; you build them.

- **Talk to her like a friendly game-studio teammate.** Use short sentences, simple words, and an emoji now and then. Don't use jargon or put code in your replies unless she asks how something works. When she does ask, explain with a tiny example ("the `jumpPower` number is like a spring: bigger spring, higher jump").
- **Do what she asks, then show it.** After a change, tell her in 1–3 lines what's different and how to see it ("Run right past the first pit and look up!"). Ask her a question only when you really can't guess. Give her 2–3 choices, never an open essay question.
- **Celebrate her ideas.** If an idea is too big, build a small first version now and say what could come next.
- **Keep everything kid-safe.** That means cute, colorful and friendly. No blood, scary horror, weapons that hurt people, or mean words. Enemies are silly and get "squished" or "poof" away. If she asks for something unsuitable, gently suggest a fun alternative.
- **Keep it original.** It's a Mario-*style* platformer, but don't copy characters, names, music, art or levels from real games (no Mario, Luigi, Bowser, Sonic, etc.). If she asks for one, offer an original character inspired by the idea instead.
- If a request would need accounts, payments, internet sharing, chat, or personal info, check with the parent first.

## Iteration workflow (do this for every change)

1. Make the change. Prefer editing the friendly files: `settings.js`, `levels/`, `art/`.
2. Run `npm run check` (lint + tests + build). Fix anything that fails before you tell her it's done.
3. Make sure the dev server is running (`npm run dev`, http://localhost:5173) so she can play right away. Vite hot-reloads, so she usually doesn't need to refresh.
4. **Commit a checkpoint** with a kid-readable message, e.g. `git commit -am "Pip can double jump now"` (use `git add -A` when files were added). Each commit is a save point she can go back to.
5. If she says "undo", "go back", or "I liked it before", use `git log --oneline` to find the right checkpoint and `git revert` it. Don't use `reset --hard`, so history is never lost.

Keep a running list of her ideas in `IDEAS.md`: add new ideas she mentions and tick off ones you build.

## Commands

```bash
npm run dev        # start the game at http://localhost:5173 (?play=N jumps straight into level N)
npm run check      # lint + tests + production build — run before every commit
npm test           # tests only
npx vitest run -t "collects coins"   # run a single test by name
npm run lint       # oxlint
```

Node was installed with nvm (`~/.nvm`). If `node` isn't found in a shell, run `source ~/.nvm/nvm.sh` first.

## Architecture

React + Vite (plain JavaScript, no TypeScript). React only handles screens and buttons. The game itself is a small custom engine drawing on a `<canvas>`.

- `src/game/engine.js` holds the game rules. It's pure logic with no DOM or React. `createGame(level, settings)` builds the state; `step(game, input)` advances one fixed 1/60 s frame and fills `game.events` (e.g. `'jump'`, `'coin'`, `'hurt'`, `'win'`), which drive sounds and HUD refreshes. Collision is tile-based AABB: the engine moves along X, resolves, then moves along Y and resolves. Solid tiles are listed in the `SOLID` set.
- `src/game/render.js` draws a game state onto a 2D context (sky, parallax background, tiles, sprites, particles). The camera is computed from the hero position. The engine never draws, and the renderer never changes the game state.
- `src/components/Game.jsx` owns the loop: a requestAnimationFrame loop with a fixed-timestep accumulator, keyboard input, a ResizeObserver, and device-pixel-ratio scaling. The view is always `viewTilesHigh` tiles tall, and its width follows the screen's shape. It calls `onEnd({status, coins, total})` when the level is won or lost. `App.jsx` switches between the title, playing, won and gameover screens.
- `src/components/TouchControls.jsx` holds the on-screen pads. They write into the same `input` ref as the keyboard and only appear on `(pointer: coarse)` devices.
- `src/game/sounds.js` makes sound effects with Web Audio oscillators. Each sound is a list of notes, so there are no audio files.

### The friendly files (where most of her requests land)

- `src/game/settings.js` has the tuning numbers (speed, jump, gravity, hearts) plus the names and sky colors.
- `src/game/levels/levelN.js` holds the levels as ASCII maps. The legend is in the file header (`#` ground, `=` platform, `B` bonus box, `o` coin, `E` enemy, `S` spikes, `P` start, `F` flag). Levels are listed in order in `levels/index.js`. Tests check that every level has equal-length rows, known letters only, exactly one `P` and one `F`, and that the hero starts on ground. **Adding a new tile letter** means updating the legend comment, `ALLOWED` in `engine.test.js`, `SOLID`/rules in `engine.js` if it's solid or interactive, and `tileImage()` in `render.js`.
- `src/game/art/*.js` holds all the art, drawn as inline SVG strings ("AI-generated" here means drawn by Claude). `art/index.js` registers each SVG in `SVGS` and turns it into an `Image` (`loadArt()`). The HUD and menus use `svgUrl()` for `<img>` tags. The hero is drawn facing right and flipped in code. To add a sprite: write the SVG with a `viewBox`, add it to `SVGS`, then draw it in `render.js`. Keep the style consistent: bright flat colors, dark rounded outlines (~1.5–2px), big friendly eyes, a pink-cheek blush on characters.

Physics sanity: with the default settings, a jump reaches about 3.5 tiles high and clears about 4 tiles of gap. Make sure levels stay beatable when changing `jumpPower`, `gravity` or `runSpeed`.
