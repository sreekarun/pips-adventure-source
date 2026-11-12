import { getTheme } from '../game/themes.js'
import { SVGS, svgUrl } from '../game/art/index.js'

const coinUrl = svgUrl(SVGS.coin)

function Coins({ n }) {
  return (
    <span className="coins-inline">
      <img src={coinUrl} alt="" />
      {n}
    </span>
  )
}

// 🗺️ The world map: pick a world to play, or spend coins to unlock the next one.
export default function LevelMap({ levels, progress, onPlay, onBuy, onHome, onEditCustom }) {
  return (
    <div className="overlay sky scroll">
      <div className="card map-card">
        <div className="map-header">
          <button className="small-button" onClick={onHome}>
            ◀ Home
          </button>
          <h2>🗺️ World Map</h2>
          <div className="bank">
            🏦 <Coins n={progress.bank} />
          </div>
        </div>

        <div className="world-grid">
          {levels.map((level, i) => {
            const theme = getTheme(level.theme)
            const unlocked = progress.unlockedLevels.includes(level.id)
            const done = progress.completed.includes(level.id)
            const canBuy = progress.bank >= level.price
            return (
              <div
                key={level.id}
                className={unlocked ? 'world-card' : 'world-card locked'}
                style={{ background: `linear-gradient(${theme.skyTop}, ${theme.skyBottom})` }}
              >
                <div className="world-emoji">{unlocked ? theme.emoji : '🔒'}</div>
                <div className="world-name">
                  {i + 1}. {level.name}
                </div>
                {done && <div className="world-done">⭐ Beaten!</div>}
                {unlocked ? (
                  <button className="world-button" onClick={() => onPlay(level)}>
                    ▶ Play
                  </button>
                ) : (
                  <>
                    <button className="world-button buy" disabled={!canBuy} onClick={() => onBuy(level)}>
                      Unlock for <Coins n={level.price} />
                    </button>
                    {!canBuy && <div className="world-need">Need {level.price - progress.bank} more coins</div>}
                  </>
                )}
              </div>
            )
          })}
        </div>

        {progress.customLevels.length > 0 && (
          <>
            <h3 className="map-subtitle">🧱 My levels</h3>
            <div className="world-grid">
              {progress.customLevels.map((level) => {
                const theme = getTheme(level.theme)
                return (
                  <div
                    key={level.id}
                    className="world-card"
                    style={{ background: `linear-gradient(${theme.skyTop}, ${theme.skyBottom})` }}
                  >
                    <div className="world-emoji">{theme.emoji}</div>
                    <div className="world-name">{level.name}</div>
                    <button className="world-button" onClick={() => onPlay(level)}>
                      ▶ Play
                    </button>
                    {onEditCustom && (
                      <button className="small-button" onClick={() => onEditCustom(level)}>
                        ✏️ Edit
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
