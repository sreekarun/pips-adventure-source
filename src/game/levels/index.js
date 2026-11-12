// The list of levels, in the order they appear on the world map. The first one is free.
// To add a level: copy one of these files, change its id, name, theme, price and map,
// then add it below.
import school from './school.js'
import meadow from './meadow.js'
import snow from './snow.js'
import candy from './candy.js'
import sea from './sea.js'
import space from './space.js'
import { SETTINGS } from '../settings.js'
import { getTheme } from '../themes.js'

export const LEVELS = [school, meadow, snow, candy, sea, space]

// The settings to play a level with: settings.js plus that world's physics (ice, water, moon...).
export function levelSettings(level) {
  return { ...SETTINGS, ...getTheme(level.theme).physics }
}
