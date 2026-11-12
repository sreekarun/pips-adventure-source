// 🔊 SOUNDS — little beeps made by the computer (no sound files needed).
// Each sound is a list of notes: [frequency, length in seconds].

const SOUNDS = {
  jump: { wave: 'square', notes: [[420, 0.05], [620, 0.07]], volume: 0.08 },
  coin: { wave: 'square', notes: [[988, 0.06], [1319, 0.12]], volume: 0.07 },
  stomp: { wave: 'triangle', notes: [[300, 0.05], [180, 0.08]], volume: 0.15 },
  bump: { wave: 'triangle', notes: [[140, 0.06]], volume: 0.15 },
  hurt: { wave: 'sawtooth', notes: [[400, 0.08], [250, 0.08], [160, 0.12]], volume: 0.06 },
  win: { wave: 'square', notes: [[523, 0.1], [659, 0.1], [784, 0.1], [1047, 0.3]], volume: 0.07 },
  empty: { wave: 'triangle', notes: [[330, 0.12], [247, 0.2]], volume: 0.12 },
  costume: { wave: 'square', notes: [[523, 0.07], [659, 0.07], [784, 0.07], [1047, 0.07], [1319, 0.25]], volume: 0.06 },
  gameover: { wave: 'triangle', notes: [[392, 0.15], [330, 0.15], [262, 0.35]], volume: 0.12 },
}

let audio = null

export function playSound(name) {
  const sound = SOUNDS[name]
  if (!sound) return
  try {
    audio ??= new (window.AudioContext || window.webkitAudioContext)()
    if (audio.state === 'suspended') audio.resume()
    let t = audio.currentTime
    for (const [freq, len] of sound.notes) {
      const osc = audio.createOscillator()
      const gain = audio.createGain()
      osc.type = sound.wave
      osc.frequency.value = freq
      gain.gain.setValueAtTime(sound.volume, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + len)
      osc.connect(gain).connect(audio.destination)
      osc.start(t)
      osc.stop(t + len)
      t += len
    }
  } catch {
    // Sound is optional — if the browser blocks it, keep playing quietly.
  }
}
