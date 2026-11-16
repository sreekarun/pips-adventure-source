// 🐶 A tiny puppy: white-ish tan fur with black tips on its floppy ears.
// (Designed by Pip!) Drawn facing RIGHT.

const OUTLINE = '#5a4632'

export const dog = {
  id: 'dog',
  label: '🐶 Dog',
  parts: [
    { id: 'fur', label: 'Fur' },
    { id: 'earTips', label: 'Ear tips' },
    { id: 'belly', label: 'Belly & snout' },
    { id: 'scarf', label: 'Collar' },
    { id: 'feet', label: 'Paws' },
    { id: 'eyes', label: 'Eyes' },
    { id: 'nose', label: 'Nose' },
    { id: 'cheeks', label: 'Cheeks' },
  ],
  colors: {
    fur: '#f1dfc2',
    earTips: '#2b2d42',
    belly: '#fffaf0',
    scarf: '#4361ee',
    feet: '#e6cfa8',
    eyes: '#2b2d42',
    nose: '#2b2d42',
    cheeks: '#ffb3c7',
  },
  draw: (c) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 52">
  <g stroke="${OUTLINE}" stroke-width="1.6" stroke-linejoin="round">
    <path d="M8 33 Q2 31 4.5 23" fill="none" stroke="${OUTLINE}" stroke-width="6.6" stroke-linecap="round"/>
    <path data-part="fur" d="M8 33 Q2 31 4.5 23" fill="none" stroke="${c.fur}" stroke-width="3.6" stroke-linecap="round"/>
    <ellipse data-part="feet" cx="13" cy="48" rx="5" ry="3.2" fill="${c.feet}"/>
    <ellipse data-part="feet" cx="27" cy="48" rx="5" ry="3.2" fill="${c.feet}"/>
    <rect data-part="fur" x="8" y="28" width="24" height="19" rx="9" fill="${c.fur}"/>
    <ellipse data-part="belly" cx="21" cy="39" rx="7" ry="6" fill="${c.belly}" stroke="none"/>
    <circle data-part="fur" cx="20" cy="18" r="13" fill="${c.fur}"/>
    <ellipse data-part="belly" cx="24" cy="23" rx="7" ry="5" fill="${c.belly}" stroke="none"/>
    <path data-part="fur" d="M9 8 Q2 11 3 23 Q4.5 28.5 9.5 25.5 Q11.5 18 13 10 Z" fill="${c.fur}"/>
    <path data-part="fur" d="M31 8 Q38 11 37 23 Q35.5 28.5 30.5 25.5 Q28.5 18 27 10 Z" fill="${c.fur}"/>
  </g>
  <path data-part="earTips" d="M3.1 20.5 Q3 27.6 6.4 27.6 Q9 27.4 10.1 23.2 Q6.4 22.6 3.1 20.5 Z" fill="${c.earTips}"/>
  <path data-part="earTips" d="M36.9 20.5 Q37 27.6 33.6 27.6 Q31 27.4 29.9 23.2 Q33.6 22.6 36.9 20.5 Z" fill="${c.earTips}"/>
  <rect data-part="scarf" x="9" y="27" width="22" height="4.5" rx="2.2" fill="${c.scarf}" stroke="${OUTLINE}" stroke-width="1"/>
  <circle cx="22" cy="33.2" r="2.3" fill="#ffd23f" stroke="#c98a00" stroke-width="1" pointer-events="none"/>
  <circle data-part="eyes" cx="17" cy="16" r="3" fill="${c.eyes}"/>
  <circle data-part="eyes" cx="25.5" cy="16" r="3" fill="${c.eyes}"/>
  <circle cx="18" cy="15" r="1.1" fill="#fff" pointer-events="none"/>
  <circle cx="26.5" cy="15" r="1.1" fill="#fff" pointer-events="none"/>
  <ellipse data-part="nose" cx="25.5" cy="21" rx="2.6" ry="1.8" fill="${c.nose}"/>
  <path d="M25.5 22.6 Q25.3 25 23 25.3 M25.5 22.6 Q25.8 25 28 25.2" fill="none" stroke="${OUTLINE}" stroke-width="1.2" stroke-linecap="round" pointer-events="none"/>
  <path d="M24.4 25.4 Q25.4 28.4 27 25.4 Z" fill="#ff7aa2" pointer-events="none"/>
  <ellipse data-part="cheeks" cx="14" cy="22" rx="2.4" ry="1.5" fill="${c.cheeks}" opacity="0.8"/>
  <ellipse data-part="cheeks" cx="31.5" cy="21.5" rx="2" ry="1.4" fill="${c.cheeks}" opacity="0.8"/>
</svg>`,
}
