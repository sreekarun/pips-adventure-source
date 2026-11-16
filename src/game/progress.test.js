import { afterEach, describe, expect, it, vi } from 'vitest'
import { buyLevel, defaultProgress, finishLevel, loadProgress, restartGame } from './progress.js'
import { SETTINGS } from './settings.js'
import { createGame, step } from './engine.js'

const ids = ['a', 'b']
const levelB = { id: 'b', price: 15 }

afterEach(() => vi.unstubAllGlobals())

describe('coin bank and worlds', () => {
  it('loads progress saved under the previous project key', () => {
    vi.stubGlobal('localStorage', {
      getItem: (key) => (key === 'anamikas-adventure-progress' ? '{"bank":12}' : null),
    })
    expect(loadProgress('a').bank).toBe(12)
  })

  it('banks coins after a level, even when you lose', () => {
    const { progress } = finishLevel(defaultProgress('a'), { levelId: 'a', coins: 7, won: false }, ids)
    expect(progress.bank).toBe(7)
    expect(progress.completed).toEqual([])
  })

  it('buys a level only with enough coins', () => {
    expect(buyLevel({ ...defaultProgress('a'), bank: 10 }, levelB)).toBeNull()
    const bought = buyLevel({ ...defaultProgress('a'), bank: 20 }, levelB)
    expect(bought.bank).toBe(5)
    expect(bought.unlockedLevels).toContain('b')
  })

  it('gives the big prize once for beating every world', () => {
    let p = { ...defaultProgress('a'), unlockedLevels: ids }
    let r = finishLevel(p, { levelId: 'a', coins: 0, won: true }, ids)
    expect(r.bonus).toBe(0)
    r = finishLevel(r.progress, { levelId: 'b', coins: 3, won: true }, ids)
    expect(r.bonus).toBe(SETTINGS.allLevelsBonus)
    expect(r.progress.champion).toBe(true)
    expect(r.progress.bank).toBe(3 + SETTINGS.allLevelsBonus)
    r = finishLevel(r.progress, { levelId: 'b', coins: 0, won: true }, ids)
    expect(r.bonus).toBe(0)
  })

  it('restart locks worlds but keeps coins and admin', () => {
    const p = restartGame({ ...defaultProgress('a'), bank: 50, champion: true, unlockedLevels: ids, completed: ids }, 'a')
    expect(p.unlockedLevels).toEqual(['a'])
    expect(p.completed).toEqual([])
    expect(p.bank).toBe(50)
    expect(p.champion).toBe(true)
  })
})

describe('admin super powers', () => {
  const flat = { name: 't', map: ['......', '......', '.P....', '##..##'] }
  const idle = { left: false, right: false, jump: false }

  it('fly lifts you up while holding jump', () => {
    const game = createGame(flat, SETTINGS, { powers: { fly: true } })
    for (let i = 0; i < 10; i++) step(game, idle)
    const y = game.hero.y
    for (let i = 0; i < 20; i++) step(game, { ...idle, jump: true })
    expect(game.hero.y).toBeLessThan(y - SETTINGS.tileSize)
  })

  it('never get hurt keeps your hearts in pits', () => {
    const game = createGame(flat, SETTINGS, { powers: { invincible: true } })
    for (let i = 0; i < 200; i++) step(game, { ...idle, right: true })
    expect(game.hearts).toBe(SETTINGS.hearts)
  })
})
