// 🤖 COMPUTER PLAYERS — a simple robot brain that plays the game.
// Used for Spectate mode, and by the tests to check every level can be beaten.
// It looks at the blocks just ahead and decides when to jump.

const SOLID = new Set(['#', '=', 'B', 'b'])

export const BOT_NAMES = [
  'Robo Bean',
  'Captain Waffle',
  'Sir Bounce-a-lot',
  'Noodle Ninja',
  'Princess Pancake',
  'Zippy McZoom',
  'Professor Pickle',
  'Bubbles the Brave',
  'Turbo Taco',
  'Lady Marshmallow',
]

export function createBrain() {
  return { hold: 0, lastX: 0, stuckFrames: 0, backOff: 0 }
}

function solid(world, tx, ty) {
  if (tx < 0 || tx >= world.width) return true
  if (ty < 0 || ty >= world.height) return false
  return SOLID.has(world.grid[ty][tx])
}

// Is there ground to land on anywhere below row `fromRow` in this column? (No = a pit.)
function hasFloor(world, tx, fromRow) {
  for (let ty = fromRow; ty < world.height; ty++) {
    if (solid(world, tx, ty)) return true
    if (world.grid[ty]?.[tx] === 'S') return false
  }
  return false
}

// Decide which buttons to press this frame.
export function botInput(game, brain) {
  const { hero, world, T } = game
  const input = { left: false, right: true, jump: false }

  // Keep holding jump for a full-height jump.
  if (brain.hold > 0) {
    brain.hold -= 1
    input.jump = true
  }

  // Stuck against something? Back off a little, then try again.
  if (brain.backOff > 0) {
    brain.backOff -= 1
    return { left: true, right: false, jump: false }
  }
  if (Math.abs(hero.x - brain.lastX) < 0.5) brain.stuckFrames += 1
  else brain.stuckFrames = 0
  brain.lastX = hero.x
  if (brain.stuckFrames > 90) {
    brain.stuckFrames = 0
    brain.backOff = 25
  }

  if (!hero.onGround) return input

  const cx = Math.floor((hero.x + hero.w / 2) / T)
  const front = Math.floor((hero.x + hero.w + 2) / T)
  const row = Math.floor((hero.y + hero.h - 1) / T) // the row the hero's feet are in

  let jump = false
  // A wall or step ahead
  if (solid(world, front, row) || solid(world, front, row - 1)) jump = true
  // A gap or spikes ahead
  for (let dx = 1; dx <= 2; dx++) {
    const tx = cx + dx
    if (world.grid[row]?.[tx] === 'S') jump = true
  }
  if (!solid(world, front, row + 1) && !hasFloor(world, front, row + 1)) jump = true
  // An enemy coming up
  for (const e of world.enemies) {
    if (e.dead || e.squish > 0) continue
    const dx = e.x - (hero.x + hero.w)
    if (dx > -4 && dx < T * 1.6 && Math.abs(e.y + e.h - (hero.y + hero.h)) < T) jump = true
  }
  // Treasure chest right above? Bump it!
  for (let up = 1; up <= 3; up++) {
    if (world.grid[row - up]?.[cx] === 'B' && !solid(world, cx, row - up + 1)) jump = true
  }

  if (jump && brain.hold === 0) {
    input.jump = false // release for one frame so the jump counts as a new press
    brain.hold = 30
  }
  return input
}
