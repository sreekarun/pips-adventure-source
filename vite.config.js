import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// 🔒 The PUBLIC web version (npm run build:pages) swaps real names for made-up ones,
// so the game on the internet doesn't show who made it or which school it's about.
// The game on this computer (npm run dev) keeps the real names.
// scripts/deploy-pages.sh refuses to publish if any word in PRIVATE_WORDS is left in the build.
export const PUBLIC_NAMES = [
  ["Anamika's Adventure", "Pip's Adventure"],
  ['anamikas-adventure', 'pips-adventure'],
  ['Abbotts Hill Elementary', 'Jaguar Elementary'],
  ['ABBOTTS HILL', 'JAGUAR'],
  ['Together We Make a Difference!', 'Go Jaguars, go!'],
  ['>AH</text>', '>JE</text>'],
]
export const PRIVATE_WORDS = ['anamika', 'abbott', 'together we make', 'fulton', '>AH<']

function publicNames() {
  const swap = (text) => PUBLIC_NAMES.reduce((t, [real, made]) => t.split(real).join(made), text)
  return {
    name: 'public-names',
    enforce: 'pre',
    transform: (code, id) => (id.includes('/src/') ? { code: swap(code), map: null } : null),
    transformIndexHtml: swap,
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(mode === 'pages' ? [publicNames()] : [])],
  // GitHub Pages serves the game from https://<user>.github.io/pips-adventure/
  base: mode === 'pages' ? '/pips-adventure/' : '/',
  // three.js (the 3D library) is big; that's fine for a game.
  build: { chunkSizeWarningLimit: 1000 },
}))
