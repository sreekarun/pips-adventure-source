// Puts a hero and a costume together into one picture (a canvas).
// The frame is 48×64: costume "under" layer, then the hero (40 wide, standing at the bottom), then "over".
export const FRAME_W = 48
export const FRAME_H = 64
export const HERO_W = 40

export function heroBox(img) {
  const h = (HERO_W * img.height) / img.width
  return { x: (FRAME_W - HERO_W) / 2, y: FRAME_H - h, w: HERO_W, h }
}

export function composeHero(heroImg, costume, scale = 6) {
  const canvas = document.createElement('canvas')
  canvas.width = FRAME_W * scale
  canvas.height = FRAME_H * scale
  const ctx = canvas.getContext('2d')
  ctx.scale(scale, scale)
  if (costume?.under) ctx.drawImage(costume.under, 0, 0, FRAME_W, FRAME_H)
  const box = heroBox(heroImg)
  ctx.drawImage(heroImg, box.x, box.y, box.w, box.h)
  if (costume?.over) ctx.drawImage(costume.over, 0, 0, FRAME_W, FRAME_H)
  return canvas
}
