// 🛠️ Admin: super powers and the level builder. Unlocked by beating every world.
const POWERS = [
  { id: 'fly', emoji: '🦅', name: 'Fly', help: 'Hold jump to fly up!' },
  { id: 'invincible', emoji: '🛡️', name: 'Never get hurt', help: 'Enemies, spikes and pits can’t hurt you.' },
  { id: 'speed', emoji: '⚡', name: 'Super speed', help: 'Run almost twice as fast.' },
]

export default function AdminPanel({ progress, onTogglePower, onGiveCoins, onBuilder, onHome }) {
  return (
    <div className="overlay sky scroll">
      <div className="card admin-card">
        <h2>🛠️ Admin</h2>
        <p>Super powers work on every level. Turn them on or off any time!</p>

        <div className="power-list">
          {POWERS.map((p) => {
            const on = progress.powers[p.id]
            return (
              <button key={p.id} className={on ? 'power on' : 'power'} onClick={() => onTogglePower(p.id)}>
                <span className="power-emoji">{p.emoji}</span>
                <span className="power-text">
                  <b>{p.name}</b>
                  <small>{p.help}</small>
                </span>
                <span className="switch">{on ? 'ON' : 'OFF'}</span>
              </button>
            )
          })}
        </div>

        <button className="big-button gold-button" onClick={onGiveCoins}>
          🪙 Give me 100 coins
        </button>
        <button className="big-button maker-button" onClick={onBuilder}>
          🧱 Level builder
        </button>
        <button className="small-button" onClick={onHome}>
          ◀ Home
        </button>
      </div>
    </div>
  )
}
