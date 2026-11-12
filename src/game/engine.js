// ⚙️  GAME ENGINE — physics, collisions and rules.
// Pure logic: no drawing and no React, so it can be tested on its own.
import { COSTUMES } from './costumes.js'

const SOLID = new Set(['#', '=', 'B', 'b'])
const HERO_W = 34
const HERO_H = 44
const ENEMY_W = 38
const ENEMY_H = 34

// Turn a level's text map into a grid plus a list of things in it.
export function parseLevel(level, T) {
  const rows = level.map
  const height = rows.length
  const width = Math.max(...rows.map((r) => r.length))
  const grid = []
  let start = { x: T, y: T }
  let flag = null
  const coins = []
  const enemies = []

  for (let ty = 0; ty < height; ty++) {
    const row = []
    for (let tx = 0; tx < width; tx++) {
      const ch = rows[ty][tx] ?? '.'
      const px = tx * T
      const py = ty * T
      if (ch === 'P') {
        start = { x: px + (T - HERO_W) / 2, y: py + T - HERO_H }
        row.push('.')
      } else if (ch === 'o') {
        coins.push({ x: px + T / 2, y: py + T / 2, taken: false })
        row.push('.')
      } else if (ch === 'E') {
        enemies.push(makeEnemy(px + (T - ENEMY_W) / 2, py + T - ENEMY_H))
        row.push('.')
      } else if (ch === 'F') {
        flag = { x: px, y: py + T }
        row.push('.')
      } else {
        row.push(ch)
      }
    }
    grid.push(row)
  }
  return { name: level.name, width, height, grid, start, flag, coins, enemies }
}

function makeEnemy(x, y) {
  return { x, y, w: ENEMY_W, h: ENEMY_H, vx: -1, vy: 0, onGround: false, squish: 0, dead: false }
}

// options: { costume, unlocked: [costume ids already found], random: () => 0..1,
//            powers: { fly, invincible, speed } (admin super powers) }
export function createGame(level, settings, options = {}) {
  const T = settings.tileSize
  const world = parseLevel(level, T)
  return {
    settings,
    T,
    world,
    hero: {
      x: world.start.x,
      y: world.start.y,
      w: HERO_W,
      h: HERO_H,
      vx: 0,
      vy: 0,
      onGround: false,
      facing: 1,
      coyote: 0,
      jumpBuffer: 0,
      invincible: 0,
    },
    hearts: settings.hearts,
    coins: 0,
    costume: options.costume ?? null,
    unlocked: new Set(options.unlocked ?? []),
    lastReward: null, // what the last treasure chest gave
    random: options.random ?? Math.random,
    powers: options.powers ?? {},
    status: 'playing', // 'playing' | 'won' | 'gameover'
    particles: [],
    events: [], // sounds/HUD updates for this frame, e.g. 'jump', 'coin'
    time: 0,
    prevJump: false,
  }
}

export function tileAt(world, tx, ty) {
  if (ty < 0 || ty >= world.height) return '.'
  if (tx < 0 || tx >= world.width) return '#' // invisible walls at the level edges
  return world.grid[ty][tx]
}

function isSolid(world, tx, ty) {
  return SOLID.has(tileAt(world, tx, ty))
}

// Move a body sideways and stop it at walls. Returns true if it hit one.
function moveX(body, world, T) {
  body.x += body.vx
  const top = Math.floor(body.y / T)
  const bottom = Math.floor((body.y + body.h - 0.01) / T)
  if (body.vx > 0) {
    const tx = Math.floor((body.x + body.w - 0.01) / T)
    for (let ty = top; ty <= bottom; ty++) {
      if (isSolid(world, tx, ty)) {
        body.x = tx * T - body.w
        return true
      }
    }
  } else if (body.vx < 0) {
    const tx = Math.floor(body.x / T)
    for (let ty = top; ty <= bottom; ty++) {
      if (isSolid(world, tx, ty)) {
        body.x = (tx + 1) * T
        return true
      }
    }
  }
  return false
}

// Move a body up/down. Returns the tile it bumped its head on, if any.
function moveY(body, world, T) {
  body.y += body.vy
  body.onGround = false
  const left = Math.floor(body.x / T)
  const right = Math.floor((body.x + body.w - 0.01) / T)
  if (body.vy > 0) {
    const ty = Math.floor((body.y + body.h - 0.01) / T)
    for (let tx = left; tx <= right; tx++) {
      if (isSolid(world, tx, ty)) {
        body.y = ty * T - body.h
        body.vy = 0
        body.onGround = true
        return null
      }
    }
  } else if (body.vy < 0) {
    const ty = Math.floor(body.y / T)
    // Prefer the tile nearest the middle of the head.
    const mid = Math.floor((body.x + body.w / 2) / T)
    const order = [mid, left, right].filter((v, i, a) => a.indexOf(v) === i)
    for (const tx of order) {
      if (isSolid(world, tx, ty)) {
        body.y = (ty + 1) * T
        body.vy = 0
        return { tx, ty }
      }
    }
  }
  return null
}

function overlaps(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
}

function hurt(game, fromX) {
  const hero = game.hero
  if (hero.invincible > 0 || game.powers.invincible || game.status !== 'playing') return
  game.hearts -= 1
  game.events.push('hurt')
  if (game.hearts <= 0) {
    game.status = 'gameover'
    game.events.push('gameover')
    return
  }
  hero.invincible = 90
  hero.vy = -7
  hero.vx = hero.x + hero.w / 2 < fromX ? -6 : 6
}

function respawn(game) {
  const hero = game.hero
  hero.x = game.world.start.x
  hero.y = game.world.start.y
  hero.vx = 0
  hero.vy = 0
  hero.invincible = 60
}

// Advance the game by one frame (1/60th of a second).
// input = { left, right, jump } (true while the button is held)
export function step(game, input) {
  game.events = []
  game.time += 1
  updateParticles(game)
  if (game.status !== 'playing') return game

  const { settings: s, world, hero, T } = game

  // --- Hero movement ---
  const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0)
  if (dir !== 0) hero.facing = dir
  const target = dir * s.runSpeed * (game.powers.speed ? 1.8 : 1)
  hero.vx += (target - hero.vx) * (hero.onGround ? s.groundGrip : s.airGrip)

  const jumpPressed = input.jump && !game.prevJump
  game.prevJump = input.jump
  hero.jumpBuffer = jumpPressed ? 6 : Math.max(0, hero.jumpBuffer - 1)
  hero.coyote = hero.onGround ? 6 : Math.max(0, hero.coyote - 1)
  if (hero.jumpBuffer > 0 && hero.coyote > 0) {
    hero.vy = -s.jumpPower
    hero.jumpBuffer = 0
    hero.coyote = 0
    game.events.push('jump')
  }

  // Let go of jump early for a smaller hop.
  hero.vy += s.gravity * (!input.jump && hero.vy < 0 ? 2 : 1)
  hero.vy = Math.min(hero.vy, s.maxFallSpeed)
  if (game.powers.fly && input.jump) hero.vy = Math.max(hero.vy - 1.6, -7) // 🦅 flying!

  moveX(hero, world, T)
  const bump = moveY(hero, world, T)
  if (bump && tileAt(world, bump.tx, bump.ty) === 'B') {
    openTreasure(game, bump.tx, bump.ty)
  } else if (bump) {
    game.events.push('bump')
  }
  if (hero.invincible > 0) hero.invincible -= 1

  // --- Coins ---
  for (const c of world.coins) {
    if (c.taken) continue
    const dx = hero.x + hero.w / 2 - c.x
    const dy = hero.y + hero.h / 2 - c.y
    if (Math.abs(dx) < hero.w / 2 + 10 && Math.abs(dy) < hero.h / 2 + 10) {
      c.taken = true
      game.coins += 1
      game.events.push('coin')
      game.particles.push({ kind: 'sparkle', x: c.x, y: c.y, vy: -1, life: 20 })
    }
  }

  // --- Spikes ---
  const feet = { x: hero.x + 6, y: hero.y + 10, w: hero.w - 12, h: hero.h - 10 }
  const l = Math.floor(feet.x / T)
  const r = Math.floor((feet.x + feet.w) / T)
  const tTop = Math.floor(feet.y / T)
  const tBot = Math.floor((feet.y + feet.h) / T)
  for (let ty = tTop; ty <= tBot; ty++) {
    for (let tx = l; tx <= r; tx++) {
      if (tileAt(world, tx, ty) === 'S') {
        const spike = { x: tx * T + 4, y: ty * T + T * 0.45, w: T - 8, h: T * 0.55 }
        if (overlaps(feet, spike)) hurt(game, tx * T + T / 2)
      }
    }
  }

  // --- Enemies ---
  for (const e of world.enemies) {
    if (e.dead) continue
    if (e.squish > 0) {
      e.squish -= 1
      if (e.squish === 0) e.dead = true
      continue
    }
    e.vx = Math.sign(e.vx || -1) * s.enemySpeed
    const hitWall = moveX(e, world, T)
    e.vy = Math.min(e.vy + s.gravity, s.maxFallSpeed)
    moveY(e, world, T)
    // Turn around at walls and at ledges.
    const aheadX = e.vx > 0 ? e.x + e.w + 1 : e.x - 1
    const below = Math.floor((e.y + e.h + 1) / T)
    if (hitWall || (e.onGround && !isSolid(world, Math.floor(aheadX / T), below))) e.vx = -e.vx
    if (e.y > world.height * T + 200) e.dead = true

    if (overlaps(hero, e)) {
      const stomp = hero.vy > 0 && hero.y + hero.h - e.y < 18
      if (stomp) {
        e.squish = 20
        hero.vy = -s.stompBounce
        game.events.push('stomp')
        game.particles.push({ kind: 'puff', x: e.x + e.w / 2, y: e.y + e.h / 2, vy: 0, life: 18 })
      } else {
        hurt(game, e.x + e.w / 2)
      }
    }
  }

  // --- Falling into a pit ---
  if (hero.y > world.height * T + 60 && game.status === 'playing') {
    if (game.powers.invincible) {
      respawn(game)
      return game
    }
    game.hearts -= 1
    game.events.push('hurt')
    if (game.hearts <= 0) {
      game.status = 'gameover'
      game.events.push('gameover')
    } else {
      respawn(game)
    }
  }

  // --- Finish flag ---
  if (world.flag && game.status === 'playing' && hero.x + hero.w > world.flag.x + T * 0.4) {
    game.status = 'won'
    game.events.push('win')
  }

  return game
}

// Pick a reward using the chances in settings.treasureChances.
function pickReward(game) {
  const table = game.settings.treasureChances
  const total = table.reduce((n, r) => n + r.chance, 0)
  let roll = game.random() * total
  for (const r of table) {
    roll -= r.chance
    if (roll < 0) return r
  }
  return table[table.length - 1]
}

function openTreasure(game, tx, ty) {
  const { T } = game
  game.world.grid[ty][tx] = 'b'
  const x = tx * T + T / 2
  const y = ty * T
  game.events.push('treasure')
  let reward = pickReward(game)

  if (reward.reward === 'costume') {
    const fresh = COSTUMES.filter((c) => !game.unlocked.has(c.id))
    if (fresh.length) {
      const costume = fresh[Math.floor(game.random() * fresh.length)]
      game.unlocked.add(costume.id)
      game.costume = costume.id
      game.lastReward = { kind: 'costume', id: costume.id }
      game.events.push('costume')
      game.particles.push({ kind: 'sparkle', x, y, vy: -1, life: 20 })
      game.particles.push({ kind: 'costume', x, y, vy: -3, life: 50 })
      return
    }
    reward = { reward: 'coins', amount: 5 } // you already have every costume!
  }

  if (reward.reward === 'coins') {
    game.coins += reward.amount
    game.lastReward = { kind: 'coins', amount: reward.amount }
    game.events.push('coin')
    for (let i = 0; i < Math.min(reward.amount, 10); i++) {
      const spread = reward.amount === 1 ? 0 : (i / (Math.min(reward.amount, 10) - 1) - 0.5) * 6
      game.particles.push({ kind: 'coin', x, y, vx: spread, vy: -8 - (i % 3), life: 34 })
    }
    return
  }

  game.lastReward = { kind: 'nothing' }
  game.events.push('empty')
  game.particles.push({ kind: 'puff', x, y: y - T / 2, vy: 0, life: 24 })
}

function updateParticles(game) {
  for (const p of game.particles) {
    p.x += p.vx ?? 0
    p.y += p.vy
    if (p.kind === 'coin') p.vy += 0.5
    p.life -= 1
  }
  game.particles = game.particles.filter((p) => p.life > 0)
}
