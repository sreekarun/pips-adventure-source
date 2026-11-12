// 🟣 The enemy: a Grumble, a grumpy jelly blob. Jump on it to squish it!
// Each world has its own colors (see themeArt.js). `extra` adds things like antennae.
// `pattern` is drawn on top of the body (stripes, lines...).
export function enemySvg({ body = '#9b5de5', shine = '#c9a4f5', ink = '#2b1048', outline = '#4a1d7a', extra = '', pattern = '' } = {}) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 36">
  ${extra}
  <path d="M3 33 Q2 8 20 4 Q38 8 37 33 Q33 30 29 33 Q25 30 20 33 Q15 30 11 33 Q7 30 3 33 Z"
        fill="${body}" stroke="${outline}" stroke-width="1.8" stroke-linejoin="round"/>
  ${pattern}
  <ellipse cx="13" cy="12" rx="4" ry="2.5" fill="${shine}" opacity="0.8"/>
  <path d="M9 14 L17 17" stroke="${ink}" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M31 14 L23 17" stroke="${ink}" stroke-width="2.2" stroke-linecap="round"/>
  <circle cx="14" cy="20" r="3.4" fill="#fff"/>
  <circle cx="26" cy="20" r="3.4" fill="#fff"/>
  <circle cx="14.6" cy="20.6" r="1.8" fill="${ink}"/>
  <circle cx="25.4" cy="20.6" r="1.8" fill="${ink}"/>
  <path d="M15 28 Q20 25 25 28" fill="none" stroke="${ink}" stroke-width="1.8" stroke-linecap="round"/>
</svg>`
}

export const enemy = enemySvg()
