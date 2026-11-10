// Turns the SVG drawings into pictures the game can paint on screen.
import { hero } from './hero.js'
import { enemy } from './enemy.js'
import { coin, heart, flag } from './items.js'
import { grass, dirt, platform, bonus, bonusUsed, spikes } from './tiles.js'
import { cloud, hills } from './background.js'

export const SVGS = { hero, enemy, coin, heart, flag, grass, dirt, platform, bonus, bonusUsed, spikes, cloud, hills }

// Adds a big width/height so drawings stay sharp when scaled (and so Safari draws them).
export function svgUrl(svg, sharpness = 3) {
  const [, , w, h] = svg.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number)
  const sized = svg.trim().replace('<svg ', `<svg width="${w * sharpness}" height="${h * sharpness}" `)
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(sized)
}

// Load every drawing as an <img>. Resolves to { hero: Image, coin: Image, ... }
export function loadArt() {
  const entries = Object.entries(SVGS).map(
    ([name, svg]) =>
      new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve([name, img])
        img.onerror = () => reject(new Error(`Could not load art: ${name}`))
        img.src = svgUrl(svg)
      }),
  )
  return Promise.all(entries).then(Object.fromEntries)
}
