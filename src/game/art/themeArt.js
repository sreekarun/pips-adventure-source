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
