// Big on-screen buttons for tablets. Hidden on computers with a mouse (see index.css).
function Pad({ input, action, label, className }) {
  const set = (value) => (e) => {
    e.preventDefault()
    input.current[action] = value
  }
  return (
    <button
      className={`pad ${className}`}
      onPointerDown={set(true)}
      onPointerUp={set(false)}
      onPointerLeave={set(false)}
      onPointerCancel={set(false)}
      onContextMenu={(e) => e.preventDefault()}
      aria-label={action}
    >
      {label}
    </button>
  )
}

export default function TouchControls({ input }) {
  return (
    <div className="touch-controls">
      <div className="pad-group">
        <Pad input={input} action="left" label="◀" className="pad-move" />
        <Pad input={input} action="right" label="▶" className="pad-move" />
      </div>
      <Pad input={input} action="jump" label="⤒" className="pad-jump" />
    </div>
  )
}
