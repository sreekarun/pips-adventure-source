// 🧱 Blocks the world is built from. Each one is a 48×48 square.

// Grass on top (used when there is nothing above the ground block).
export const grass = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <rect width="48" height="48" fill="#b5713b"/>
  <circle cx="12" cy="30" r="3" fill="#9a5b2c"/><circle cx="34" cy="38" r="2.5" fill="#9a5b2c"/>
  <circle cx="38" cy="24" r="1.8" fill="#cf8c52"/>
  <path d="M0 0 H48 V14 Q42 19 36 14 Q30 19 24 14 Q18 19 12 14 Q6 19 0 14 Z" fill="#5cc94f"/>
  <path d="M0 0 H48 V6 H0 Z" fill="#7ee26f"/>
</svg>`

// Dirt (used for ground blocks under other ground blocks).
export const dirt = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <rect width="48" height="48" fill="#b5713b"/>
  <circle cx="10" cy="12" r="3" fill="#9a5b2c"/><circle cx="32" cy="30" r="3.5" fill="#9a5b2c"/>
  <circle cx="38" cy="10" r="2" fill="#cf8c52"/><circle cx="16" cy="38" r="2" fill="#cf8c52"/>
</svg>`

// Floating platform: a candy-striped brick.
export const platform = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <rect x="1" y="1" width="46" height="46" rx="6" fill="#ff8fab" stroke="#c9184a" stroke-width="2"/>
  <rect x="4" y="4" width="40" height="8" rx="4" fill="#ffc2d1"/>
  <path d="M1 24 H47 M24 24 V47 M12 1 V24 M36 1 V24" stroke="#c9184a" stroke-width="1.5" opacity="0.5"/>
</svg>`

// Treasure chest before it is bumped. Bump it from below for a surprise!
export const bonus = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <rect x="1" y="1" width="46" height="46" rx="5" fill="#b8692a" stroke="#5c2e0a" stroke-width="2"/>
  <rect x="1" y="1" width="46" height="17" rx="5" fill="#d4843d" stroke="#5c2e0a" stroke-width="2"/>
  <path d="M4 30 H44 M4 39 H44" stroke="#8f4f1c" stroke-width="1.5"/>
  <rect x="6" y="1" width="6" height="46" fill="#ffd23f" stroke="#c98a00" stroke-width="1"/>
  <rect x="36" y="1" width="6" height="46" fill="#ffd23f" stroke="#c98a00" stroke-width="1"/>
  <rect x="1" y="16" width="46" height="5" fill="#ffd23f" stroke="#c98a00" stroke-width="1"/>
  <rect x="18" y="13" width="12" height="14" rx="3" fill="#ffd23f" stroke="#c98a00" stroke-width="1.5"/>
  <circle cx="24" cy="19" r="2.2" fill="#5c2e0a"/>
  <path d="M23 20 H25 L25.6 24 H22.4 Z" fill="#5c2e0a"/>
  <path d="M16 6 h5" stroke="#f3b27a" stroke-width="2" stroke-linecap="round"/>
</svg>`

// Treasure chest after it is opened (empty and dull).
export const bonusUsed = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <rect x="1" y="1" width="46" height="46" rx="5" fill="#9c8b7a" stroke="#5a4a3c" stroke-width="2"/>
  <rect x="1" y="1" width="46" height="17" rx="5" fill="#ad9c8a" stroke="#5a4a3c" stroke-width="2"/>
  <rect x="6" y="1" width="6" height="46" fill="#c9bfae"/>
  <rect x="36" y="1" width="6" height="46" fill="#c9bfae"/>
  <rect x="1" y="16" width="46" height="5" fill="#c9bfae"/>
</svg>`

export const spikes = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <path d="M2 48 L10 24 L18 48 Z M16 48 L24 22 L32 48 Z M30 48 L38 24 L46 48 Z"
        fill="#dfe6ee" stroke="#5c677d" stroke-width="1.8" stroke-linejoin="round"/>
</svg>`
