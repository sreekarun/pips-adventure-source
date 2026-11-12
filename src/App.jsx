import { useMemo, useState } from 'react'
import Game from './components/Game.jsx'
import HeroMaker from './components/HeroMaker.jsx'
import { LEVELS } from './game/levels/index.js'
import { SETTINGS } from './game/settings.js'
import { SVGS, svgUrl } from './game/art/index.js'
import { designToSvg, loadDesign, saveDesign } from './game/heroDesign.js'

const enemyUrl = svgUrl(SVGS.enemy)

// Screens: 'title' → ('maker') → 'playing' → 'won' or 'gameover'
// Shortcuts for testing: http://localhost:5173/?play=2 jumps straight into level 2,
// and http://localhost:5173/?maker (or ?maker=pixels / ?maker=dog) opens the hero maker.
const params = new URLSearchParams(window.location.search)
const startLevel = Number(params.get('play')) || 0
const startScreen = startLevel ? 'playing' : params.has('maker') ? 'maker' : 'title'

export default function App() {
  const [screen, setScreen] = useState(startScreen)
  const [levelIndex, setLevelIndex] = useState(Math.min(Math.max(startLevel - 1, 0), LEVELS.length - 1))
  const [result, setResult] = useState(null)
  const [attempt, setAttempt] = useState(0)
  const [soundOn, setSoundOn] = useState(SETTINGS.soundOn)
  const [design, setDesign] = useState(() =>
    params.get('maker') === 'pixels'
      ? { ...loadDesign(), mode: 'pixels' }
      : params.get('maker') === 'dog'
        ? { ...loadDesign(), mode: 'color', shape: 'dog' }
        : loadDesign(),
  )
  const heroSvg = useMemo(() => designToSvg(design), [design])
  const heroUrl = useMemo(() => svgUrl(heroSvg, 12), [heroSvg])

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
          heroSvg={heroSvg}
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
            <img src={heroUrl} alt={design.name} className="title-hero" />
            <h1>{SETTINGS.gameTitle}</h1>
            <p>
              Help <b>{design.name}</b> collect coins and reach the flag!
            </p>
            <button className="big-button" onClick={() => play(0)}>
              ▶ Play
            </button>
            <button className="big-button maker-button" onClick={() => setScreen('maker')}>
              🎨 Make your hero
            </button>
            <p className="hint">Arrow keys to run · Space to jump · Jump on the Grumbles!</p>
            <img src={enemyUrl} alt="" className="title-enemy" />
          </div>
        </div>
      )}

      {screen === 'maker' && (
        <HeroMaker
          design={design}
          onBack={() => setScreen('title')}
          onPlay={(d) => {
            setDesign(d)
            saveDesign(d)
            play(0)
          }}
        />
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
            <p>{design.name} is ready for another go.</p>
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
