// 🎨 RENDERER — paints the game onto the canvas every frame.

export function getCamera(game, viewW, viewH) {
  const { hero, world, T } = game
  const maxX = Math.max(0, world.width * T - viewW)
  const maxY = Math.max(0, world.height * T - viewH)
  const x = Math.min(maxX, Math.max(0, hero.x + hero.w / 2 - viewW * 0.4))
  const y = Math.min(maxY, Math.max(0, hero.y + hero.h / 2 - viewH / 2))
  return { x, y }
}

export function render(ctx, game, art, viewW, viewH) {
  const { world, hero, T, settings: s, time } = game
  const cam = getCamera(game, viewW, viewH)

  // Sky
  const sky = ctx.createLinearGradient(0, 0, 0, viewH)
  sky.addColorStop(0, s.skyTop)
  sky.addColorStop(1, s.skyBottom)
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, viewW, viewH)

  // Sun
  ctx.fillStyle = 'rgba(255, 236, 140, 0.9)'
  ctx.beginPath()
  ctx.arc(viewW - 110, 90, 46, 0, Math.PI * 2)
  ctx.fill()

  // Clouds (drift slowly) and hills (parallax)
  drawRepeating(ctx, art.cloud, cam.x * 0.15 - time * 0.2, 40, 220, 96, 520, viewW)
  drawRepeating(ctx, art.cloud, cam.x * 0.25 + 260, 140, 160, 70, 640, viewW)
  drawRepeating(ctx, art.hills, cam.x * 0.4, viewH - 250 - cam.y * 0.4, 640, 250, 640, viewW)

  ctx.save()
  ctx.translate(-Math.round(cam.x), -Math.round(cam.y))

  // Tiles
  const tx0 = Math.floor(cam.x / T)
  const tx1 = Math.ceil((cam.x + viewW) / T)
  const ty0 = Math.floor(cam.y / T)
  const ty1 = Math.ceil((cam.y + viewH) / T)
  for (let ty = ty0; ty <= ty1; ty++) {
    for (let tx = tx0; tx <= tx1; tx++) {
      if (ty < 0 || ty >= world.height || tx < 0 || tx >= world.width) continue
      const img = tileImage(world, tx, ty, art)
      // Ground overlaps by 1px so no thin lines show between blocks.
      const pad = world.grid[ty][tx] === '#' ? 1 : 0
      if (img) ctx.drawImage(img, tx * T, ty * T, T + pad, T + pad)
    }
  }

  // Flag
  if (world.flag) ctx.drawImage(art.flag, world.flag.x, world.flag.y - T * 4, T, T * 4)

  // Coins (bob up and down)
  for (const c of world.coins) {
    if (c.taken) continue
    const bob = Math.sin(time * 0.08 + c.x * 0.05) * 3
    const squeeze = Math.abs(Math.cos(time * 0.05 + c.x)) * 0.5 + 0.5
    const size = 28
    ctx.drawImage(art.coin, c.x - (size * squeeze) / 2, c.y - size / 2 + bob, size * squeeze, size)
  }

  // Enemies
  for (const e of world.enemies) {
    if (e.dead) continue
    const squishing = e.squish > 0
    const h = squishing ? e.h * 0.35 : e.h * (1 + Math.sin(time * 0.2 + e.x) * 0.04)
    drawFlipped(ctx, art.enemy, e.x, e.y + e.h - h, e.w, h, e.vx > 0)
  }

  // Hero (blinks while invincible)
  const blink = hero.invincible > 0 && Math.floor(time / 4) % 2 === 0
  if (!blink) {
    const running = hero.onGround && Math.abs(hero.vx) > 0.5
    const bob = running ? Math.abs(Math.sin(time * 0.35)) * -3 : 0
    const stretch = hero.onGround ? 1 : 1.06
    const w = 40
    const h = w * (art.hero.height / art.hero.width) * stretch
    const x = hero.x + hero.w / 2 - w / 2
    const y = hero.y + hero.h - h + 2 + bob
    drawFlipped(ctx, art.hero, x, y, w, h, hero.facing < 0)
  }

  // Particles
  for (const p of game.particles) {
    if (p.kind === 'coin') {
      ctx.drawImage(art.coin, p.x - 14, p.y - 28, 28, 28)
    } else if (p.kind === 'sparkle') {
      ctx.fillStyle = `rgba(255, 230, 90, ${p.life / 20})`
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2
        const d = (20 - p.life) * 1.6
        ctx.beginPath()
        ctx.arc(p.x + Math.cos(a) * d, p.y + Math.sin(a) * d, 3, 0, Math.PI * 2)
        ctx.fill()
      }
    } else if (p.kind === 'puff') {
      ctx.fillStyle = `rgba(255, 255, 255, ${p.life / 18})`
      ctx.beginPath()
      ctx.arc(p.x, p.y, (18 - p.life) * 1.5 + 8, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  ctx.restore()
}

function tileImage(world, tx, ty, art) {
  switch (world.grid[ty][tx]) {
    case '#':
      return ty > 0 && world.grid[ty - 1][tx] === '#' ? art.dirt : art.grass
    case '=':
      return art.platform
    case 'B':
      return art.bonus
    case 'b':
      return art.bonusUsed
    case 'S':
      return art.spikes
    default:
      return null
  }
}

function drawFlipped(ctx, img, x, y, w, h, flip) {
  if (!flip) {
    ctx.drawImage(img, x, y, w, h)
    return
  }
  ctx.save()
  ctx.translate(x + w, y)
  ctx.scale(-1, 1)
  ctx.drawImage(img, 0, 0, w, h)
  ctx.restore()
}

function drawRepeating(ctx, img, offset, y, w, h, gap, viewW) {
  const start = -(((offset % gap) + gap) % gap)
  for (let x = start - gap; x < viewW + gap; x += gap) ctx.drawImage(img, x, y, w, h)
}
