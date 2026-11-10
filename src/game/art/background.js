// ☁️ Background scenery. These slide slower than the level for a 3D feel.

export const cloud = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 70">
  <path d="M20 60 Q2 60 6 46 Q8 34 24 36 Q26 16 48 18 Q60 2 82 12 Q100 4 110 22 Q134 18 136 38 Q156 38 154 52 Q152 62 136 60 Z"
        fill="#ffffff" opacity="0.95"/>
  <path d="M20 60 H136 Q150 60 152 54 Q120 58 20 56 Z" fill="#dbeeff"/>
</svg>`

// Rolling hills, 512 wide so they repeat smoothly.
export const hills = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 200">
  <path d="M0 200 V120 Q64 40 128 100 Q192 160 256 90 Q320 20 384 90 Q448 150 512 120 V200 Z" fill="#a7e3a0"/>
  <path d="M0 200 V160 Q90 110 180 150 Q260 185 340 140 Q430 95 512 160 V200 Z" fill="#84d27b"/>
  <circle cx="300" cy="150" r="4" fill="#fff6a5"/><circle cx="312" cy="156" r="3" fill="#ffb3c7"/>
  <circle cx="90" cy="168" r="3.5" fill="#fff6a5"/><circle cx="460" cy="170" r="3" fill="#ffb3c7"/>
</svg>`
