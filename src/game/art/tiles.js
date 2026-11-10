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

// Bonus box before it is bumped: a gift with a bow.
export const bonus = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <rect x="1" y="1" width="46" height="46" rx="7" fill="#3ec1d3" stroke="#147a8a" stroke-width="2"/>
  <rect x="20" y="1" width="8" height="46" fill="#ffd23f"/>
  <rect x="1" y="20" width="46" height="8" fill="#ffd23f"/>
  <circle cx="24" cy="24" r="6" fill="#ffb703" stroke="#c98a00" stroke-width="1.5"/>
  <rect x="5" y="5" width="10" height="5" rx="2.5" fill="#a6ecf5"/>
</svg>`

// Bonus box after it is bumped (empty).
export const bonusUsed = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <rect x="1" y="1" width="46" height="46" rx="7" fill="#b8b2a7" stroke="#7a736a" stroke-width="2"/>
  <circle cx="9" cy="9" r="2" fill="#7a736a"/><circle cx="39" cy="9" r="2" fill="#7a736a"/>
  <circle cx="9" cy="39" r="2" fill="#7a736a"/><circle cx="39" cy="39" r="2" fill="#7a736a"/>
</svg>`

export const spikes = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <path d="M2 48 L10 24 L18 48 Z M16 48 L24 22 L32 48 Z M30 48 L38 24 L46 48 Z"
        fill="#dfe6ee" stroke="#5c677d" stroke-width="1.8" stroke-linejoin="round"/>
</svg>`
