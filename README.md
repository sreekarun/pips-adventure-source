# Pip's Adventure 🐱⭐

A side-scrolling platformer designed by Pip and built with Claude Code.

## Play

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

- **Computer:** arrow keys (or A/D) to run, Space or Up to jump, P to pause.
- **iPad:** use the on-screen buttons. To play on an iPad on the same Wi-Fi, run `npm run dev -- --host` and open the "Network" address it prints.

## Making changes

Tell Claude what you want, for example "make Pip jump higher" or "add a level in the snow". Claude changes the game and saves a checkpoint after every change, so you can always go back.

Files you can also edit by hand:

| File | What it changes |
| --- | --- |
| `src/game/settings.js` | Speed, jump height, gravity, hearts, names, sky color |
| `src/game/levels/` | The level maps, drawn with letters (one file per world) |
| `src/game/art/` | What everything looks like |
