// 🦸 The hero you make in the hero maker, and remembering it for next time.
import { DEFAULT_HERO_COLORS, makeHeroSvg } from './art/hero.js'
import { makePixelSvg, starterPixels } from './art/pixelHero.js'
import { SETTINGS } from './settings.js'

const STORAGE_KEY = 'anamikas-adventure-hero'

// mode 'color' = colored-in Pip, mode 'pixels' = painted pixel hero.
export function defaultDesign() {
  return {
    mode: 'color',
    name: SETTINGS.heroName,
    colors: { ...DEFAULT_HERO_COLORS },
    pixels: starterPixels(),
  }
}

export function designToSvg(design) {
  return design.mode === 'pixels' ? makePixelSvg(design.pixels) : makeHeroSvg(design.colors)
}

export function loadDesign() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (saved && saved.colors && Array.isArray(saved.pixels)) return { ...defaultDesign(), ...saved }
  } catch {
    // Nothing saved yet (or the browser blocks saving). Use the default hero.
  }
  return defaultDesign()
}

export function saveDesign(design) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(design))
  } catch {
    // Saving is a bonus; the game still works without it.
  }
}
