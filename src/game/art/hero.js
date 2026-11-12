// 🐱 The hero: Pip, a brave little cat with a scarf.
// Drawn facing RIGHT (the game flips it when running left).
// Each part has a color you can change in the "Color in" hero maker.

export const HERO_PARTS = [
  { id: 'fur', label: 'Fur' },
  { id: 'innerEar', label: 'Inside ears' },
  { id: 'belly', label: 'Belly' },
  { id: 'scarf', label: 'Scarf' },
  { id: 'feet', label: 'Feet' },
  { id: 'eyes', label: 'Eyes' },
  { id: 'cheeks', label: 'Cheeks' },
]

export const DEFAULT_HERO_COLORS = {
  fur: '#ff9f43',
  innerEar: '#ffb3c7',
  belly: '#fff4e0',
  scarf: '#e63946',
  feet: '#e8742a',
  eyes: '#2b2d42',
  cheeks: '#ff7aa2',
}

const OUTLINE = '#4a2c14'

export function makeHeroSvg(colors = DEFAULT_HERO_COLORS) {
  const c = { ...DEFAULT_HERO_COLORS, ...colors }
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 52">
  <g stroke="${OUTLINE}" stroke-width="1.6" stroke-linejoin="round">
    <path data-part="fur" d="M6 30 Q-2 26 2 18" fill="none" stroke="${c.fur}" stroke-width="4" stroke-linecap="round"/>
    <ellipse data-part="feet" cx="13" cy="48" rx="5" ry="3.2" fill="${c.feet}"/>
    <ellipse data-part="feet" cx="27" cy="48" rx="5" ry="3.2" fill="${c.feet}"/>
    <rect data-part="fur" x="8" y="28" width="24" height="19" rx="9" fill="${c.fur}"/>
    <ellipse data-part="belly" cx="21" cy="39" rx="7" ry="6" fill="${c.belly}" stroke="none"/>
    <path data-part="fur" d="M7 15 L9 2 L18 10 Z" fill="${c.fur}"/>
    <path data-part="fur" d="M33 15 L31 2 L22 10 Z" fill="${c.fur}"/>
    <circle data-part="fur" cx="20" cy="18" r="13" fill="${c.fur}"/>
  </g>
  <path data-part="innerEar" d="M10 11 L11 6 L15 9.5 Z" fill="${c.innerEar}"/>
  <path data-part="innerEar" d="M30 11 L29 6 L25 9.5 Z" fill="${c.innerEar}"/>
  <rect data-part="scarf" x="9" y="27" width="22" height="5" rx="2.5" fill="${c.scarf}"/>
  <path data-part="scarf" d="M28 30 L34 36 L29 37 Z" fill="${c.scarf}"/>
  <circle data-part="eyes" cx="17" cy="17" r="3" fill="${c.eyes}"/>
  <circle data-part="eyes" cx="26" cy="17" r="3" fill="${c.eyes}"/>
  <circle cx="18" cy="16" r="1.1" fill="#fff" pointer-events="none"/>
  <circle cx="27" cy="16" r="1.1" fill="#fff" pointer-events="none"/>
  <ellipse data-part="cheeks" cx="13" cy="22" rx="2.6" ry="1.6" fill="${c.cheeks}" opacity="0.7"/>
  <ellipse data-part="cheeks" cx="30" cy="22" rx="2.6" ry="1.6" fill="${c.cheeks}" opacity="0.7"/>
  <path d="M20 21 L22 21 L21 22.4 Z" fill="#c2185b" pointer-events="none"/>
  <path d="M18.5 23.5 Q21 26 23.5 23.5" fill="none" stroke="${OUTLINE}" stroke-width="1.3" stroke-linecap="round" pointer-events="none"/>
</svg>`
}

export const hero = makeHeroSvg()
