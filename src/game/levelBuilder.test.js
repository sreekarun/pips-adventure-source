import { describe, expect, it } from 'vitest'
import { levelProblems, mapToStrings, newLevelMap, paintTile, widenMap } from './levelBuilder.js'
import { createGame, step } from './engine.js'
import { SETTINGS } from './settings.js'

describe('level builder', () => {
  it('starts with ground, a start and a flag', () => {
    const map = newLevelMap(30)
    expect(map).toHaveLength(12)
    expect(levelProblems(map)).toEqual([])
    expect(map[11].every((c) => c === '#')).toBe(true)
  })

  it('moves the start instead of making two', () => {
    const map = paintTile(newLevelMap(30), 10, 9, 'P')
    expect(map.flat().filter((c) => c === 'P')).toHaveLength(1)
    expect(map[9][10]).toBe('P')
  })

  it('complains when the flag is missing', () => {
    const map = newLevelMap(30)
    const flagX = map[9].indexOf('F')
    expect(levelProblems(paintTile(map, flagX, 9, '.'))).toHaveLength(1)
  })

  it('makes levels the game can play', () => {
    const level = { name: 'built', map: mapToStrings(widenMap(newLevelMap(20), 10)) }
    expect(level.map[0]).toHaveLength(30)
    const game = createGame(level, SETTINGS)
    for (let i = 0; i < 600 && game.status === 'playing'; i++) step(game, { left: false, right: true, jump: false })
    expect(game.status).toBe('won')
  })
})
