// 🌍 The look of each world: ground blocks, platforms, background hills and enemy colors.
// Each world id here must match one in ../themes.js.
import { grass, dirt, platform } from './tiles.js'
import { hills } from './background.js'
import { enemy, enemySvg } from './enemy.js'

const svg = (inner, w = 48, h = 48) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${inner}</svg>`

// A ground block with a wavy top layer (snow, frosting, sand...).
function groundTop({ base, dark, light, top, topLight, extra = '' }) {
  return svg(`
    <rect width="48" height="48" fill="${base}"/>
    <circle cx="12" cy="30" r="3" fill="${dark}"/><circle cx="34" cy="38" r="2.5" fill="${dark}"/>
    <circle cx="38" cy="24" r="1.8" fill="${light}"/>
    <path d="M0 0 H48 V14 Q42 19 36 14 Q30 19 24 14 Q18 19 12 14 Q6 19 0 14 Z" fill="${top}"/>
    <path d="M0 0 H48 V6 H0 Z" fill="${topLight}"/>
    ${extra}`)
}

function groundFill({ base, dark, light, extra = '' }) {
  return svg(`
    <rect width="48" height="48" fill="${base}"/>
    <circle cx="10" cy="12" r="3" fill="${dark}"/><circle cx="32" cy="30" r="3.5" fill="${dark}"/>
    <circle cx="38" cy="10" r="2" fill="${light}"/><circle cx="16" cy="38" r="2" fill="${light}"/>
    ${extra}`)
}

function hillsSvg(back, front, dot1, dot2) {
  return svg(
    `<path d="M0 200 V120 Q64 40 128 100 Q192 160 256 90 Q320 20 384 90 Q448 150 512 120 V200 Z" fill="${back}"/>
     <path d="M0 200 V160 Q90 110 180 150 Q260 185 340 140 Q430 95 512 160 V200 Z" fill="${front}"/>
     <circle cx="300" cy="150" r="4" fill="${dot1}"/><circle cx="312" cy="156" r="3" fill="${dot2}"/>
     <circle cx="90" cy="168" r="3.5" fill="${dot1}"/><circle cx="460" cy="170" r="3" fill="${dot2}"/>`,
    512,
    200,
  )
}

const sprinkles = ['#4cc9f0', '#ffd23f', '#7ee26f', '#ffffff', '#9b5de5']
  .map((c, i) => `<rect x="${5 + i * 9}" y="${3 + (i % 2) * 4}" width="4" height="1.6" rx="0.8" fill="${c}" transform="rotate(${i * 37} ${7 + i * 9} ${4 + (i % 2) * 4})"/>`)
  .join('')

// 🐆 The Abbotts Hill Jaguar, cheering in a teal shirt (an original drawing).
const jaguar = svg(
  `
  <g stroke="#3b2a10" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">
    <path d="M15 58 Q3 52 7 40" fill="none" stroke="#3b2a10" stroke-width="7.5"/>
    <path d="M15 58 Q3 52 7 40" fill="none" stroke="#f4b942" stroke-width="4.5"/>
    <path d="M19 44 L9 29 M41 44 L51 29" fill="none" stroke="#3b2a10" stroke-width="8.5"/>
    <path d="M19 44 L9 29 M41 44 L51 29" fill="none" stroke="#f4b942" stroke-width="5.5"/>
    <ellipse cx="23" cy="66" rx="6" ry="3.6" fill="#f4b942"/>
    <ellipse cx="37" cy="66" rx="6" ry="3.6" fill="#f4b942"/>
    <rect x="16" y="38" width="28" height="26" rx="10" fill="#0f9d8f"/>
    <circle cx="18" cy="12" r="5.5" fill="#f4b942"/>
    <circle cx="42" cy="12" r="5.5" fill="#f4b942"/>
    <circle cx="30" cy="24" r="15" fill="#f4b942"/>
  </g>
  <circle cx="8" cy="26" r="6" fill="#14b8a6" stroke="#111827" stroke-width="1.5"/>
  <circle cx="52" cy="26" r="6" fill="#14b8a6" stroke="#111827" stroke-width="1.5"/>
  <path d="M5 23 l6 6 M11 23 l-6 6 M49 23 l6 6 M55 23 l-6 6" stroke="#111827" stroke-width="1.2"/>
  <text x="30" y="56" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" font-size="10" fill="#ffffff">AH</text>
  <circle cx="18" cy="12" r="2.5" fill="#3b2a10"/><circle cx="42" cy="12" r="2.5" fill="#3b2a10"/>
  <g fill="none" stroke="#3b2a10" stroke-width="1.2">
    <circle cx="21" cy="17" r="1.8"/><circle cx="39" cy="17" r="1.8"/><circle cx="30" cy="12.5" r="1.8"/>
    <circle cx="19" cy="27" r="1.5"/><circle cx="41" cy="27" r="1.5"/>
  </g>
  <ellipse cx="30" cy="30" rx="8" ry="6" fill="#fff4dc"/>
  <path d="M27.5 26.5 H32.5 L30 29.5 Z" fill="#3b2a10"/>
  <path d="M30 29.5 Q30 33 27 33.2 M30 29.5 Q30 33 33 33.2" fill="none" stroke="#3b2a10" stroke-width="1.2" stroke-linecap="round"/>
  <circle cx="24" cy="22" r="2.7" fill="#1f2937"/><circle cx="36" cy="22" r="2.7" fill="#1f2937"/>
  <circle cx="25" cy="21" r="1" fill="#fff"/><circle cx="37" cy="21" r="1" fill="#fff"/>
  <ellipse cx="20" cy="29" rx="2.4" ry="1.4" fill="#ff8fab" opacity="0.7"/>
  <ellipse cx="40" cy="29" rx="2.4" ry="1.4" fill="#ff8fab" opacity="0.7"/>`,
  60,
  72,
)

export const THEME_ART = {
  meadow: { top: grass, dirt, platform, hills, enemy },

  snow: {
    top: groundTop({ base: '#8fa3b8', dark: '#73879c', light: '#b4c4d4', top: '#f8fbff', topLight: '#ffffff',
      extra: '<path d="M8 14 q2 6 4 0 M30 14 q2 7 4 0" fill="#f8fbff"/>' }),
    dirt: groundFill({ base: '#8fa3b8', dark: '#73879c', light: '#b4c4d4' }),
    platform: svg(`
      <rect x="1" y="1" width="46" height="46" rx="6" fill="#bde0fe" stroke="#4895ef" stroke-width="2"/>
      <path d="M8 38 L22 8 M18 42 L34 10 M30 40 L40 20" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity="0.8"/>
      <rect x="4" y="4" width="40" height="6" rx="3" fill="#e7f5ff"/>`),
    hills: hillsSvg('#dbe7f3', '#f1f6fb', '#ffffff', '#cfe3f5'),
    enemy: enemySvg({ body: '#74c0fc', shine: '#e7f5ff', ink: '#0b3d66', outline: '#1864ab',
      extra: '<path d="M14 6 L12 0 L17 4 M26 6 L28 0 L23 4" stroke="#1864ab" stroke-width="1.5" fill="#d0ebff"/>' }),
  },

  candy: {
    top: groundTop({ base: '#f6c28b', dark: '#e9a96a', light: '#fbe0c0', top: '#ff8fab', topLight: '#ffc2d1', extra: sprinkles }),
    dirt: groundFill({ base: '#f6c28b', dark: '#e9a96a', light: '#fbe0c0',
      extra: '<rect y="20" width="48" height="6" fill="#fff1e6"/><rect y="25" width="48" height="2" fill="#e5383b"/>' }),
    platform: svg(`
      <rect x="1" y="1" width="46" height="46" rx="12" fill="#ffffff" stroke="#e5383b" stroke-width="2"/>
      <path d="M-4 20 L20 -4 M-4 38 L38 -4 M10 52 L52 10 M28 52 L52 28" stroke="#ff4d6d" stroke-width="7"/>
      <rect x="1" y="1" width="46" height="46" rx="12" fill="none" stroke="#c9184a" stroke-width="2"/>
      <ellipse cx="14" cy="10" rx="6" ry="2.5" fill="#fff" opacity="0.7"/>`),
    hills: hillsSvg('#ffc8dd', '#ffafcc', '#ffffff', '#cdb4db'),
    enemy: enemySvg({ body: '#f783ac', shine: '#ffdeeb', ink: '#5c0f2e', outline: '#a61e4d',
      extra: '<circle cx="20" cy="3.5" r="3" fill="#e5383b" stroke="#a61e4d" stroke-width="1"/>' }),
  },

  sea: {
    top: groundTop({ base: '#e3bf7f', dark: '#cfa564', light: '#f2d9a8', top: '#f9e4b7', topLight: '#fff3d6',
      extra: '<path d="M30 8 q3 -5 6 0 q-3 2 -6 0 Z" fill="#ffafcc" stroke="#e76f51" stroke-width="0.8"/>' }),
    dirt: groundFill({ base: '#e3bf7f', dark: '#cfa564', light: '#f2d9a8' }),
    platform: svg(`
      <rect x="1" y="1" width="46" height="46" rx="10" fill="#ff7f6e" stroke="#c44536" stroke-width="2"/>
      <circle cx="13" cy="14" r="4" fill="#ffb3a7"/><circle cx="32" cy="12" r="3" fill="#ffb3a7"/>
      <circle cx="24" cy="30" r="5" fill="#ffb3a7"/><circle cx="38" cy="36" r="3.5" fill="#ffb3a7"/>
      <circle cx="10" cy="36" r="2.5" fill="#ffb3a7"/>`),
    hills: hillsSvg('#2a9d8f', '#21867a', '#90e0ef', '#ff7f6e'),
    enemy: enemySvg({ body: '#38d9a9', shine: '#c3fae8', ink: '#063d2e', outline: '#087f5b',
      extra: '<path d="M8 30 q-2 4 0 6 M14 32 q-2 3 0 4 M26 32 q2 3 0 4 M32 30 q2 4 0 6" stroke="#087f5b" stroke-width="1.5" fill="none"/>' }),
  },

  school: {
    top: groundTop({ base: '#374151', dark: '#1f2937', light: '#4b5563', top: '#14b8a6', topLight: '#5eead4',
      extra: '<path d="M0 3 H48" stroke="#ffffff" stroke-width="1.2" stroke-dasharray="6 4" opacity="0.8"/>' }),
    dirt: svg(`
      <rect width="48" height="48" fill="#1f2937"/>
      <path d="M0 12 H48 M0 24 H48 M0 36 H48 M12 0 V12 M36 0 V12 M24 12 V24 M0 12 V24 M12 24 V36 M36 24 V36 M24 36 V48"
            stroke="#4b5563" stroke-width="2"/>`),
    platform: svg(`
      <rect x="1" y="2" width="46" height="14" rx="2" fill="#e63946" stroke="#111827" stroke-width="1.5"/>
      <rect x="3" y="17" width="43" height="14" rx="2" fill="#14b8a6" stroke="#111827" stroke-width="1.5"/>
      <rect x="1" y="32" width="46" height="14" rx="2" fill="#ffd23f" stroke="#111827" stroke-width="1.5"/>
      <path d="M8 2 V16 M40 2 V16 M10 17 V31 M39 17 V31 M8 32 V46 M40 32 V46" stroke="#111827" stroke-width="1" opacity="0.5"/>
      <rect x="15" y="6" width="18" height="5" rx="1" fill="#fff" opacity="0.85"/>
      <rect x="16" y="21" width="16" height="5" rx="1" fill="#fff" opacity="0.85"/>
      <rect x="15" y="36" width="18" height="5" rx="1" fill="#fff" opacity="0.85"/>`),
    hills: hillsSvg('#a7e3a0', '#84d27b', '#14b8a6', '#ffffff'),
    enemy: enemySvg({ body: '#f8f9fa', shine: '#ffffff', ink: '#212529', outline: '#6c757d',
      pattern: '<path d="M7 14 H33 M5 21 H35 M5 28 H35" stroke="#74c0fc" stroke-width="1.2"/><path d="M10 6 V32" stroke="#ff8fab" stroke-width="1.2"/>' }),
    mascot: jaguar,
  },

  space: {
    top: groundTop({ base: '#9a9aae', dark: '#7d7d93', light: '#bdbdcf', top: '#c9c9d9', topLight: '#e3e3ee',
      extra: '<ellipse cx="20" cy="9" rx="5" ry="2" fill="#a9a9bd"/>' }),
    dirt: groundFill({ base: '#9a9aae', dark: '#7d7d93', light: '#bdbdcf',
      extra: '<circle cx="24" cy="24" r="6" fill="#8a8aa0" stroke="#7d7d93" stroke-width="1.5"/>' }),
    platform: svg(`
      <rect x="1" y="1" width="46" height="46" rx="5" fill="#adb5bd" stroke="#495057" stroke-width="2"/>
      <rect x="1" y="20" width="46" height="8" fill="#3ec1d3"/>
      <rect x="1" y="22" width="46" height="4" fill="#a6ecf5"/>
      <circle cx="7" cy="7" r="2" fill="#495057"/><circle cx="41" cy="7" r="2" fill="#495057"/>
      <circle cx="7" cy="41" r="2" fill="#495057"/><circle cx="41" cy="41" r="2" fill="#495057"/>`),
    hills: hillsSvg('#3c2a6b', '#2d1f52', '#ffd23f', '#a6ecf5'),
    enemy: enemySvg({ body: '#94d82d', shine: '#d8f5a2', ink: '#1b4d1b', outline: '#2b8a3e',
      extra: '<path d="M14 7 L11 0 M26 7 L29 0" stroke="#2b8a3e" stroke-width="1.6"/><circle cx="11" cy="0.5" r="2" fill="#ffd23f"/><circle cx="29" cy="0.5" r="2" fill="#ffd23f"/>' }),
  },
}
