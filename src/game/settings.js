// 🎛️  GAME SETTINGS — the "knobs" of the game.
// Change a number, save, and the game updates right away!

export const SETTINGS = {
  // ---- Names ----
  gameTitle: "Anamika's Adventure",
  heroName: 'Pip',

  // ---- Hero ----
  hearts: 3, // how many hits you can take before "Oops!"
  runSpeed: 4.5, // bigger = faster running
  jumpPower: 14, // bigger = higher jumps
  gravity: 0.55, // bigger = fall faster (try 0.3 for moon jumping!)
  maxFallSpeed: 14,

  // ---- Enemies ----
  enemySpeed: 1.2,
  stompBounce: 9, // how high you bounce after stomping an enemy

  // ---- World ----
  tileSize: 48, // size of one block, in pixels
  viewTilesHigh: 12, // how many blocks tall the screen shows

  // ---- Colors ----
  skyTop: '#7ec8ff',
  skyBottom: '#d4f1ff',

  // ---- Sound ----
  soundOn: true,
}
