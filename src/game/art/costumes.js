// 👗 Costume drawings. Each costume has two layers:
//   under = drawn BEHIND the hero (capes, jetpacks)
//   over  = drawn IN FRONT of the hero (hats, helmets, wands)
// Both use a 48×64 frame. The hero stands at the bottom, 40 wide, from x=4 to x=44.
// For Pip and the puppy, the head is a circle centered near (24, 30) and the feet are near y=60.

const frame = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 64">${inner}</svg>`

export const COSTUME_ART = {
  space: {
    under: frame(`
      <rect x="2" y="38" width="9" height="15" rx="3" fill="#ced4da" stroke="#495057" stroke-width="1.5"/>
      <rect x="4" y="40" width="5" height="3" rx="1.5" fill="#e63946"/>
      <path d="M3 53 Q6.5 63 10 53 Z" fill="#ffd23f"/>
      <path d="M4.5 53 Q6.5 59 8.5 53 Z" fill="#ff6b35"/>`),
    over: frame(`
      <circle cx="24" cy="29" r="17.5" fill="#bde0fe" fill-opacity="0.22" stroke="#ffffff" stroke-width="2.2"/>
      <circle cx="24" cy="29" r="17.5" fill="none" stroke="#7aa6c2" stroke-width="0.8"/>
      <path d="M12 22 Q14.5 15 21 13" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>
      <rect x="12" y="43" width="24" height="4.5" rx="2.2" fill="#dee2e6" stroke="#495057" stroke-width="1.2"/>
      <path d="M24 11.5 V5" stroke="#495057" stroke-width="1.5"/>
      <circle cx="24" cy="4" r="2.4" fill="#e63946" stroke="#9d0208" stroke-width="1"/>
      <path d="M38 8 l1 2 2 .3 -1.5 1.4 .4 2 -1.9 -1 -1.9 1 .4 -2 -1.5 -1.4 2 -.3 Z" fill="#ffd23f"/>`),
  },
  pirate: {
    under: frame(''),
    over: frame(`
      <path d="M6 21 Q24 1 42 21 Q33 16.5 24 17.5 Q15 16.5 6 21 Z" fill="#2b2d42" stroke="#0b0c10" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M8.5 19.5 Q24 12 39.5 19.5" fill="none" stroke="#ffd23f" stroke-width="1.8"/>
      <circle cx="24" cy="11.5" r="3" fill="#ffd23f" stroke="#c98a00" stroke-width="1"/>
      <path d="M17 27 L37 24" stroke="#0b0c10" stroke-width="1.2"/>
      <ellipse cx="29.5" cy="28.5" rx="3.8" ry="3.4" fill="#0b0c10"/>
      <path d="M6 41 Q2 47 4 50 L7 45 Z" fill="#4361ee"/>
      <ellipse cx="8" cy="38" rx="3.8" ry="5" fill="#e63946" stroke="#7a1020" stroke-width="1.2"/>
      <ellipse cx="7" cy="39" rx="2" ry="3.4" fill="#4361ee"/>
      <circle cx="9.5" cy="32" r="3.3" fill="#e63946" stroke="#7a1020" stroke-width="1.2"/>
      <path d="M12.2 31 L15 32.2 L12.2 33.6 Z" fill="#ffd23f" stroke="#c98a00" stroke-width="0.6"/>
      <circle cx="10.4" cy="31.3" r="0.9" fill="#0b0c10"/>`),
  },
  wizard: {
    under: frame(`
      <path d="M10 40 Q3 54 5 63 L43 63 Q45 54 38 40 Z" fill="#5a189a" stroke="#3c096c" stroke-width="1.5" stroke-linejoin="round"/>
      <circle cx="9" cy="56" r="1.2" fill="#ffd23f"/><circle cx="40" cy="52" r="1" fill="#ffd23f"/>`),
    over: frame(`
      <path d="M12 20 Q21 10 28 0.5 Q29.5 9 36 20 Z" fill="#7b2cbf" stroke="#3c096c" stroke-width="1.5" stroke-linejoin="round"/>
      <ellipse cx="24" cy="20" rx="17" ry="3.6" fill="#7b2cbf" stroke="#3c096c" stroke-width="1.5"/>
      <path d="M15 18.6 Q24 21 33 18.6" fill="none" stroke="#ffd23f" stroke-width="1.6"/>
      <path d="M24 9 l1 2 2.2 .3 -1.6 1.5 .4 2.2 -2 -1.1 -2 1.1 .4 -2.2 -1.6 -1.5 2.2 -.3 Z" fill="#ffd23f"/>
      <circle cx="29" cy="5.5" r="1" fill="#ffd23f"/><circle cx="19" cy="15" r="0.9" fill="#fff"/>
      <path d="M34 52 L42 41" stroke="#6b3200" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M42.5 34 l1.3 2.7 3 .4 -2.2 2 .6 3 -2.7 -1.5 -2.7 1.5 .6 -3 -2.2 -2 3 -.4 Z" fill="#ffd23f" stroke="#c98a00" stroke-width="0.7"/>
      <circle cx="38" cy="34" r="0.9" fill="#fff"/><circle cx="46" cy="44" r="0.8" fill="#fff"/>`),
  },
  mermaid: {
    under: frame(''),
    over: frame(`
      <path d="M14 17.5 L16.5 9 L20 15 L24 7 L28 15 L31.5 9 L34 17.5 Q24 14.5 14 17.5 Z" fill="#ffc8dd" stroke="#e75480" stroke-width="1.3" stroke-linejoin="round"/>
      <circle cx="16.5" cy="9" r="1.4" fill="#fff"/><circle cx="24" cy="7" r="1.6" fill="#fff"/><circle cx="31.5" cy="9" r="1.4" fill="#fff"/>
      <path d="M11 49 Q24 53 37 49 Q38 59 27 61 Q19 62.5 15 61 Q10 57 11 49 Z" fill="#2ec4b6" stroke="#127a72" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M17 54 q2 2 4 0 M23 55 q2 2 4 0 M29 54 q2 2 4 0 M20 58 q2 2 4 0 M26 58 q2 2 4 0" fill="none" stroke="#a8f0e8" stroke-width="1"/>
      <path d="M15 60 L4 54 Q5 59 4 64 Z" fill="#7ae0d6" stroke="#127a72" stroke-width="1.4" stroke-linejoin="round"/>
      <circle cx="41" cy="30" r="2.2" fill="none" stroke="#9bdcff" stroke-width="1.2"/>
      <circle cx="44" cy="22" r="1.6" fill="none" stroke="#9bdcff" stroke-width="1.1"/>
      <circle cx="40" cy="15" r="1.2" fill="none" stroke="#9bdcff" stroke-width="1"/>`),
  },
}
