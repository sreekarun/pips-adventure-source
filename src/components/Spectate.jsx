import { useMemo, useState } from 'react'
import Game from './Game.jsx'
import { BOT_NAMES } from '../game/bot.js'
import { HERO_SHAPES, makeHeroSvg } from '../game/art/heroes/index.js'
import { PALETTE } from '../game/art/palette.js'
import { COSTUMES } from '../game/costumes.js'

const CHEERS = ['🎉', '👏', '⭐', '💖', '🙌', '🤩']
const pick = (list) => list[Math.floor(Math.random() * list.length)]

// A random computer player with a random look.
function randomPlayer(levels) {
  const shape = pick(HERO_SHAPES)
  const colors = Object.fromEntries(shape.parts.map((p) => [p.id, pick(PALETTE)]))
  colors.eyes = '#2b2d42'
  return {
    name: pick(BOT_NAMES),
    level: pick(levels),
    heroSvg: makeHeroSvg(shape.id, colors),
    costume: Math.random() < 0.5 ? pick(COSTUMES).id : null,
    id: Math.random(),
  }
}

// 👀 Watch silly computer players play the levels.
export default function Spectate({ levels, soundOn, onToggleSound, onExit }) {
  const [player, setPlayer] = useState(() => randomPlayer(levels))
  const [cheers, setCheers] = useState([])
  const [result, setResult] = useState(null)
  const next = () => {
    setResult(null)
    setPlayer(randomPlayer(levels))
  }
  const bot = useMemo(() => ({ name: player.name }), [player])

  const cheer = () => {
    const id = Math.random()
    setCheers((c) => [...c, { id, emoji: pick(CHEERS), left: 20 + Math.random() * 60 }])
    setTimeout(() => setCheers((c) => c.filter((x) => x.id !== id)), 1600)
  }

  return (
    <Game
      key={player.id}
      level={player.level}
      label={`👀 ${player.name} · ${player.level.name}`}
      heroSvg={player.heroSvg}
      costume={player.costume}
      unlocked={[]}
      bot={bot}
      soundOn={soundOn}
      onToggleSound={onToggleSound}
      onEnd={(r) => {
        setResult(r.status === 'won' ? `🎉 ${player.name} reached the flag!` : `😅 Oops! ${player.name} needs more practice.`)
        const id = player.id
        setTimeout(() => {
          setResult(null)
          setPlayer((p) => (p.id === id ? randomPlayer(levels) : p)) // unless you already skipped ahead
        }, 2500)
      }}
    >
      <div className="spectate-bar">
        <button className="tool" onClick={cheer}>
          🎉 Cheer!
        </button>
        <button className="tool" onClick={next}>
          ⏭ Next player
        </button>
        <button className="tool" onClick={onExit}>
          ✖ Exit
        </button>
      </div>
      {result && <div className="toast">{result}</div>}
      {cheers.map((c) => (
        <div key={c.id} className="cheer" style={{ left: `${c.left}%` }}>
          {c.emoji}
        </div>
      ))}
    </Game>
  )
}
