import { useMemo, useState } from 'react'
import Game from './components/Game.jsx'
import HeroMaker from './components/HeroMaker.jsx'
import HeroPicture from './components/HeroPicture.jsx'
import LevelMap from './components/LevelMap.jsx'
import AdminPanel from './components/AdminPanel.jsx'
import LevelBuilder from './components/LevelBuilder.jsx'
import Spectate from './components/Spectate.jsx'
import { LEVELS } from './game/levels/index.js'
import { SETTINGS } from './game/settings.js'
import { SVGS, svgUrl } from './game/art/index.js'
import { getTheme } from './game/themes.js'
import { designToSvg, loadDesign, loadUnlocked, saveDesign, saveUnlocked } from './game/heroDesign.js'
import { buyLevel, finishLevel, loadProgress, restartGame, saveProgress } from './game/progress.js'
import { mapFromStrings, newLevelMap } from './game/levelBuilder.js'

const enemyUrl = svgUrl(SVGS.enemy)
const LEVEL_IDS = LEVELS.map((l) => l.id)
const newCustomLevel = () => ({ id: `custom-${Date.now()}`, name: 'My Level', theme: 'meadow', price: 0, map: newLevelMap() })

// Screens: title → map → playing → won / gameover → map
//          title → maker (hero maker)
//          champion (beat every world!) → restart / admin / spectate
//          admin → builder (level builder)
//
// Shortcuts for testing:
//   ?play=2         jump straight into level 2 (add &nointro to skip the camera swoop)
//   ?maker, ?maker=pixels, ?maker=dog   open the hero maker
//   ?screen=map / champion / admin / builder / spectate   open that screen
const params = new URLSearchParams(window.location.search)
const startLevel = Number(params.get('play')) || 0
const startScreen = startLevel ? 'playing' : params.has('maker') ? 'maker' : (params.get('screen') ?? 'title')

export default function App() {
  const [screen, setScreen] = useState(startScreen)
  const [level, setLevel] = useState(LEVELS[Math.min(Math.max(startLevel - 1, 0), LEVELS.length - 1)])
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
  const [unlocked, setUnlocked] = useState(loadUnlocked)
  const [progress, setProgressState] = useState(() => loadProgress(LEVEL_IDS[0]))
  const [editing, setEditing] = useState(newCustomLevel)
  const [testing, setTesting] = useState(false) // playing a level from the builder
  const heroSvg = useMemo(() => designToSvg(design), [design])

  const setProgress = (update) =>
    setProgressState((p) => {
      const next = typeof update === 'function' ? update(p) : update
      saveProgress(next)
      return next
    })

  // Found a costume in a treasure chest: remember it and put it on.
  const foundCostume = (id) => {
    setUnlocked((list) => {
      const next = list.includes(id) ? list : [...list, id]
      saveUnlocked(next)
      return next
    })
    setDesign((d) => {
      const next = { ...d, costume: id }
      saveDesign(next)
      return next
    })
  }

  const play = (lvl) => {
    setLevel(lvl)
    setAttempt((a) => a + 1)
    setScreen('playing')
  }

  const levelEnded = (r) => {
    if (testing) {
      setResult(r)
      setScreen(r.status)
      return
    }
    const builtIn = LEVEL_IDS.includes(level.id)
    const { progress: next, bonus } = finishLevel(
      progress,
      { levelId: builtIn ? level.id : null, coins: r.coins, won: r.status === 'won' },
      LEVEL_IDS,
    )
    setProgress(next)
    setResult({ ...r, bonus })
    setScreen(bonus > 0 ? 'champion' : r.status)
  }

  const afterLevel = () => {
    if (testing) {
      setTesting(false)
      setScreen('builder')
    } else {
      setScreen('map')
    }
  }

  const levelNumber = LEVEL_IDS.indexOf(level.id) + 1
  const label = levelNumber > 0 ? `${levelNumber}. ${level.name}` : `🧱 ${level.name}`

  return (
    <div className="app">
      {screen === 'playing' && (
        <Game
          key={attempt}
          level={level}
          label={label}
          heroSvg={heroSvg}
          costume={design.costume}
          unlocked={unlocked}
          powers={progress.champion ? progress.powers : null}
          onCostume={foundCostume}
          soundOn={soundOn}
          onToggleSound={() => setSoundOn((s) => !s)}
          onEnd={levelEnded}
        />
      )}

      {screen === 'title' && (
        <div className="overlay sky scroll">
          <div className="card title-card">
            <HeroPicture heroSvg={heroSvg} costume={design.costume} className="title-hero" />
            <h1>{SETTINGS.gameTitle}</h1>
            <p>
              Help <b>{design.name}</b> collect coins and explore every world!
            </p>
            <button className="big-button" onClick={() => setScreen('map')}>
              ▶ Play
            </button>
            <button className="big-button maker-button" onClick={() => setScreen('maker')}>
              🎨 Make your hero
            </button>
            {progress.champion && (
              <div className="tool-row champion-row">
                <button className="tool" onClick={() => setScreen('admin')}>
                  🛠️ Admin
                </button>
                <button className="tool" onClick={() => setScreen('spectate')}>
                  👀 Spectate
                </button>
              </div>
            )}
            <p className="hint">Arrow keys to run · Space to jump · Bump treasure chests for surprises!</p>
            <img src={enemyUrl} alt="" className="title-enemy" />
          </div>
        </div>
      )}

      {screen === 'map' && (
        <LevelMap
          levels={LEVELS}
          progress={progress}
          onHome={() => setScreen('title')}
          onPlay={play}
          onBuy={(lvl) => {
            const next = buyLevel(progress, lvl)
            if (next) setProgress(next)
          }}
          onEditCustom={
            progress.champion
              ? (lvl) => {
                  setEditing(lvl)
                  setScreen('builder')
                }
              : null
          }
        />
      )}

      {screen === 'maker' && (
        <HeroMaker
          design={design}
          unlocked={unlocked}
          onBack={() => setScreen('title')}
          onPlay={(d) => {
            setDesign(d)
            saveDesign(d)
            setScreen('map')
          }}
        />
      )}

      {screen === 'won' && (
        <div className="overlay">
          <div className="card">
            <div className="emoji">🎉</div>
            <h2>You did it!</h2>
            {getTheme(level.theme).winMessage && <p className="win-message">{getTheme(level.theme).winMessage}</p>}
            <p>
              You collected <b>{result.coins}</b> coins!
              {!testing && (
                <>
                  <br />
                  🏦 Bank: <b>{progress.bank}</b> coins
                </>
              )}
            </p>
            <button className="big-button" onClick={afterLevel}>
              {testing ? '◀ Back to building' : '🗺️ World map'}
            </button>
            <button className="small-button" onClick={() => play(level)}>
              Play again
            </button>
          </div>
        </div>
      )}

      {screen === 'gameover' && (
        <div className="overlay">
          <div className="card">
            <div className="emoji">😺</div>
            <h2>Oops! Try again?</h2>
            <p>
              {design.name} is ready for another go.
              {!testing && result?.coins > 0 && (
                <>
                  <br />
                  You still keep your <b>{result.coins}</b> coins!
                </>
              )}
            </p>
            <button className="big-button" onClick={() => play(level)}>
              Try again
            </button>
            <button className="small-button" onClick={afterLevel}>
              {testing ? '◀ Back to building' : '🗺️ World map'}
            </button>
          </div>
        </div>
      )}

      {screen === 'champion' && (
        <div className="overlay sky scroll">
          <div className="card champion-card">
            <div className="emoji">🏆</div>
            <h2>You beat every world!</h2>
            <p>
              Here’s a prize: <b>+{result?.bonus || SETTINGS.allLevelsBonus} coins!</b> 🪙
              <br />
              What do you want to do now?
            </p>
            <button
              className="big-button"
              onClick={() => {
                setProgress((p) => restartGame(p, LEVEL_IDS[0]))
                setScreen('map')
              }}
            >
              🔄 Restart the game
            </button>
            <p className="choice-help">Lock the worlds again and play from the start. You keep your coins and costumes.</p>
            <button className="big-button maker-button" onClick={() => setScreen('admin')}>
              🛠️ Admin
            </button>
            <p className="choice-help">Super powers and the level builder.</p>
            <button className="big-button gold-button" onClick={() => setScreen('spectate')}>
              👀 Spectate
            </button>
            <p className="choice-help">Watch silly computer players try the levels.</p>
            <button className="small-button" onClick={() => setScreen('title')}>
              Home
            </button>
          </div>
        </div>
      )}

      {screen === 'admin' && (
        <AdminPanel
          progress={progress}
          onTogglePower={(id) => setProgress((p) => ({ ...p, powers: { ...p.powers, [id]: !p.powers[id] } }))}
          onGiveCoins={() => setProgress((p) => ({ ...p, bank: p.bank + 100 }))}
          onBuilder={() => {
            setEditing(newCustomLevel())
            setScreen('builder')
          }}
          onHome={() => setScreen('title')}
        />
      )}

      {screen === 'builder' && (
        <LevelBuilder
          key={editing.id}
          level={{ ...editing, map: Array.isArray(editing.map[0]) ? editing.map : mapFromStrings(editing.map) }}
          onBack={() => setScreen(progress.champion ? 'admin' : 'title')}
          onTest={(lvl) => {
            setEditing(lvl)
            setTesting(true)
            play(lvl)
          }}
          onSave={(lvl) => {
            setEditing(lvl)
            setProgress((p) => ({ ...p, customLevels: [...p.customLevels.filter((l) => l.id !== lvl.id), lvl] }))
          }}
          onDelete={
            progress.customLevels.some((l) => l.id === editing.id)
              ? (lvl) => {
                  setProgress((p) => ({ ...p, customLevels: p.customLevels.filter((l) => l.id !== lvl.id) }))
                  setScreen('map')
                }
              : null
          }
        />
      )}

      {screen === 'spectate' && (
        <Spectate
          levels={[...LEVELS, ...progress.customLevels]}
          soundOn={soundOn}
          onToggleSound={() => setSoundOn((s) => !s)}
          onExit={() => setScreen('title')}
        />
      )}
    </div>
  )
}
