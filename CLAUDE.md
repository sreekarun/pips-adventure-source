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
npm run dev        # start the game at http://localhost:5173
                   #   ?play=N jumps into level N (add &nointro to skip the camera swoop)
                   #   ?maker, ?maker=pixels, ?maker=dog open the hero maker
                   #   ?screen=map|champion|admin|builder|spectate opens that screen
npm run check      # lint + tests + production build — run before every commit
npm test           # tests only
npx vitest run -t "collects coins"   # run a single test by name
npm run lint       # oxlint
```

Node was installed with nvm (`~/.nvm`). If `node` isn't found in a shell, run `source ~/.nvm/nvm.sh` first.

## Architecture

React + Vite (plain JavaScript, no TypeScript). React only handles screens and buttons. The game is a small custom 2D engine (it's played left/right like a platformer) drawn in 3D with three.js.

- `src/game/engine.js` holds the game rules. It's pure logic with no DOM or React. `createGame(level, settings)` builds the state; `step(game, input)` advances one fixed 1/60 s frame and fills `game.events` (e.g. `'jump'`, `'coin'`, `'hurt'`, `'win'`), which drive sounds and HUD refreshes. Collision is tile-based AABB: the engine moves along X, resolves, then moves along Y and resolves. Solid tiles are listed in the `SOLID` set.
- `src/game/render3d.js` is a three.js view of the engine state. `createRenderer3D(canvas, game, art)` builds the scene once from the level: instanced ground and platform boxes (ground is `GROUND_DEPTH` deep), chest meshes, cone spikes, spinning cylinder coins, a waving flag, and scenery (meadow, trees, flowers, hills, clouds). It returns `{ render, resize, setHero, handleEvents, dispose }`. Coordinates: 1 tile = 1 unit, `y = H - py/T`, play happens at z≈0. The hero and enemies are flat textured planes that turn to face the camera (Y-billboard), with blob shadows. Camera angles live in the `CAMERA` object. `handleEvents` triggers swoops (treasure, costume), shakes (hurt, stomp) and an intro swoop, and the camera orbits on a win. The engine never draws, and the renderer never changes the game state.
- `src/components/Game.jsx` owns the loop: a requestAnimationFrame loop with a fixed-timestep accumulator, keyboard input, and a ResizeObserver. It collects each frame's engine events and uses them to play sounds, refresh the HUD, show the treasure toast (`rewardMessage`), re-dress the hero on a `'costume'` event, and pass events to the renderer. It calls `onEnd({status, coins})` when the level is won or lost. `App.jsx` switches between the title, playing, won and gameover screens.
- **Worlds and levels**: each level file in `src/game/levels/` has `id`, `name`, `theme`, `price` (coins to unlock) and `map`. The order on the world map is the `LEVELS` list in `levels/index.js`. `levelSettings(level)` merges `settings.js` with the world's `physics` from `src/game/themes.js` (e.g. snow `groundGrip` = slippery, sea and space use low gravity, candy has bouncy jumps). Pass it to `createGame`. A theme also sets sky, fog, top-face colors, `scenery` (`trees|pines|candy|coral|space`, built in `addScenery()` in `render3d.js`) and `weather` (`snow|bubbles|stars`, in `addWeather()`). Each theme's block, platform, hills and enemy art is in `art/themeArt.js`, loaded as `<theme>_top`, `<theme>_dirt`, `<theme>_platform`, `<theme>_hills`, `<theme>_enemy`. **A new world needs an entry in both `themes.js` and `themeArt.js`.**
- **Robot players** (`src/game/bot.js`): `botInput(game, brain)` returns `{left, right, jump}` from looking at the tiles ahead (walls, pits, spikes, enemies, chests). Spectate mode uses it (`Game` with a `bot` prop), and so does the test `can be beaten by the robot player`, which runs on every level. If a level edit makes that test fail, the level probably has something unfair: a platform hanging just above a pit (you bonk your head and fall in), spikes right before a pit, or a pit wider than the world's jump. With the default physics a jump is about 3.5 tiles high and 4–5 tiles long; space reaches about 4 high and 6–7 long.
- **Progress** (`src/game/progress.js`, saved in localStorage): `bank` (coins carry over between levels and are banked even on game over), `unlockedLevels`, `completed`, `champion`, `bonusClaimed`, admin `powers`, and `customLevels`. These pure helpers are tested in `progress.test.js`: `buyLevel`, `finishLevel` (it gives `allLevelsBonus` once when every built-in level is beaten, which makes you `champion`) and `restartGame` (it relocks the worlds but keeps coins, costumes and champion).
- **Champion extras**: once `champion` is set, the title screen shows Admin and Spectate. Admin super powers (`fly`, `invincible`, `speed`) are passed to `createGame` as `options.powers`. The level builder (`components/LevelBuilder.jsx` plus the pure helpers in `game/levelBuilder.js`) edits a 12-row grid of characters and saves to `progress.customLevels` as string rows, the same format as the built-in levels. Custom levels appear under "My levels" on the map and in Spectate.
- **Treasure chests** (`B` tiles): `openTreasure()` in `engine.js` rolls `settings.treasureChances` with `game.random`, which tests replace with a fixed function. A chest gives coins, a costume not found yet (it falls back to 5 coins once all are found), or nothing. It sets `game.lastReward` and pushes `'treasure'` plus `'coin'`, `'costume'` or `'empty'`.
- **Costumes**: the ids and names are in `src/game/costumes.js`. The drawings are in `art/costumes.js`, each with an `under` layer (behind the hero) and an `over` layer (in front), both in a 48×64 frame where the 40-wide hero stands at the bottom (`art/composeHero.js`). `composeHero()` flattens them into one canvas for the 3D texture. Menus stack them with `components/HeroPicture.jsx`. Found costumes are saved in localStorage (`loadUnlocked`/`saveUnlocked`), and the worn one is `design.costume`.
- **Hero maker** (`src/components/HeroMaker.jsx`, reached from the title screen) has two modes. *Color in* recolors a shape from `art/heroes/` (cat, dog; each has `parts`, default `colors` and a `draw(colors)` function, registered in `heroes/index.js`). `makeHeroSvg(shape, colors)` fills each `data-part`, and clicks find the part through `closest('[data-part]')`. *Paint pixels* draws a 16×20 grid (`art/pixelHero.js`: `floodFill`, `makePixelSvg`, a `STARTER` drawing made of letters). The result is a design object `{ mode, shape, name, colors: {cat: {...}, dog: {...}}, pixels, costume }` (`src/game/heroDesign.js`), saved in localStorage. `designToSvg(design)` becomes the `heroSvg` prop, which `Game.jsx` passes to `loadArt({ hero })`. The renderer keeps the hero's aspect ratio from the image, so a new hero part means adding it to that shape's `parts`, its `colors`, and a `data-part` in its SVG. Keep new shapes in the 40×52 viewBox with the head near (20, 18), so costumes still fit. The paint colors live in `art/palette.js`.
- `src/components/TouchControls.jsx` holds the on-screen pads. They write into the same `input` ref as the keyboard and only appear on `(pointer: coarse)` devices.
- `src/game/sounds.js` makes sound effects with Web Audio oscillators. Each sound is a list of notes, so there are no audio files.

### The friendly files (where most of her requests land)

- `src/game/settings.js` has the tuning numbers (speed, jump, gravity, hearts) plus the names and sky colors.
- `src/game/levels/levelN.js` holds the levels as ASCII maps. The legend is in the file header (`#` ground, `=` platform, `B` bonus box, `o` coin, `E` enemy, `S` spikes, `P` start, `F` flag). Levels are listed in order in `levels/index.js`. Tests check that every level has equal-length rows, known letters only, exactly one `P` and one `F`, and that the hero starts on ground. **Adding a new tile letter** means updating the legend comment, `ALLOWED` in `engine.test.js`, `SOLID`/rules in `engine.js` if it's solid or interactive, and how it's built in `render3d.js`.
- `src/game/art/*.js` holds all the art, drawn as inline SVG strings ("AI-generated" here means drawn by Claude). `art/index.js` registers each SVG in `SVGS` and turns it into an `Image` (`loadArt()`). `render3d.js` uses those images as textures. The HUD and menus use `svgUrl()` for `<img>` tags. Heroes are drawn facing right and flipped in code. To add a sprite: write the SVG with a `viewBox`, add it to `SVGS`, then use it in `render3d.js`. Keep the style consistent: bright flat colors, dark rounded outlines (~1.5–2px), big friendly eyes, a pink-cheek blush on characters.

Physics sanity: with the default settings, a jump reaches about 3.5 tiles high and clears about 4 tiles of gap. Make sure levels stay beatable when changing `jumpPower`, `gravity` or `runSpeed`.
