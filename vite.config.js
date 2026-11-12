import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // three.js (the 3D library) is big; that's fine for a game.
  build: { chunkSizeWarningLimit: 1000 },
})
