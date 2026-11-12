import { describe, expect, it } from 'vitest'
import { createGame, step } from './engine.js'
import { SETTINGS } from './settings.js'
import { LEVELS } from './levels/index.js'
import { COSTUMES } from './costumes.js'

const ALLOWED = new Set(['.', '#', '=', 'B', 'o', 'E', 'S', 'P', 'F'])
const idle = { left: false, right: false, jump: false }

function run(game, input, frames) {
  for (let i = 0; i < frames; i++) step(game, input)
  return game
}

// Guard rails for hand-drawn levels.
describe.each(LEVELS.map((l, i) => [i + 1, l]))('level %i', (_, level) => {
  it('has a name and rows of equal length', () => {
    expect(level.name).toBeTruthy()
    const widths = new Set(level.map.map((r) => r.length))
    expect([...widths]).toHaveLength(1)
  })
  it('uses only known letters', () => {
    const bad = level.map.flatMap((row, y) =>
      [...row].flatMap((ch, x) => (ALLOWED.has(ch) ? [] : [`'${ch}' at row ${y + 1}, column ${x + 1}`])),
    )
    expect(bad).toEqual([])
  })
  it('has exactly one start (P) and one flag (F)', () => {
    const count = (ch) => level.map.join('').split(ch).length - 1
    expect(count('P')).toBe(1)
    expect(count('F')).toBe(1)
  })
  it('starts the hero standing on ground', () => {
    const game = run(createGame(level, SETTINGS), idle, 30)
    expect(game.hero.onGround).toBe(true)
    expect(game.status).toBe('playing')
  })
})

const tiny = (rows) => ({ name: 'test', map: rows })

describe('engine', () => {
  it('jumps and lands again', () => {
    const game = run(createGame(tiny(['......', '......', '......', '.P....', '######']), SETTINGS), idle, 10)
    const groundY = game.hero.y
    step(game, { ...idle, jump: true })
    expect(game.events).toContain('jump')
    run(game, { ...idle, jump: true }, 10)
    expect(game.hero.y).toBeLessThan(groundY)
    run(game, idle, 120)
    expect(game.hero.y).toBeCloseTo(groundY)
  })

  it('collects coins', () => {
    const game = run(createGame(tiny(['......', '.Po...', '######']), SETTINGS), { ...idle, right: true }, 30)
    expect(game.coins).toBe(1)
  })

  it('wins at the flag', () => {
    const game = run(createGame(tiny(['......', '.P..F.', '######']), SETTINGS), { ...idle, right: true }, 120)
    expect(game.status).toBe('won')
  })

  it('loses a heart when falling into a pit', () => {
    const game = run(createGame(tiny(['......', '.P....', '##..##']), SETTINGS), { ...idle, right: true }, 200)
    expect(game.hearts).toBeLessThan(SETTINGS.hearts)
  })

  it('squishes an enemy when landing on it', () => {
    const game = createGame(tiny(['......', '......', '..P...', '......', '..E...', '######']), SETTINGS)
    run(game, idle, 60)
    expect(game.world.enemies[0].squish > 0 || game.world.enemies[0].dead).toBe(true)
    expect(game.hearts).toBe(SETTINGS.hearts)
  })

})

describe('treasure chests', () => {
  // Fixed chances so these tests don't change when settings.js is edited.
  const settings = {
    ...SETTINGS,
    treasureChances: [
      { reward: 'coins', amount: 10, chance: 1 },
      { reward: 'costume', chance: 1 },
      { reward: 'nothing', chance: 1 },
    ],
  }
  const chestLevel = tiny(['......', '..B...', '......', '..P...', '######'])
  const openChest = (roll, options = {}) => {
    const game = createGame(chestLevel, settings, { random: () => roll, ...options })
    run(game, idle, 5)
    run(game, { ...idle, jump: true }, 30)
    return game
  }

  it('can give lots of coins', () => {
    const game = openChest(0.1)
    expect(game.coins).toBe(10)
    expect(game.lastReward).toEqual({ kind: 'coins', amount: 10 })
    expect(game.world.grid[1][2]).toBe('b')
  })

  it('can give a new costume and put it on', () => {
    const game = openChest(0.5)
    expect(game.lastReward.kind).toBe('costume')
    expect(game.costume).toBe(game.lastReward.id)
    expect(game.unlocked.has(game.costume)).toBe(true)
  })

  it('gives coins instead once you have every costume', () => {
    const game = openChest(0.5, { unlocked: COSTUMES.map((c) => c.id) })
    expect(game.lastReward).toEqual({ kind: 'coins', amount: 5 })
  })

  it('can be empty', () => {
    const game = openChest(0.9)
    expect(game.lastReward).toEqual({ kind: 'nothing' })
    expect(game.coins).toBe(0)
  })

  it('only opens once', () => {
    const game = openChest(0.1)
    run(game, idle, 60)
    run(game, { ...idle, jump: true }, 30)
    expect(game.coins).toBe(10)
  })
})
