// The list of levels, in the order they appear on the world map.
// To add a level: copy level2.js to a new file, change its id, name, theme, price and map,
// then add it below.
import level1 from './level1.js'
import level2 from './level2.js'
import level3 from './level3.js'
import level4 from './level4.js'
import level5 from './level5.js'
import { SETTINGS } from '../settings.js'
import { getTheme } from '../themes.js'

export const LEVELS = [level1, level2, level3, level4, level5]

// The settings to play a level with: settings.js plus that world's physics (ice, water, moon...).
export function levelSettings(level) {
  return { ...SETTINGS, ...getTheme(level.theme).physics }
}
