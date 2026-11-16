import { afterEach, describe, expect, it, vi } from 'vitest'
import { GRID_W, GRID_H, STARTER, emptyPixels, floodFill, makePixelSvg, starterPixels } from './art/pixelHero.js'
import { HERO_SHAPES, makeHeroSvg } from './art/heroes/index.js'
import { defaultDesign, designToSvg, loadDesign, loadUnlocked } from './heroDesign.js'

afterEach(() => vi.unstubAllGlobals())

describe('pixel hero', () => {
  it('starter drawing fits the grid', () => {
    expect(STARTER).toHaveLength(GRID_H)
    STARTER.forEach((row) => expect(row).toHaveLength(GRID_W))
    expect(starterPixels().flat().some(Boolean)).toBe(true)
  })

  it('bucket fill paints only touching squares', () => {
    const pixels = emptyPixels()
    for (let y = 0; y < GRID_H; y++) pixels[y][8] = '#000' // a wall down the middle
    const filled = floodFill(pixels, 0, 0, '#f00')
    expect(filled[5][3]).toBe('#f00')
    expect(filled[5][12]).toBe(null)
    expect(pixels[5][3]).toBe(null) // the original is not changed (so Undo works)
  })

  it('makes an SVG with one square per painted pixel', () => {
    const pixels = emptyPixels()
    pixels[0][0] = '#f00'
    pixels[3][4] = '#0f0'
    const svg = makePixelSvg(pixels)
    expect(svg).toContain(`viewBox="0 0 ${GRID_W} ${GRID_H}"`)
    expect(svg.match(/<rect/g)).toHaveLength(2)
  })
})

describe.each(HERO_SHAPES.map((s) => [s.id, s]))('color-in %s', (id, shape) => {
  it('every part has a default color and appears in the drawing', () => {
    const svg = makeHeroSvg(id)
    expect(svg).toContain('viewBox="0 0 40 52"')
    for (const p of shape.parts) {
      expect(shape.colors[p.id]).toBeTruthy()
      expect(svg).toContain(`data-part="${p.id}"`)
    }
  })

  it('uses the chosen colors', () => {
    expect(makeHeroSvg(id, { fur: '#123456' })).toContain('#123456')
  })
})

describe('hero design', () => {
  it('loads saved hero data and costumes under the previous project keys', () => {
    const saved = new Map([
      ['anamikas-adventure-hero', JSON.stringify({ name: 'Pip', colors: {}, pixels: [] })],
      ['anamikas-adventure-costumes', '["wizard"]'],
    ])
    vi.stubGlobal('localStorage', { getItem: (key) => saved.get(key) ?? null })
    expect(loadDesign().name).toBe('Pip')
    expect(loadUnlocked()).toEqual(['wizard'])
  })

  it('turns either mode into an SVG', () => {
    const d = defaultDesign()
    expect(designToSvg(d)).toContain('data-part="fur"')
    expect(designToSvg({ ...d, mode: 'pixels' })).toContain('crispEdges')
    expect(designToSvg({ ...d, shape: 'dog' })).toContain('data-part="earTips"')
  })
})
