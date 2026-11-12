import { useEffect, useRef, useState } from 'react'
import { createGame, step } from '../game/engine.js'
import { createRenderer3D } from '../game/render3d.js'
import { costumeImages, loadArt } from '../game/art/index.js'
import { composeHero } from '../game/art/composeHero.js'
import { getCostume } from '../game/costumes.js'
import { playSound } from '../game/sounds.js'
import { levelSettings } from '../game/levels/index.js'
import { botInput, createBrain } from '../game/bot.js'
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

// What the message bubble says when you open a treasure chest.
function rewardMessage(reward) {
  if (!reward) return null
  if (reward.kind === 'costume') {
    const c = getCostume(reward.id)
    return `${c.emoji} You found the ${c.name} costume!`
  }
  if (reward.kind === 'coins') {
    if (reward.amount >= 10) return `🤩 WOW! ${reward.amount} coins!`
    return reward.amount === 1 ? '🪙 1 coin' : `🪙 ${reward.amount} coins!`
  }
  return '💨 Empty! Maybe next time…'
}

// bot = { name } makes a computer player play instead of you (Spectate mode).
export default function Game({
  level,
  label,
  heroSvg,
  costume,
  unlocked,
  powers,
  bot,
  soundOn,
  onToggleSound,
  onCostume,
  onEnd,
  children,
}) {
  const canvasRef = useRef(null)
  const input = useRef({ left: false, right: false, jump: false })
  const paused = useRef(false)
  const soundRef = useRef(soundOn)
  // Read these once when the level starts (changing them mid-level must not restart it).
  const startRef = useRef({ costume, unlocked, powers, bot, onCostume, onEnd })
  const [hud, setHud] = useState(null)
  const [toast, setToast] = useState(null)
  const [isPaused, setIsPaused] = useState(false)
  const [error, setError] = useState(null)

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
    let toastTimer = 0
    let renderer = null
    let observer = null
    const start = startRef.current
    const game = createGame(level, levelSettings(level), {
      costume: start.costume,
      unlocked: start.unlocked,
      powers: start.bot ? {} : start.powers,
    })
    const brain = start.bot ? createBrain() : null
    // ?at=90 in the address starts the hero at column 90 (for testing the end of a level).
    const at = Number(new URLSearchParams(window.location.search).get('at'))
    if (at && !start.bot) {
      game.hero.x = at * game.T
      game.hero.y = 0
    }
    const canvas = canvasRef.current

    const pushHud = () => setHud({ hearts: game.hearts, coins: game.coins })
    pushHud()

    loadArt({ hero: heroSvg }).then((art) => {
      if (stopped) return
      try {
        // ?nointro in the address skips the opening camera swoop (for testing).
        const intro = !new URLSearchParams(window.location.search).has('nointro')
        renderer = createRenderer3D(canvas, game, art, { intro, theme: level.theme })
      } catch (err) {
        console.error(err)
        setError('This game needs 3D graphics (WebGL), and this browser could not start them.')
        return
      }
      const dressHero = () => renderer.setHero(composeHero(art.hero, costumeImages(art, game.costume)))
      dressHero()

      const resize = () => {
        const rect = canvas.getBoundingClientRect()
        if (rect.width && rect.height) renderer.resize(rect.width, rect.height)
      }
      observer = new ResizeObserver(resize)
      observer.observe(canvas)
      resize()

      let last = performance.now()
      let acc = 0
      const loop = (now) => {
        acc += Math.min(now - last, 100)
        last = now
        const events = []
        while (acc >= FRAME) {
          acc -= FRAME
          if (paused.current) continue
          const before = game.status
          step(game, brain ? botInput(game, brain) : input.current)
          events.push(...game.events)
          if (before === 'playing' && game.status !== 'playing') {
            endTimer = setTimeout(
              () => start.onEnd({ status: game.status, coins: game.coins }),
              game.status === 'won' ? 2200 : 1400,
            )
          }
        }
        if (events.length) {
          if (soundRef.current) events.forEach(playSound)
          renderer.handleEvents(events)
          pushHud()
          if (events.includes('treasure')) {
            setToast(rewardMessage(game.lastReward))
            clearTimeout(toastTimer)
            toastTimer = setTimeout(() => setToast(null), 2400)
          }
          if (events.includes('costume')) {
            dressHero()
            start.onCostume?.(game.costume)
          }
        }
        renderer.render()
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
    })

    return () => {
      stopped = true
      cancelAnimationFrame(raf)
      clearTimeout(endTimer)
      clearTimeout(toastTimer)
      observer?.disconnect()
      renderer?.dispose()
    }
  }, [level, heroSvg])

  return (
    <div className="game">
      <canvas ref={canvasRef} className="game-canvas" />
      {hud && (
        <Hud
          {...hud}
          levelName={label}
          powers={bot ? null : powers}
          soundOn={soundOn}
          onToggleSound={onToggleSound}
          onPause={togglePause}
        />
      )}
      {toast && (
        <div className="toast" key={toast}>
          {toast}
        </div>
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
      {error && (
        <div className="overlay">
          <div className="card">
            <h2>Oh no!</h2>
            <p>{error}</p>
          </div>
        </div>
      )}
      {!bot && <TouchControls input={input} />}
      {children}
    </div>
  )
}
