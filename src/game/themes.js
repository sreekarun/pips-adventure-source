// 🌍 WORLDS — how each world looks and FEELS.
// physics numbers replace the ones in settings.js while you play that world.
//   groundGrip: how quickly you speed up and stop (small = slippery ice!)
// The block pictures and enemy colors are in art/themeArt.js.

export const THEMES = {
  meadow: {
    name: 'Sunny Meadow',
    emoji: '🌻',
    skyTop: '#7ec8ff',
    skyBottom: '#d4f1ff',
    groundColor: '#7ed56f',
    topColor: '#62cc52',
    topSpeckles: ['#7ee26f', '#4fb341'],
    scenery: 'trees',
    clouds: '#ffffff',
    sun: '#ffec8c',
    physics: {},
  },
  snow: {
    name: 'Snowy Mountains',
    emoji: '❄️',
    skyTop: '#9ec5e8',
    skyBottom: '#eef6ff',
    groundColor: '#f4f8fc',
    topColor: '#f8fbff',
    topSpeckles: ['#ffffff', '#dfeaf5'],
    scenery: 'pines',
    clouds: '#ffffff',
    sun: '#fff8dc',
    weather: 'snow',
    physics: { groundGrip: 0.06 }, // slippery!
  },
  candy: {
    name: 'Candy Land',
    emoji: '🍭',
    skyTop: '#ffafcc',
    skyBottom: '#fff0f6',
    groundColor: '#ffc8dd',
    topColor: '#ff8fab',
    topSpeckles: ['#4cc9f0', '#ffd23f', '#ffffff'],
    scenery: 'candy',
    clouds: '#fff0f6',
    sun: '#ffe066',
    physics: { jumpPower: 15 }, // bouncy!
  },
  sea: {
    name: 'Under the Sea',
    emoji: '🌊',
    skyTop: '#03396c',
    skyBottom: '#4cc9f0',
    groundColor: '#e9c98f',
    topColor: '#f9e4b7',
    topSpeckles: ['#fff3d6', '#e3bf7f'],
    scenery: 'coral',
    clouds: null,
    sun: null,
    weather: 'bubbles',
    fog: '#2a7fb8',
    physics: { gravity: 0.32, jumpPower: 10, maxFallSpeed: 6, runSpeed: 3.8 }, // floaty
  },
  space: {
    name: 'Outer Space',
    emoji: '🚀',
    skyTop: '#0b0425',
    skyBottom: '#3c2a6b',
    groundColor: '#8a8aa0',
    topColor: '#c9c9d9',
    topSpeckles: ['#e3e3ee', '#a9a9bd'],
    scenery: 'space',
    clouds: null,
    sun: null,
    weather: 'stars',
    fog: '#1c1240',
    physics: { gravity: 0.3, jumpPower: 11 }, // moon jumps!
  },
}

export function getTheme(id) {
  return THEMES[id] ?? THEMES.meadow
}
