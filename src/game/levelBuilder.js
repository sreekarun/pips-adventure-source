// 🧱 Level builder logic (the screen is components/LevelBuilder.jsx).
// A map here is an array of rows, each row an array of one-letter tiles.

export const BUILDER_TILES = [
  { ch: '#', emoji: '🟫', name: 'Ground' },
  { ch: '=', emoji: '🧱', name: 'Platform' },
  { ch: 'o', emoji: '🪙', name: 'Coin' },
  { ch: 'B', emoji: '🧰', name: 'Treasure' },
  { ch: 'E', emoji: '👾', name: 'Enemy' },
  { ch: 'S', emoji: '🔺', name: 'Spikes' },
  { ch: 'P', emoji: '🐾', name: 'Start' },
  { ch: 'F', emoji: '🏁', name: 'Flag' },
  { ch: '.', emoji: '🧽', name: 'Eraser' },
]

export const BUILDER_HEIGHT = 12

export function newLevelMap(width = 60) {
  const map = Array.from({ length: BUILDER_HEIGHT }, (_, y) => Array(width).fill(y >= 10 ? '#' : '.'))
  map[9][2] = 'P'
  map[9][width - 5] = 'F'
  return map
}

export function mapFromStrings(rows) {
  return rows.map((r) => [...r])
}

export function mapToStrings(map) {
  return map.map((row) => row.join(''))
}

// Put a tile on the map. There can only be one start and one flag, so placing one moves it.
export function paintTile(map, x, y, ch) {
  if (map[y][x] === ch) return map
  const next = map.map((row) => [...row])
  if (ch === 'P' || ch === 'F') {
    for (const row of next) for (let i = 0; i < row.length; i++) if (row[i] === ch) row[i] = '.'
  }
  next[y][x] = ch
  return next
}

export function widenMap(map, extra = 10) {
  return map.map((row, y) => [...row, ...Array(extra).fill(y >= 10 ? '#' : '.')])
}

// Kid-friendly problems that stop a level from being playable.
export function levelProblems(map) {
  const flat = map.flat()
  const problems = []
  if (!flat.includes('P')) problems.push('Put a 🐾 Start somewhere so the hero knows where to begin.')
  if (!flat.includes('F')) problems.push('Put a 🏁 Flag somewhere so there’s a finish line.')
  return problems
}
