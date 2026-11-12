import { describe, expect, it } from 'vitest'
import { GRID_W, GRID_H, STARTER, emptyPixels, floodFill, makePixelSvg, starterPixels } from './art/pixelHero.js'
import { HERO_PARTS, DEFAULT_HERO_COLORS, makeHeroSvg } from './art/hero.js'
import { defaultDesign, designToSvg } from './heroDesign.js'

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

describe('color-in hero', () => {
  it('every part has a default color and appears in the drawing', () => {
    const svg = makeHeroSvg(DEFAULT_HERO_COLORS)
    for (const p of HERO_PARTS) {
      expect(DEFAULT_HERO_COLORS[p.id]).toBeTruthy()
      expect(svg).toContain(`data-part="${p.id}"`)
    }
  })

  it('uses the chosen colors', () => {
    expect(makeHeroSvg({ ...DEFAULT_HERO_COLORS, scarf: '#123456' })).toContain('#123456')
  })
})

describe('hero design', () => {
  it('turns either mode into an SVG', () => {
    const d = defaultDesign()
    expect(designToSvg(d)).toContain('data-part="fur"')
    expect(designToSvg({ ...d, mode: 'pixels' })).toContain('crispEdges')
  })
})
