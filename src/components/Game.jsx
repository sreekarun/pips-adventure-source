import { useEffect, useRef, useState } from 'react'
import { createGame, step } from '../game/engine.js'
import { render } from '../game/render.js'
import { loadArt } from '../game/art/index.js'
import { playSound } from '../game/sounds.js'
import { SETTINGS } from '../game/settings.js'
import Hud from './Hud.jsx'
import TouchControls from './TouchControls.jsx'

const KEYS = {
  ArrowLeft: 'left',
  KeyA: 'left',
  ArrowRight: 'right',
  KeyD: 'right',
  ArrowUp: 'jump',
  KeyW: 'jump',
  Space: 'jump',
}

const FRAME = 1000 / 60

export default function Game({ level, levelNumber, heroSvg, soundOn, onToggleSound, onEnd }) {
  const canvasRef = useRef(null)
  const input = useRef({ left: false, right: false, jump: false })
  const paused = useRef(false)
  const soundRef = useRef(soundOn)
  const [hud, setHud] = useState(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    soundRef.current = soundOn
  }, [soundOn])

  const togglePause = () => {
    paused.current = !paused.current
    setIsPaused(paused.current)
  }

  // Keyboard
  useEffect(() => {
    const onKey = (down) => (e) => {
      if (e.code === 'Escape' || e.code === 'KeyP') {
        if (down) togglePause()
        return
      }
      const action = KEYS[e.code]
      if (!action) return
      e.preventDefault()
      input.current[action] = down
    }
    const keydown = onKey(true)
    const keyup = onKey(false)
    window.addEventListener('keydown', keydown)
    window.addEventListener('keyup', keyup)
    return () => {
      window.removeEventListener('keydown', keydown)
      window.removeEventListener('keyup', keyup)
    }
  }, [])

  // Game loop
  useEffect(() => {
    let raf = 0
    let stopped = false
    let endTimer = 0
    const game = createGame(level, SETTINGS)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const viewH = SETTINGS.viewTilesHigh * SETTINGS.tileSize
    let view = { w: viewH, h: viewH }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)
      view = { w: (viewH * rect.width) / rect.height, h: viewH }
      const scale = canvas.height / viewH
      ctx.setTransform(scale, 0, 0, scale, 0, 0)
      ctx.imageSmoothingQuality = 'high'
    }
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()

    const pushHud = () => setHud({ hearts: game.hearts, coins: game.coins, total: game.totalCoins })
    pushHud()

    loadArt({ hero: heroSvg }).then((art) => {
      if (stopped) return
      let last = performance.now()
      let acc = 0
      const loop = (now) => {
        acc += Math.min(now - last, 100)
        last = now
        while (acc >= FRAME) {
          acc -= FRAME
          if (paused.current) continue
          const before = game.status
          step(game, input.current)
          if (game.events.length) {
            if (soundRef.current) game.events.forEach(playSound)
            pushHud()
          }
          if (before === 'playing' && game.status !== 'playing') {
            endTimer = setTimeout(
              () => onEnd({ status: game.status, coins: game.coins, total: game.totalCoins }),
              game.status === 'won' ? 1200 : 900,
            )
          }
        }
        render(ctx, game, art, view.w, view.h)
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
    })

    return () => {
      stopped = true
      cancelAnimationFrame(raf)
      clearTimeout(endTimer)
      observer.disconnect()
    }
    // onEnd is intentionally left out: a new function each render must not restart the level.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, heroSvg])

  return (
    <div className="game">
      <canvas ref={canvasRef} className="game-canvas" />
      {hud && (
        <Hud
          {...hud}
          levelName={`${levelNumber}. ${level.name}`}
          soundOn={soundOn}
          onToggleSound={onToggleSound}
          onPause={togglePause}
        />
      )}
      {isPaused && (
        <div className="overlay">
          <div className="card">
            <h2>Paused</h2>
            <button className="big-button" onClick={togglePause}>
              Keep playing
            </button>
          </div>
        </div>
      )}
      <TouchControls input={input} />
    </div>
  )
}
