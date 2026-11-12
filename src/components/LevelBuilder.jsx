import { useRef, useState } from 'react'
import { BUILDER_HEIGHT, BUILDER_TILES, levelProblems, mapToStrings, paintTile, widenMap } from '../game/levelBuilder.js'
import { THEMES, getTheme } from '../game/themes.js'

const TILE_INFO = Object.fromEntries(BUILDER_TILES.map((t) => [t.ch, t]))
const CELL = 30

// 🧱 Build your own level by painting tiles onto a grid.
export default function LevelBuilder({ level, onSave, onTest, onDelete, onBack }) {
  const [name, setName] = useState(level.name)
  const [theme, setTheme] = useState(level.theme)
  const [map, setMap] = useState(level.map)
  const [tile, setTile] = useState('#')
  const [saved, setSaved] = useState(false)
  const gridRef = useRef(null)
  const scrollRef = useRef(null)
  const painting = useRef(false)
  const current = useRef(null)

  const width = map[0].length
  const problems = levelProblems(map)
  const t = getTheme(theme)
  const asLevel = () => ({ ...level, name: name.trim() || 'My Level', theme, map: mapToStrings(map) })

  const cellAt = (e) => {
    const rect = gridRef.current.getBoundingClientRect()
    const x = Math.floor((e.clientX - rect.left) / CELL)
    const y = Math.floor((e.clientY - rect.top) / CELL)
    return x >= 0 && y >= 0 && x < width && y < BUILDER_HEIGHT ? { x, y } : null
  }
  const paint = (cell) => {
    if (!cell) return
    current.current = paintTile(current.current, cell.x, cell.y, tile)
    setMap(current.current)
    setSaved(false)
  }
  const scroll = (dx) => scrollRef.current?.scrollBy({ left: dx, behavior: 'smooth' })

  return (
    <div className="overlay sky scroll">
      <div className="card builder-card">
        <div className="map-header">
          <button className="small-button" onClick={onBack}>
            ◀ Back
          </button>
          <h2>🧱 Level builder</h2>
          <span />
        </div>

        <div className="builder-row">
          <label className="name-field">
            Name
            <input value={name} maxLength={24} onChange={(e) => (setName(e.target.value), setSaved(false))} />
          </label>
          <div className="tool-row">
            {Object.entries(THEMES).map(([id, th]) => (
              <button
                key={id}
                className={id === theme ? 'tool active' : 'tool'}
                onClick={() => (setTheme(id), setSaved(false))}
                title={th.name}
              >
                {th.emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="tool-row tile-tools">
          {BUILDER_TILES.map((b) => (
            <button key={b.ch} className={b.ch === tile ? 'tool active' : 'tool'} onClick={() => setTile(b.ch)}>
              {b.emoji} {b.name}
            </button>
          ))}
        </div>

        <div className="builder-grid-wrap">
          <button className="scroll-button" onClick={() => scroll(-300)} aria-label="Scroll left">
            ◀
          </button>
          <div className="builder-scroll" ref={scrollRef}>
            <div
              ref={gridRef}
              className="builder-grid"
              style={{
                width: width * CELL,
                gridTemplateColumns: `repeat(${width}, ${CELL}px)`,
                background: `linear-gradient(${t.skyTop}, ${t.skyBottom})`,
              }}
              onPointerDown={(e) => {
                e.preventDefault()
                current.current = map
                painting.current = true
                gridRef.current.setPointerCapture(e.pointerId)
                paint(cellAt(e))
              }}
              onPointerMove={(e) => painting.current && paint(cellAt(e))}
              onPointerUp={() => (painting.current = false)}
              onPointerCancel={() => (painting.current = false)}
            >
              {map.flatMap((row, y) =>
                row.map((ch, x) => (
                  <div
                    key={`${x}-${y}`}
                    className={`bcell ${ch === '#' ? (y > 0 && map[y - 1][x] === '#' ? 'tdirt' : 'tground') : ''}`}
                  >
                    {ch !== '.' && ch !== '#' ? TILE_INFO[ch]?.emoji : ''}
                  </div>
                )),
              )}
            </div>
          </div>
          <button className="scroll-button" onClick={() => scroll(300)} aria-label="Scroll right">
            ▶
          </button>
        </div>

        {problems.length > 0 && (
          <ul className="problems">
            {problems.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        )}

        <div className="tool-row">
          <button className="tool" onClick={() => setMap(widenMap(map))}>
            ➕ Make it longer
          </button>
          <button className="tool" disabled={problems.length > 0} onClick={() => onTest(asLevel())}>
            ▶ Test play
          </button>
          <button
            className="tool active"
            disabled={problems.length > 0}
            onClick={() => {
              onSave(asLevel())
              setSaved(true)
            }}
          >
            💾 {saved ? 'Saved!' : 'Save'}
          </button>
          {onDelete && (
            <button className="tool" onClick={() => onDelete(level)}>
              🗑️ Delete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
