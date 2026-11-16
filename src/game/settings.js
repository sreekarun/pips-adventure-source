// 🎛️  GAME SETTINGS — the "knobs" of the game.
// Change a number, save, and the game updates right away!

export const SETTINGS = {
  // ---- Names ----
  gameTitle: "Pip's Adventure",
  heroName: 'Pip',

  // ---- Hero ----
  hearts: 3, // how many hits you can take before "Oops!"
  runSpeed: 4.5, // bigger = faster running
  jumpPower: 14, // bigger = higher jumps
  gravity: 0.55, // bigger = fall faster (try 0.3 for moon jumping!)
  maxFallSpeed: 14,
  groundGrip: 0.25, // how fast you speed up/stop on the ground (small = slippery)
  airGrip: 0.12, // how much you can steer in the air

  // ---- Enemies ----
  enemySpeed: 1.2,
  stompBounce: 9, // how high you bounce after stomping an enemy

  // ---- World ----
  tileSize: 48, // size of one block, in pixels
  viewTilesHigh: 12, // how many blocks tall the screen shows

  // ---- Colors ----
  skyTop: '#7ec8ff',
  skyBottom: '#d4f1ff',

  // ---- Treasure chests ----
  // What can be inside a chest. Bigger "chance" = happens more often.
  treasureChances: [
    { reward: 'coins', amount: 1, chance: 25 },
    { reward: 'coins', amount: 5, chance: 20 },
    { reward: 'coins', amount: 10, chance: 10 },
    { reward: 'costume', chance: 25 },
    { reward: 'nothing', chance: 20 },
  ],

  // ---- Coins and worlds ----
  allLevelsBonus: 100, // coins you win for beating every world

  // ---- Sound ----
  soundOn: true,
}
