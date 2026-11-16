// 🏦 PROGRESS — your coin bank, which worlds you've unlocked and beaten, and admin stuff.
// Saved in the browser so it's still there next time.
import { SETTINGS } from './settings.js'

const KEY = 'pips-adventure-progress'
const LEGACY_KEY = 'anamikas-adventure-progress'

export function defaultProgress(firstLevelId = 'school') {
  return {
    bank: 0, // coins saved up to spend on worlds
    unlockedLevels: [firstLevelId],
    completed: [], // level ids you've reached the flag on
    champion: false, // beat every world at least once → Admin and Spectate unlocked
    bonusClaimed: false, // got the "beat every world" coin prize this time around
    powers: { fly: false, invincible: false, speed: false },
    customLevels: [], // levels made in the level builder
  }
}

export function loadProgress(firstLevelId = 'school') {
  const base = defaultProgress(firstLevelId)
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? localStorage.getItem(LEGACY_KEY))
    if (saved && typeof saved === 'object') {
      const unlockedLevels = saved.unlockedLevels ?? []
      return {
        ...base,
        ...saved,
        powers: { ...base.powers, ...saved.powers },
        // The first world is always open, even if it was added after you started playing.
        unlockedLevels: unlockedLevels.includes(firstLevelId) ? unlockedLevels : [firstLevelId, ...unlockedLevels],
      }
    }
  } catch {
    // Nothing saved yet.
  }
  return base
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(progress))
  } catch {
    // Saving is a bonus.
  }
}

// Spend coins to unlock a level. Returns the new progress, or null if you can't afford it.
export function buyLevel(progress, level) {
  if (progress.unlockedLevels.includes(level.id)) return progress
  if (progress.bank < level.price) return null
  return { ...progress, bank: progress.bank - level.price, unlockedLevels: [...progress.unlockedLevels, level.id] }
}

// After a level ends: bank the coins, and mark it beaten if you won.
// allLevelIds = every built-in level. Returns { progress, bonus } where bonus > 0
// means you just beat every world and won the big prize.
export function finishLevel(progress, { levelId, coins, won }, allLevelIds) {
  let next = { ...progress, bank: progress.bank + coins }
  if (won && levelId && !next.completed.includes(levelId)) next.completed = [...next.completed, levelId]
  const beatAll = allLevelIds.every((id) => next.completed.includes(id))
  let bonus = 0
  if (won && beatAll && !next.bonusClaimed) {
    bonus = SETTINGS.allLevelsBonus
    next = { ...next, bank: next.bank + bonus, bonusClaimed: true, champion: true }
  }
  return { progress: next, bonus }
}

// "Restart the game": lock the worlds again, but keep your coins, costumes and admin powers.
export function restartGame(progress, firstLevelId = 'school') {
  return { ...progress, unlockedLevels: [firstLevelId], completed: [], bonusClaimed: false }
}
