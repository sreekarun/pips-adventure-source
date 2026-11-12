import { useMemo, useRef, useState } from 'react'
import { PALETTE } from '../game/art/palette.js'
import { HERO_SHAPES, getShape, makeHeroSvg } from '../game/art/heroes/index.js'
import { GRID_W, GRID_H, emptyPixels, floodFill, starterPixels } from '../game/art/pixelHero.js'
import { designToSvg } from '../game/heroDesign.js'
import { COSTUMES } from '../game/costumes.js'
import HeroPicture from './HeroPicture.jsx'

// 🎨 The hero maker: color in a cat or dog, or paint your own pixel hero.
export default function HeroMaker({ design, unlocked, onPlay, onBack }) {
  const [draft, setDraft] = useState(design)
  const [color, setColor] = useState(PALETTE[8])
  const heroSvg = useMemo(() => designToSvg(draft), [draft])

  const update = (changes) => setDraft((d) => ({ ...d, ...changes }))

  return (
    <div className="overlay sky">
      <div className="card maker-card">
        <h2>🎨 Make your hero!</h2>

        <div className="tabs">
          <button className={draft.mode === 'color' ? 'tab active' : 'tab'} onClick={() => update({ mode: 'color' })}>
            🖍️ Color in
          </button>
          <button className={draft.mode === 'pixels' ? 'tab active' : 'tab'} onClick={() => update({ mode: 'pixels' })}>
            🟦 Paint pixels
          </button>
        </div>

        <div className="maker-body">
          <div className="maker-canvas">
            {draft.mode === 'color' ? (
              <ColorIn
                shape={draft.shape}
                colors={draft.colors}
                color={color}
                onShape={(shape) => update({ shape })}
                onChange={(colors) => update({ colors })}
              />
            ) : (
              <PixelPainter pixels={draft.pixels} color={color} onChange={(pixels) => update({ pixels })} />
            )}
          </div>

          <div className="maker-side">
            <Palette color={color} onPick={setColor} />

            <div className="game-preview">
              <HeroPicture heroSvg={heroSvg} costume={draft.costume} />
              <span>In the game</span>
            </div>

            <p className="costume-label">Costumes (find more in treasure chests!)</p>
            <div className="costume-row">
              <button className={!draft.costume ? 'tool active' : 'tool'} onClick={() => update({ costume: null })}>
                None
              </button>
              {COSTUMES.map((c) =>
                unlocked.includes(c.id) ? (
                  <button
                    key={c.id}
                    className={draft.costume === c.id ? 'tool active' : 'tool'}
                    onClick={() => update({ costume: c.id })}
                  >
                    {c.emoji} {c.name}
                  </button>
                ) : (
                  <button key={c.id} className="tool locked" disabled title="Find it in a treasure chest!">
                    🔒 ???
                  </button>
                ),
              )}
            </div>

            <label className="name-field">
              Name
              <input
                value={draft.name}
                maxLength={14}
                onChange={(e) => update({ name: e.target.value })}
                placeholder="Hero name"
              />
            </label>

            <button className="big-button" onClick={() => onPlay({ ...draft, name: draft.name.trim() || 'Hero' })}>
              ▶ Play!
            </button>
            <button className="small-button" onClick={onBack}>
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Palette({ color, onPick }) {
  return (
    <div className="palette">
      {PALETTE.map((c) => (
        <button
          key={c}
          className={c === color ? 'swatch picked' : 'swatch'}
          style={{ background: c }}
          onClick={() => onPick(c)}
          aria-label={`Color ${c}`}
        />
      ))}
    </div>
  )
}

// Pick a hero shape, then tap a part of it to paint it with the picked color.
function ColorIn({ shape, colors, color, onShape, onChange }) {
  const current = getShape(shape)
  const shapeColors = { ...current.colors, ...colors[shape] }
  const svg = makeHeroSvg(shape, shapeColors)
  const setShapeColors = (c) => onChange({ ...colors, [shape]: c })
  const paint = (part) => setShapeColors({ ...shapeColors, [part]: color })

  const surprise = () => {
    const pick = () => PALETTE[Math.floor(Math.random() * PALETTE.length)]
    setShapeColors(Object.fromEntries(current.parts.map((p) => [p.id, pick()])))
  }

  return (
    <div className="color-in">
      <div className="tool-row">
        {HERO_SHAPES.map((s) => (
          <button key={s.id} className={s.id === shape ? 'tool active' : 'tool'} onClick={() => onShape(s.id)}>
            {s.label}
          </button>
        ))}
      </div>
      <div
        className="color-in-hero"
        dangerouslySetInnerHTML={{ __html: svg }}
        onClick={(e) => {
          const part = e.target.closest('[data-part]')?.dataset.part
          if (part) paint(part)
        }}
      />
      <p className="maker-tip">Pick a color, then tap your hero!</p>
      <div className="part-chips">
        {current.parts.map((p) => (
          <button key={p.id} className="chip" onClick={() => paint(p.id)}>
            <span className="chip-dot" style={{ background: shapeColors[p.id] }} />
            {p.label}
          </button>
        ))}
      </div>
      <div className="tool-row">
        <button className="tool" onClick={surprise}>
          🎲 Surprise me
        </button>
        <button className="tool" onClick={() => setShapeColors({ ...current.colors })}>
          ↺ Start over
        </button>
      </div>
    </div>
  )
}

// Paint squares by tapping or dragging.
function PixelPainter({ pixels, color, onChange }) {
  const [tool, setTool] = useState('paint')
  const [history, setHistory] = useState([])
  const gridRef = useRef(null)
  const painting = useRef(false)
  // The drawing while a brush stroke is happening (updates faster than React re-renders).
  const stroke = useRef(null)

  const remember = () => setHistory((h) => [...h.slice(-30), pixels])

  const cellAt = (e) => {
    const rect = gridRef.current.getBoundingClientRect()
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * GRID_W)
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * GRID_H)
    return x >= 0 && y >= 0 && x < GRID_W && y < GRID_H ? { x, y } : null
  }

  const apply = (cell) => {
    if (!cell) return
    const value = tool === 'erase' ? null : color
    if (stroke.current[cell.y][cell.x] === value) return
    const next = stroke.current.map((row) => [...row])
    next[cell.y][cell.x] = value
    stroke.current = next
    onChange(next)
  }

  const onDown = (e) => {
    e.preventDefault()
    const cell = cellAt(e)
    if (!cell) return
    remember()
    if (tool === 'fill') {
      onChange(floodFill(pixels, cell.x, cell.y, color))
      return
    }
    stroke.current = pixels
    painting.current = true
    gridRef.current.setPointerCapture(e.pointerId)
    apply(cell)
  }

  const replace = (next) => {
    remember()
    onChange(next)
  }

  const undo = () => {
    if (!history.length) return
    onChange(history[history.length - 1])
    setHistory((h) => h.slice(0, -1))
  }

  return (
    <div className="pixel-painter">
      <div
        ref={gridRef}
        className="pixel-grid"
        style={{ gridTemplateColumns: `repeat(${GRID_W}, 1fr)` }}
        onPointerDown={onDown}
        onPointerMove={(e) => painting.current && apply(cellAt(e))}
        onPointerUp={() => (painting.current = false)}
        onPointerCancel={() => (painting.current = false)}
      >
        {pixels.flatMap((row, y) =>
          row.map((c, x) => <div key={`${x}-${y}`} className="pixel" style={c ? { background: c } : undefined} />),
        )}
      </div>
      <div className="tool-row">
        <button className={tool === 'paint' ? 'tool active' : 'tool'} onClick={() => setTool('paint')}>
          ✏️ Paint
        </button>
        <button className={tool === 'fill' ? 'tool active' : 'tool'} onClick={() => setTool('fill')}>
          🪣 Fill
        </button>
        <button className={tool === 'erase' ? 'tool active' : 'tool'} onClick={() => setTool('erase')}>
          🧽 Eraser
        </button>
      </div>
      <div className="tool-row">
        <button className="tool" onClick={undo} disabled={!history.length}>
          ↶ Undo
        </button>
        <button className="tool" onClick={() => replace(emptyPixels())}>
          🗑️ Clear
        </button>
        <button className="tool" onClick={() => replace(starterPixels())}>
          🐱 Pip
        </button>
      </div>
    </div>
  )
}
