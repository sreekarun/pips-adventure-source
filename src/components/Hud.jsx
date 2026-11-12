import { SVGS, svgUrl } from '../game/art/index.js'
import { SETTINGS } from '../game/settings.js'

const heartUrl = svgUrl(SVGS.heart)
const coinUrl = svgUrl(SVGS.coin)

// The bar at the top: hearts, coins, level name and buttons.
export default function Hud({ hearts, coins, levelName, powers, soundOn, onToggleSound, onPause }) {
  return (
    <div className="hud">
      <div className="hud-pill">
        {Array.from({ length: SETTINGS.hearts }, (_, i) => (
          <img key={i} src={heartUrl} alt="" className={i < hearts ? 'heart' : 'heart empty'} />
        ))}
      </div>
      <div className="hud-pill">
        <img src={coinUrl} alt="" className="coin-icon" />
        <span>{coins}</span>
      </div>
      <div className="hud-pill level-name">{levelName}</div>
      {powers && (powers.fly || powers.invincible || powers.speed) && (
        <div className="hud-pill" title="Super powers are on">
          {powers.fly && '🦅'}
          {powers.invincible && '🛡️'}
          {powers.speed && '⚡'}
        </div>
      )}
      <div className="hud-spacer" />
      <button className="hud-button" onClick={onToggleSound} aria-label="Sound on or off">
        {soundOn ? '🔊' : '🔇'}
      </button>
      <button className="hud-button" onClick={onPause} aria-label="Pause">
        ⏸
      </button>
    </div>
  )
}
