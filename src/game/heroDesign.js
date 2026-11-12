// 🦸 The hero you make in the hero maker, and remembering it for next time.
import { defaultShapeColors, makeHeroSvg } from './art/heroes/index.js'
import { makePixelSvg, starterPixels } from './art/pixelHero.js'
import { SETTINGS } from './settings.js'

const STORAGE_KEY = 'anamikas-adventure-hero'

// mode 'color' = a colored-in shape (cat, dog...), mode 'pixels' = a painted pixel hero.
// colors keeps one set of colors per shape, so switching shapes doesn't lose your coloring.
export function defaultDesign() {
  return {
    mode: 'color',
    shape: 'cat',
    name: SETTINGS.heroName,
    colors: defaultShapeColors(),
    pixels: starterPixels(),
  }
}

export function designToSvg(design) {
  if (design.mode === 'pixels') return makePixelSvg(design.pixels)
  return makeHeroSvg(design.shape, design.colors[design.shape])
}

export function loadDesign() {
  const base = defaultDesign()
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (!saved || !saved.colors || !Array.isArray(saved.pixels)) return base
    // Older saves kept only the cat's colors.
    const colors = saved.colors.fur ? { cat: saved.colors } : saved.colors
    return { ...base, ...saved, colors: { ...base.colors, ...colors } }
  } catch {
    // Nothing saved yet (or the browser blocks saving). Use the default hero.
    return base
  }
}

export function saveDesign(design) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(design))
  } catch {
    // Saving is a bonus; the game still works without it.
  }
}
