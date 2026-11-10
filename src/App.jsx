import { useState } from 'react'
import Game from './components/Game.jsx'
import { LEVELS } from './game/levels/index.js'
import { SETTINGS } from './game/settings.js'
import { SVGS, svgUrl } from './game/art/index.js'

const heroUrl = svgUrl(SVGS.hero)
const enemyUrl = svgUrl(SVGS.enemy)

// Screens: 'title' → 'playing' → 'won' or 'gameover'
// Shortcut for testing: open http://localhost:5173/?play=2 to jump straight into level 2.
const startLevel = Number(new URLSearchParams(window.location.search).get('play')) || 0

export default function App() {
  const [screen, setScreen] = useState(startLevel ? 'playing' : 'title')
  const [levelIndex, setLevelIndex] = useState(Math.min(Math.max(startLevel - 1, 0), LEVELS.length - 1))
  const [result, setResult] = useState(null)
  const [attempt, setAttempt] = useState(0)
  const [soundOn, setSoundOn] = useState(SETTINGS.soundOn)

  const play = (index) => {
    setLevelIndex(index)
    setAttempt((a) => a + 1)
    setScreen('playing')
  }

  const hasNext = levelIndex + 1 < LEVELS.length

  return (
    <div className="app">
      {screen === 'playing' && (
        <Game
          key={attempt}
          level={LEVELS[levelIndex]}
          levelNumber={levelIndex + 1}
          soundOn={soundOn}
          onToggleSound={() => setSoundOn((s) => !s)}
          onEnd={(r) => {
            setResult(r)
            setScreen(r.status)
          }}
        />
      )}

      {screen === 'title' && (
        <div className="overlay sky">
          <div className="card title-card">
            <img src={heroUrl} alt={SETTINGS.heroName} className="title-hero" />
            <h1>{SETTINGS.gameTitle}</h1>
            <p>
              Help <b>{SETTINGS.heroName}</b> collect coins and reach the flag!
            </p>
            <button className="big-button" onClick={() => play(0)}>
              ▶ Play
            </button>
            <p className="hint">Arrow keys to run · Space to jump · Jump on the Grumbles!</p>
            <img src={enemyUrl} alt="" className="title-enemy" />
          </div>
        </div>
      )}

      {screen === 'won' && (
        <div className="overlay">
          <div className="card">
            <div className="emoji">🎉</div>
            <h2>You did it!</h2>
            <p>
              Coins: <b>{result.coins}</b> / {result.total}
            </p>
            {hasNext ? (
              <button className="big-button" onClick={() => play(levelIndex + 1)}>
                Next level ▶
              </button>
            ) : (
              <button className="big-button" onClick={() => play(0)}>
                Play again
              </button>
            )}
            <button className="small-button" onClick={() => setScreen('title')}>
              Home
            </button>
          </div>
        </div>
      )}

      {screen === 'gameover' && (
        <div className="overlay">
          <div className="card">
            <div className="emoji">😺</div>
            <h2>Oops! Try again?</h2>
            <p>{SETTINGS.heroName} is ready for another go.</p>
            <button className="big-button" onClick={() => play(levelIndex)}>
              Try again
            </button>
            <button className="small-button" onClick={() => setScreen('title')}>
              Home
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
