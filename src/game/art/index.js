// Turns the SVG drawings into pictures the game can paint on screen.
import { makeHeroSvg } from './heroes/index.js'
import { enemy } from './enemy.js'
import { coin, heart, flag } from './items.js'
import { grass, dirt, platform, bonus, bonusUsed, spikes } from './tiles.js'
import { cloud, hills } from './background.js'

const hero = makeHeroSvg('cat')

export const SVGS = { hero, enemy, coin, heart, flag, grass, dirt, platform, bonus, bonusUsed, spikes, cloud, hills }

// Adds a big width/height so drawings stay sharp when scaled (and so Safari draws them).
export function svgUrl(svg, sharpness = 3) {
  const [, , w, h] = svg.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number)
  const sized = svg.trim().replace('<svg ', `<svg width="${w * sharpness}" height="${h * sharpness}" `)
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(sized)
}

function loadImage(name, svg) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve([name, img])
    img.onerror = () => reject(new Error(`Could not load art: ${name}`))
    // Small drawings (like 16×20 pixel heroes) get extra sharpness so they don't look blurry.
    const width = Number(svg.match(/viewBox="[\d.]+ [\d.]+ ([\d.]+)/)[1])
    img.src = svgUrl(svg, Math.max(3, Math.ceil(160 / width)))
  })
}

// Load every drawing as an <img>. Pass `overrides` to swap one, e.g. { hero: myHeroSvg }.
// Resolves to { hero: Image, coin: Image, ... }
export function loadArt(overrides = {}) {
  const all = { ...SVGS, ...overrides }
  return Promise.all(Object.entries(all).map(([name, svg]) => loadImage(name, svg))).then(Object.fromEntries)
}
