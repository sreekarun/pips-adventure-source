// 🟦 Pixel-art heroes: a grid of little colored squares.

export const GRID_W = 16
export const GRID_H = 20

// The starter drawing (you can paint over it or press Clear).
// Each letter is a color from the key below. "." is see-through.
const KEY = {
  o: '#ff9f43', // orange fur
  d: '#4a2c14', // dark outline
  p: '#ffb3c7', // pink
  w: '#ffffff', // white
  k: '#2b2d42', // eyes
  r: '#e63946', // red scarf
  c: '#fff4e0', // cream belly
  f: '#e8742a', // feet
}
export const STARTER = [
  '................',
  '...d.......d....',
  '..dpd.....dpd...',
  '..dppdddddppd...',
  '.doooooooooood..',
  '.doooooooooood..',
  '.dookwoookwood..',
  '.dookkoookkood..',
  '.dppoooooooppd..',
  '.doooodddooood..',
  '..doooooooood...',
  '...ddddddddd....',
  '..drrrrrrrrrd...',
  '..doocccccoodr..',
  '..doocccccood.r.',
  '..dooocccoood...',
  '..doooooooood...',
  '...doooooood....',
  '...dffd.dffd....',
  '...dddd.dddd....',
]

export function starterPixels() {
  return STARTER.map((row) =>
    Array.from({ length: GRID_W }, (_, x) => KEY[row[x]] ?? null),
  )
}

export function emptyPixels() {
  return Array.from({ length: GRID_H }, () => Array(GRID_W).fill(null))
}

// Bucket fill: paint every touching square of the same color.
export function floodFill(pixels, x, y, color) {
  const target = pixels[y][x]
  if (target === color) return pixels
  const next = pixels.map((row) => [...row])
  const stack = [[x, y]]
  while (stack.length) {
    const [cx, cy] = stack.pop()
    if (cx < 0 || cy < 0 || cx >= GRID_W || cy >= GRID_H) continue
    if (next[cy][cx] !== target) continue
    next[cy][cx] = color
    stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1])
  }
  return next
}

export function makePixelSvg(pixels) {
  const rects = []
  pixels.forEach((row, y) =>
    row.forEach((color, x) => {
      if (color) rects.push(`<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${color}"/>`)
    }),
  )
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${GRID_W} ${GRID_H}" shape-rendering="crispEdges">${rects.join('')}</svg>`
}
