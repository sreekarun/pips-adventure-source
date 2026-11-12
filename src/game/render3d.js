// 🧊 3D RENDERER — draws the game world in 3D with three.js.
// The game itself is still played left/right (see engine.js). This file only decides how it LOOKS:
// chunky blocks, shadows, spinning coins, trees in the back, and a camera that swoops around.
//
// Units: 1 block = 1 unit. x goes right, y goes up, z comes toward you.
import * as THREE from 'three'
import { getTheme } from './themes.js'

const SOLID = new Set(['#', '=', 'B', 'b'])
const GROUND_DEPTH = 3 // ground blocks are deep, so you see a meadow on top

// 🎥 Camera angles. yaw = turn left/right, pitch = look down, dist = how far away.
export const CAMERA = {
  normal: { yaw: 0.26, pitch: 0.2, dist: 17 },
  intro: { yaw: -0.8, pitch: 0.55, dist: 24 }, // where the swoop starts at the beginning of a level
  treasure: { yaw: 0.7, pitch: 0.1, dist: 10, frames: 75 },
  costume: { yaw: -0.55, pitch: 0.12, dist: 7, frames: 120 },
  gameover: { yaw: 0, pitch: 0.75, dist: 11 },
}

// options.intro = false skips the camera swoop at the start (handy for testing).
// options.theme = which world to draw (see themes.js).
export function createRenderer3D(canvas, game, art, options = {}) {
  const intro = options.intro ?? true
  const themeId = options.theme ?? 'meadow'
  const theme = getTheme(themeId)
  const { world, T } = game
  const H = world.height
  const toY = (py) => H - py / T // pixel y (down) → 3D y (up)

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  const maxAniso = renderer.capabilities.getMaxAnisotropy()

  const scene = new THREE.Scene()
  scene.background = gradientTexture(theme.skyTop, theme.skyBottom)
  scene.fog = new THREE.Fog(theme.fog ?? theme.skyBottom, theme.fog ? 22 : 30, theme.fog ? 70 : 75)
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 300)

  // ---- Lights ----
  const hemi = { sea: [0xa8e8ff, 0x2a6f97, 1.8], space: [0xc8b8ff, 0x3c2a6b, 1.5], candy: [0xfff0f6, 0xffafcc, 1.9] }
  const [hemiSky, hemiGround, hemiPower] = hemi[themeId] ?? [0xffffff, 0x9ccf7a, 1.9]
  scene.add(new THREE.HemisphereLight(hemiSky, hemiGround, hemiPower))
  const sun = new THREE.DirectionalLight(0xfff1d6, 2.2)
  sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048)
  Object.assign(sun.shadow.camera, { left: -20, right: 20, top: 14, bottom: -14, near: 1, far: 70 })
  sun.shadow.bias = -0.0008
  scene.add(sun, sun.target)

  // ---- Textures and materials ----
  const disposables = []
  const tex = (img, { w = 128, h = 128, repeat = [1, 1], pixel = false } = {}) => {
    const c = document.createElement('canvas')
    c.width = w
    c.height = h
    const ctx = c.getContext('2d')
    ctx.imageSmoothingEnabled = !pixel
    ctx.drawImage(img, 0, 0, w, h)
    return canvasTex(c, repeat, pixel)
  }
  const canvasTex = (c, repeat = [1, 1], pixel = false) => {
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = maxAniso
    if (pixel) t.magFilter = THREE.NearestFilter
    if (repeat[0] !== 1 || repeat[1] !== 1) {
      t.wrapS = t.wrapT = THREE.RepeatWrapping
      t.repeat.set(repeat[0], repeat[1])
    }
    disposables.push(t)
    return t
  }
  const lambert = (map, extra = {}) => {
    const m = new THREE.MeshLambertMaterial({ map, ...extra })
    disposables.push(m)
    return m
  }

  const themed = (part) => art[`${themeId}_${part}`]
  const grassTop = lambert(canvasTex(grassTopCanvas(theme.topColor, theme.topSpeckles), [1, GROUND_DEPTH]))
  const grassFront = lambert(tex(themed('top')))
  const grassSide = lambert(tex(themed('top'), { repeat: [GROUND_DEPTH, 1] }))
  const dirt = lambert(tex(themed('dirt')))
  const dirtSide = lambert(tex(themed('dirt'), { repeat: [GROUND_DEPTH, 1] }))
  const platformMat = lambert(tex(themed('platform')))
  const chestMat = lambert(tex(art.bonus))
  const chestUsedMat = lambert(tex(art.bonusUsed))
  // Box faces are in this order: right, left, top, bottom, front, back.
  const groundTopMats = [grassSide, grassSide, grassTop, dirt, grassFront, dirt]
  const dirtMats = [dirtSide, dirtSide, dirt, dirt, dirt, dirt]

  // ---- Blocks ----
  const cells = { groundTop: [], dirt: [], platform: [] }
  const chests = []
  const spikes = []
  for (let ty = 0; ty < H; ty++) {
    for (let tx = 0; tx < world.width; tx++) {
      const ch = world.grid[ty][tx]
      if (ch === '#') (ty > 0 && world.grid[ty - 1][tx] === '#' ? cells.dirt : cells.groundTop).push([tx, ty])
      else if (ch === '=') cells.platform.push([tx, ty])
      else if (ch === 'B' || ch === 'b') chests.push({ tx, ty })
      else if (ch === 'S') spikes.push({ tx, ty })
    }
  }
  const groundGeo = new THREE.BoxGeometry(1, 1, GROUND_DEPTH)
  const cubeGeo = new THREE.BoxGeometry(1, 1, 1)
  disposables.push(groundGeo, cubeGeo)
  const groundZ = 0.5 - GROUND_DEPTH / 2
  addInstanced(cells.groundTop, groundGeo, groundTopMats, groundZ)
  addInstanced(cells.dirt, groundGeo, dirtMats, groundZ)
  addInstanced(cells.platform, cubeGeo, platformMat, 0)

  function addInstanced(list, geo, mats, z) {
    if (!list.length) return
    const mesh = new THREE.InstancedMesh(geo, mats, list.length)
    const m = new THREE.Matrix4()
    list.forEach(([tx, ty], i) => mesh.setMatrixAt(i, m.makeTranslation(tx + 0.5, H - ty - 0.5, z)))
    mesh.castShadow = mesh.receiveShadow = true
    scene.add(mesh)
  }

  for (const c of chests) {
    c.mesh = new THREE.Mesh(cubeGeo, chestMat)
    c.mesh.position.set(c.tx + 0.5, H - c.ty - 0.5, 0)
    c.mesh.castShadow = c.mesh.receiveShadow = true
    c.opened = -1
    scene.add(c.mesh)
  }

  const spikeGeo = new THREE.ConeGeometry(0.14, 0.5, 10)
  const spikeMat = new THREE.MeshStandardMaterial({ color: 0xdfe6ee, metalness: 0.4, roughness: 0.35 })
  disposables.push(spikeGeo, spikeMat)
  for (const sp of spikes) {
    for (const dx of [-0.3, 0, 0.3]) {
      for (const dz of [-0.22, 0.22]) {
        const cone = new THREE.Mesh(spikeGeo, spikeMat)
        cone.position.set(sp.tx + 0.5 + dx, H - sp.ty - 1 + 0.25, dz)
        cone.castShadow = true
        scene.add(cone)
      }
    }
  }

  // ---- Coins (real spinning 3D coins!) ----
  const coinGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.07, 28)
  coinGeo.rotateX(Math.PI / 2)
  const coinFace = new THREE.MeshStandardMaterial({ map: tex(art.coin), metalness: 0.3, roughness: 0.4 })
  const coinEdge = new THREE.MeshStandardMaterial({ color: 0xe0a800, metalness: 0.5, roughness: 0.3 })
  const coinMats = [coinEdge, coinFace, coinFace]
  disposables.push(coinGeo, coinFace, coinEdge)
  const coinMeshes = world.coins.map((c) => {
    const mesh = new THREE.Mesh(coinGeo, coinMats)
    mesh.castShadow = true
    scene.add(mesh)
    return { coin: c, mesh, phase: c.x * 0.05 }
  })

  // ---- Flag ----
  let flagCloth = null
  if (world.flag) {
    const fx = world.flag.x / T + 0.5
    const fy = toY(world.flag.y)
    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 3.9, 12),
      new THREE.MeshStandardMaterial({ color: 0xf1f1f1, roughness: 0.4 }),
    )
    pole.position.set(fx, fy + 1.95, 0)
    pole.castShadow = true
    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 16, 12),
      new THREE.MeshStandardMaterial({ color: 0xffd23f, metalness: 0.4, roughness: 0.3 }),
    )
    ball.position.set(fx, fy + 4, 0)
    const clothGeo = new THREE.PlaneGeometry(1, 0.62, 14, 2)
    clothGeo.translate(0.5, 0, 0)
    const cloth = new THREE.Mesh(
      clothGeo,
      new THREE.MeshLambertMaterial({ map: canvasTex(flagCanvas()), side: THREE.DoubleSide }),
    )
    cloth.position.set(fx + 0.04, fy + 3.45, 0)
    cloth.castShadow = true
    scene.add(pole, ball, cloth)
    disposables.push(pole.geometry, pole.material, ball.geometry, ball.material, clothGeo, cloth.material)
    flagCloth = { geo: clothGeo, base: clothGeo.attributes.position.array.slice() }
  }

  // ---- Background: meadow, trees, flowers, hills, clouds, sun ----
  const meadowW = world.width + 80
  const meadow = new THREE.Mesh(
    new THREE.PlaneGeometry(meadowW, 60),
    new THREE.MeshLambertMaterial({ color: theme.groundColor }),
  )
  meadow.rotation.x = -Math.PI / 2
  meadow.position.set(world.width / 2, groundTopY() - 0.02, -GROUND_DEPTH + 0.5 - 30)
  meadow.receiveShadow = true
  scene.add(meadow)
  disposables.push(meadow.geometry, meadow.material)


  const hillsMat = new THREE.MeshBasicMaterial({
    map: tex(themed('hills'), { w: 512, h: 200, repeat: [meadowW / 14, 1] }),
    transparent: true,
    depthWrite: false,
  })
  const hills = new THREE.Mesh(new THREE.PlaneGeometry(meadowW, 6), hillsMat)
  hills.position.set(world.width / 2, groundTopY() + 2.2, -26)
  scene.add(hills)
  disposables.push(hills.geometry, hillsMat)

  const cloudMat = new THREE.MeshBasicMaterial({ map: tex(art.cloud, { w: 320, h: 140 }), color: theme.clouds ?? 0xffffff, transparent: true, depthWrite: false, fog: false })
  const cloudGeo = new THREE.PlaneGeometry(6, 2.6)
  disposables.push(cloudMat, cloudGeo)
  const clouds = []
  for (let x = -20; theme.clouds && x < world.width + 40; x += 11) {
    const cl = new THREE.Mesh(cloudGeo, cloudMat)
    const r = hash(x)
    cl.position.set(x + r * 5, H + 1 + r * 4, -34 - r * 8)
    cl.scale.setScalar(0.8 + r * 0.8)
    clouds.push({ mesh: cl, x: cl.position.x })
    scene.add(cl)
  }

  const sunDisc = new THREE.Mesh(
    new THREE.CircleGeometry(3, 32),
    new THREE.MeshBasicMaterial({ color: theme.sun ?? 0xffffff, fog: false }),
  )
  sunDisc.visible = !!theme.sun
  scene.add(sunDisc)
  disposables.push(sunDisc.geometry, sunDisc.material)

  // ---- Characters (flat pictures that turn to face the camera) ----
  // Soft round shadows under characters.
  const shadowGeo = new THREE.CircleGeometry(0.38, 24)
  const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.22, depthWrite: false })
  disposables.push(shadowGeo, shadowMat)
  function makeShadow() {
    const m = new THREE.Mesh(shadowGeo, shadowMat)
    m.rotation.x = -Math.PI / 2
    scene.add(m)
    return m
  }

  const heroGeo = new THREE.PlaneGeometry(1, 64 / 48) // the hero+costume frame is 48×64
  heroGeo.translate(0, 32 / 48, 0)
  const heroMat = new THREE.MeshBasicMaterial({ alphaTest: 0.5, side: THREE.DoubleSide })
  const heroMesh = new THREE.Mesh(heroGeo, heroMat)
  scene.add(heroMesh)
  disposables.push(heroGeo, heroMat)

  const enemyGeo = new THREE.PlaneGeometry(40 / 48, 36 / 48)
  enemyGeo.translate(0, 18 / 48, 0)
  const enemyMat = new THREE.MeshBasicMaterial({ map: tex(themed('enemy'), { w: 160, h: 144 }), alphaTest: 0.5, side: THREE.DoubleSide })
  disposables.push(enemyGeo, enemyMat)
  const enemyMeshes = world.enemies.map((e) => {
    const mesh = new THREE.Mesh(enemyGeo, enemyMat)
    scene.add(mesh)
    return { enemy: e, mesh, shadow: makeShadow() }
  })

  const heroShadow = makeShadow()

  // ---- Particles ----
  const sparkleGeo = new THREE.OctahedronGeometry(0.09)
  const puffGeo = new THREE.SphereGeometry(0.3, 14, 10)
  const smallCoinGeo = coinGeo
  disposables.push(sparkleGeo, puffGeo)
  const liveParticles = new Map()

  function makeParticle(p) {
    if (p.kind === 'coin') return new THREE.Mesh(smallCoinGeo, coinMats)
    if (p.kind === 'puff') return new THREE.Mesh(puffGeo, new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true }))
    if (p.kind === 'costume') {
      const g = new THREE.Group()
      for (let i = 0; i < 10; i++) {
        const star = new THREE.Mesh(sparkleGeo, new THREE.MeshBasicMaterial({ color: [0xffd23f, 0xf15bb5, 0x9b5de5, 0x3ec1d3][i % 4], transparent: true }))
        star.userData.angle = (i / 10) * Math.PI * 2
        g.add(star)
      }
      return g
    }
    const g = new THREE.Group()
    for (let i = 0; i < 6; i++) {
      const star = new THREE.Mesh(sparkleGeo, new THREE.MeshBasicMaterial({ color: 0xffe066, transparent: true }))
      star.userData.angle = (i / 6) * Math.PI * 2
      g.add(star)
    }
    return g
  }

  // ---- Camera state ----
  const cam = { ...(intro ? CAMERA.intro : CAMERA.normal), x: world.start.x / T + 3, y: 5 }
  let shot = null
  let shake = 0
  let introFrames = intro ? 110 : 0

  function handleEvents(events) {
    for (const e of events) {
      if (e === 'treasure') shot = { ...CAMERA.treasure, until: game.time + CAMERA.treasure.frames }
      if (e === 'costume') shot = { ...CAMERA.costume, until: game.time + CAMERA.costume.frames }
      if (e === 'hurt') shake = 14
      if (e === 'stomp') shake = Math.max(shake, 5)
    }
  }

  function setHero(heroCanvas) {
    heroMat.map?.dispose()
    heroMat.map = canvasTex(heroCanvas)
    heroMat.needsUpdate = true
  }

  function resize(w, h) {
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }

  function groundTopY() {
    // Height of the main ground (the top of the lowest row of '#' blocks that has grass).
    const ys = cells.groundTop.map(([, ty]) => ty)
    return ys.length ? H - Math.max(...ys) : 0
  }

  function groundBelow(px, pyFeet) {
    const tx = Math.floor(px / T)
    for (let ty = Math.max(0, Math.floor(pyFeet / T)); ty < H; ty++) {
      if (SOLID.has(world.grid[ty]?.[tx])) return H - ty
    }
    return null
  }

  function placeShadow(shadowMesh, px, pyFeet, size) {
    const gy = groundBelow(px, pyFeet)
    if (gy === null) {
      shadowMesh.visible = false
      return
    }
    const height = gy - toY(pyFeet)
    shadowMesh.visible = height > -0.2
    shadowMesh.position.set(px / T, gy + 0.02, 0)
    shadowMesh.scale.setScalar(size / (1 + Math.max(0, -height) * 0.35))
  }

  function faceCamera(mesh, flip) {
    mesh.rotation.y = Math.atan2(camera.position.x - mesh.position.x, camera.position.z - mesh.position.z)
    mesh.scale.x = flip ? -Math.abs(mesh.scale.x) : Math.abs(mesh.scale.x)
  }

  // ---- Scenery for each world ----
  const sceneMat = (color, extra = {}) => {
    const m = new THREE.MeshLambertMaterial({ color, ...extra })
    disposables.push(m)
    return m
  }
  const sceneGeo = (g) => {
    disposables.push(g)
    return g
  }
  const shapes = {
    trunk: sceneGeo(new THREE.CylinderGeometry(0.15, 0.2, 1.4, 8)),
    ball: sceneGeo(new THREE.SphereGeometry(1, 14, 10)),
    cone: sceneGeo(new THREE.ConeGeometry(1, 1, 10)),
    stick: sceneGeo(new THREE.CylinderGeometry(0.05, 0.05, 1, 6)),
    disc: sceneGeo(new THREE.CylinderGeometry(0.7, 0.7, 0.14, 24).rotateX(Math.PI / 2)),
    dome: sceneGeo(new THREE.SphereGeometry(1, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2)),
    rock: sceneGeo(new THREE.DodecahedronGeometry(1)),
    crystal: sceneGeo(new THREE.OctahedronGeometry(1)),
    star5: sceneGeo(new THREE.CylinderGeometry(1, 1, 0.3, 5)),
    weed: sceneGeo(new THREE.BoxGeometry(0.12, 1, 0.05).translate(0, 0.5, 0)),
  }
  const swaying = [] // seaweed that waves in the water
  const skyThings = new THREE.Group() // planets: they move with the camera
  scene.add(skyThings)

  const mesh = (shape, material, x = 0, y = 0, z = 0, sx = 1, sy = sx, sz = sx) => {
    const m = new THREE.Mesh(shapes[shape], material)
    m.position.set(x, y, z)
    m.scale.set(sx, sy, sz)
    return m
  }
  const group = (...children) => {
    const g = new THREE.Group()
    g.add(...children)
    return g
  }
  const pick = (list, r) => list[Math.floor(r * list.length) % list.length]

  function addScenery() {
    const brown = sceneMat(0x8d5524)
    const leaves = [0x57c84d, 0x3fae49, 0x7ed957].map((c) => sceneMat(c))
    const petals = [0xff7aa2, 0xffd23f, 0xffffff, 0x9b5de5].map((c) => sceneMat(c))
    const stem = sceneMat(0x3a8f3a)
    const snow = sceneMat(0xffffff)
    const pine = [0x2d6a4f, 0x40916c].map((c) => sceneMat(c))
    const orange = sceneMat(0xff8c42)
    const black = sceneMat(0x2b2d42)
    const candyColors = [0xff4d6d, 0x4cc9f0, 0xffd23f, 0x9b5de5, 0x7ee26f].map((c) => sceneMat(c))
    const swirl = sceneMat(0xffffff, { map: canvasTex(swirlCanvas()) })
    const coralColors = [0xff7f6e, 0xf15bb5, 0xffd23f, 0xb388eb].map((c) => sceneMat(c))
    const weedMat = sceneMat(0x2a9d8f, { side: THREE.DoubleSide })
    const moonRock = [0x9a9aae, 0x7d7d93].map((c) => sceneMat(c))
    const glow = [0x3ec1d3, 0xf15bb5, 0xa6ecf5].map((c) => {
      const m = new THREE.MeshBasicMaterial({ color: c })
      disposables.push(m)
      return m
    })

    // Big things on the meadow behind the level.
    const big = {
      trees: (r) =>
        group(
          mesh('trunk', brown, 0, 0.7, 0),
          mesh('ball', pick(leaves, r), 0, 1.9, 0, 1, 1.1, 1),
          mesh('ball', pick(leaves, r + 0.4), 0.3, 2.6, 0.1, 0.65),
        ),
      pines: (r) =>
        r > 0.85
          ? group(
              mesh('ball', snow, 0, 0.5, 0, 0.55),
              mesh('ball', snow, 0, 1.15, 0, 0.4),
              mesh('ball', snow, 0, 1.65, 0, 0.3),
              mesh('cone', orange, 0, 1.65, 0.35, 0.06, 0.25, 0.06).rotateX(Math.PI / 2),
              mesh('ball', black, -0.1, 1.75, 0.27, 0.04),
              mesh('ball', black, 0.1, 1.75, 0.27, 0.04),
            )
          : group(
              mesh('trunk', brown, 0, 0.4, 0, 1, 0.6, 1),
              mesh('cone', pick(pine, r), 0, 1.4, 0, 1.1, 1.6, 1.1),
              mesh('cone', pick(pine, r + 0.5), 0, 2.4, 0, 0.8, 1.3, 0.8),
              mesh('cone', snow, 0, 3.0, 0, 0.42, 0.55, 0.42),
            ),
      candy: (r) =>
        r > 0.7
          ? group(mesh('dome', pick(candyColors, r), 0, 0, 0, 1.1, 1.2, 1.1))
          : group(mesh('stick', snow, 0, 1.1, 0, 1, 2.2, 1), mesh('disc', swirl, 0, 2.6, 0, 1.3, 1.3, 1.3)),
      coral: (r) => {
        const color = pick(coralColors, r)
        const g = group(mesh('stick', color, 0, 0.8, 0, 3, 1.6, 3))
        for (let i = 0; i < 3; i++) {
          const branch = mesh('stick', color, (i - 1) * 0.35, 1.5, 0, 2.2, 1, 2.2)
          branch.rotation.z = (i - 1) * 0.6
          g.add(branch, mesh('ball', color, (i - 1) * 0.65, 2.0, 0, 0.16))
        }
        return g
      },
      space: (r) =>
        r > 0.75
          ? group(mesh('crystal', pick(glow, r), 0, 0.9, 0, 0.35, 0.9, 0.35), mesh('crystal', pick(glow, r + 0.3), 0.4, 0.5, 0, 0.2, 0.5, 0.2))
          : group(mesh('rock', pick(moonRock, r), 0, 0.3, 0, 0.9, 0.6, 0.8)),
    }[theme.scenery]

    // Small things on top of the ground blocks, behind where you run.
    const small = {
      trees: (r, tx) =>
        r < 0.25
          ? [mesh('ball', pick(leaves, r), 0, 0.2, -1.9, 0.54, 0.36, 0.45)]
          : r < 0.6
            ? [0, 1].flatMap((i) => [
                mesh('stick', stem, i * 0.45 - 0.25, 0.15, -0.9 - hash(tx + i) * 1.4, 0.4, 0.3, 0.4),
                mesh('ball', pick(petals, hash(tx + i)), i * 0.45 - 0.25, 0.33, -0.9 - hash(tx + i) * 1.4, 0.09),
              ])
            : [],
      pines: (r) => (r < 0.35 ? [mesh('dome', snow, 0, 0, -1.8, 0.5, 0.25, 0.4)] : []),
      candy: (r) =>
        r < 0.3
          ? [mesh('dome', pick(candyColors, r * 3), 0, 0, -1.7, 0.3)]
          : r < 0.45
            ? [mesh('stick', snow, 0, 0.35, -1.9, 1, 0.7, 1), mesh('disc', swirl, 0, 0.8, -1.9, 0.35)]
            : [],
      coral: (r) => {
        if (r < 0.4) {
          return [0, 1, 2].map((i) => {
            const w = mesh('weed', weedMat, i * 0.2 - 0.2, 0, -1.6 - i * 0.2, 1, 1.2 + hash(r + i), 1)
            w.userData.phase = r * 10 + i
            swaying.push(w)
            return w
          })
        }
        return r < 0.55 ? [mesh('star5', orange, 0, 0.03, -1.2, 0.18, 0.2, 0.18)] : []
      },
      space: (r) =>
        r < 0.3
          ? [mesh('rock', pick(moonRock, r), 0, 0.1, -1.7, 0.25, 0.18, 0.25)]
          : r < 0.4
            ? [mesh('crystal', pick(glow, r), 0, 0.25, -1.8, 0.12, 0.3, 0.12)]
            : [],
    }[theme.scenery]

    const gy = groundTopY()
    for (let x = -10; x < world.width + 20; x += 4) {
      const r = hash(x + 0.5)
      if (r < 0.35) continue
      const thing = big(r)
      thing.position.set(x + r * 3, gy, -GROUND_DEPTH - 2 - r * 9)
      thing.scale.multiplyScalar(0.8 + r * 0.7)
      thing.traverse((o) => o.isMesh && (o.castShadow = o.receiveShadow = true))
      scene.add(thing)
    }
    for (const [tx, ty] of cells.groundTop) {
      const r = hash(tx * 7.1 + ty)
      const things = small(r, tx)
      if (!things.length) continue
      const g = group(...things)
      g.position.set(tx + 0.5, H - ty, 0)
      g.traverse((o) => o.isMesh && (o.castShadow = true))
      scene.add(g)
    }

    // Planets in the sky for outer space.
    if (theme.scenery === 'space') {
      const planetMat = new THREE.MeshLambertMaterial({ color: 0xf4a261, fog: false })
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xffd6a5, side: THREE.DoubleSide, fog: false })
      const moonMat = new THREE.MeshLambertMaterial({ color: 0x90e0ef, fog: false })
      const ringGeo = new THREE.RingGeometry(9, 13, 48)
      disposables.push(planetMat, ringMat, moonMat, ringGeo)
      const planet = group(new THREE.Mesh(shapes.ball, planetMat), new THREE.Mesh(ringGeo, ringMat))
      planet.children[0].scale.setScalar(6.5)
      planet.children[1].rotation.x = 1.2
      planet.position.set(-14, H + 9, -110)
      const moon = new THREE.Mesh(shapes.ball, moonMat)
      moon.scale.setScalar(2.4)
      moon.position.set(22, H + 13, -100)
      skyThings.add(planet, moon) // these follow the camera, so they feel very far away
    }
  }

  // Falling snow, rising bubbles, or twinkling stars.
  function addWeather() {
    const kind = theme.weather
    if (!kind) return null
    const count = kind === 'stars' ? 700 : 450
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      if (kind === 'stars') {
        pos.set([hash(i) * (world.width + 160) - 80, H - 4 + hash(i + 900) * 40, -55 - hash(i + 1700) * 30], i * 3)
      } else {
        pos.set([hash(i) * 36 - 18, hash(i + 900) * (H + 6), hash(i + 1700) * 10 - 7], i * 3)
      }
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const material = new THREE.PointsMaterial({
      color: { snow: 0xffffff, bubbles: 0xe0f7ff, stars: 0xffffff }[kind],
      size: { snow: 0.16, bubbles: 0.22, stars: 0.5 }[kind],
      map: canvasTex(dotCanvas(kind === 'bubbles')),
      transparent: true,
      depthWrite: false,
      fog: kind !== 'stars',
    })
    disposables.push(geo, material)
    const points = new THREE.Points(geo, material)
    scene.add(points)
    return { kind, points, pos, count }
  }

  function updateWeather(time) {
    for (const w of swaying) w.rotation.z = Math.sin(time * 0.03 + w.userData.phase) * 0.18
    if (!weather || weather.kind === 'stars') return
    const { pos, count } = weather
    const top = H + 6
    for (let i = 0; i < count; i++) {
      let y = pos[i * 3 + 1] + (weather.kind === 'snow' ? -0.025 : 0.022)
      if (y < 0) y += top
      if (y > top) y -= top
      pos[i * 3 + 1] = y
      pos[i * 3] += Math.sin(time * 0.02 + i) * 0.004
    }
    weather.points.geometry.attributes.position.needsUpdate = true
    weather.points.position.x = cam.x
  }

  addScenery()
  const weather = addWeather()

  // ---- Draw one frame ----
  function render() {
    const { hero, time } = game

    // Treasure chests: swap to "opened" and bounce up when bumped.
    for (const c of chests) {
      if (c.opened < 0 && world.grid[c.ty][c.tx] === 'b') {
        c.opened = time
        c.mesh.material = chestUsedMat
      }
      const t = c.opened < 0 ? 1 : (time - c.opened) / 12
      c.mesh.position.y = H - c.ty - 0.5 + (t < 1 ? Math.sin(t * Math.PI) * 0.3 : 0)
    }

    for (const { coin, mesh, phase } of coinMeshes) {
      mesh.visible = !coin.taken
      if (coin.taken) continue
      mesh.position.set(coin.x / T, toY(coin.y) + Math.sin(time * 0.08 + phase) * 0.07, 0)
      mesh.rotation.y = time * 0.05 + phase
    }

    if (flagCloth) {
      const pos = flagCloth.geo.attributes.position
      for (let i = 0; i < pos.count; i++) {
        const x = flagCloth.base[i * 3]
        pos.setZ(i, Math.sin(x * 5 - time * 0.15) * 0.09 * x)
      }
      pos.needsUpdate = true
    }

    for (const cl of clouds) cl.mesh.position.x = cl.x + ((time * 0.01) % 20)
    updateWeather(time)

    // Hero
    const hx = (hero.x + hero.w / 2) / T
    const running = hero.onGround && Math.abs(hero.vx) > 0.5
    const bob = running ? Math.abs(Math.sin(time * 0.35)) * 0.06 : 0
    heroMesh.visible = !(hero.invincible > 0 && Math.floor(time / 4) % 2 === 0)
    heroMesh.position.set(hx, toY(hero.y + hero.h) + bob - 0.04, 0.05)
    heroMesh.scale.set(1, hero.onGround ? 1 : 1.06, 1)
    placeShadow(heroShadow, hero.x + hero.w / 2, hero.y + hero.h, 1)

    // Enemies
    for (const { enemy: e, mesh, shadow } of enemyMeshes) {
      mesh.visible = shadow.visible = !e.dead
      if (e.dead) continue
      const squish = e.squish > 0 ? 0.35 : 1 + Math.sin(time * 0.2 + e.x) * 0.04
      mesh.position.set((e.x + e.w / 2) / T, toY(e.y + e.h), 0)
      mesh.scale.y = squish
      placeShadow(shadow, e.x + e.w / 2, e.y + e.h, 1.05)
    }

    updateParticles(time)
    updateCamera(hx, toY(hero.y + hero.h / 2), hero.facing)

    heroMesh.rotation.y = 0
    faceCamera(heroMesh, hero.facing < 0)
    for (const { mesh, enemy } of enemyMeshes) faceCamera(mesh, enemy.vx > 0)

    renderer.render(scene, camera)
  }

  function updateParticles(time) {
    const alive = new Set(game.particles)
    for (const [p, mesh] of liveParticles) {
      if (!alive.has(p)) {
        scene.remove(mesh)
        mesh.traverse((o) => o.material && o.material !== coinMats && !Array.isArray(o.material) && o.material.dispose())
        liveParticles.delete(p)
      }
    }
    for (const p of game.particles) {
      let mesh = liveParticles.get(p)
      if (!mesh) {
        mesh = makeParticle(p)
        liveParticles.set(p, mesh)
        scene.add(mesh)
      }
      mesh.position.set(p.x / T, toY(p.y), 0.4)
      if (p.kind === 'coin') {
        mesh.rotation.y = time * 0.4
        mesh.scale.setScalar(0.8)
      } else if (p.kind === 'puff') {
        mesh.scale.setScalar((24 - p.life) * 0.08 + 0.6)
        mesh.material.opacity = p.life / 24
      } else {
        const max = p.kind === 'costume' ? 50 : 20
        const d = (max - p.life) * (p.kind === 'costume' ? 0.05 : 0.035)
        mesh.children.forEach((star) => {
          const a = star.userData.angle + time * 0.05
          star.position.set(Math.cos(a) * d, Math.sin(a) * d, 0)
          star.rotation.set(time * 0.1, time * 0.13, 0)
          star.material.opacity = p.life / max
        })
      }
    }
  }

  function updateCamera(hx, hy, facing) {
    let want = CAMERA.normal
    let speed = 0.045
    if (game.status === 'won') {
      want = { yaw: 0.3 + Math.sin(game.time * 0.02) * 0.9, pitch: 0.15, dist: 7 }
      speed = 0.05
    } else if (game.status === 'gameover') {
      want = CAMERA.gameover
    } else if (shot && game.time < shot.until) {
      want = shot
      speed = 0.08
    }
    if (introFrames > 0) {
      introFrames -= 1
      speed = 0.03
    }
    cam.yaw += (want.yaw - cam.yaw) * speed
    cam.pitch += (want.pitch - cam.pitch) * speed
    cam.dist += (want.dist - cam.dist) * speed

    const lookAhead = game.status === 'playing' ? facing * 1.3 : 0
    const targetX = Math.min(Math.max(hx + lookAhead, 5), world.width - 5)
    const targetY = Math.min(Math.max(hy + 0.8, 3.9), H - 3.5)
    cam.x += (targetX - cam.x) * 0.08
    cam.y += (targetY - cam.y) * 0.08

    let sx = 0
    let sy = 0
    if (shake > 0) {
      shake -= 1
      sx = (Math.random() - 0.5) * shake * 0.02
      sy = (Math.random() - 0.5) * shake * 0.02
    }
    const flat = Math.cos(cam.pitch) * cam.dist
    camera.position.set(cam.x + Math.sin(cam.yaw) * flat + sx, cam.y + Math.sin(cam.pitch) * cam.dist + sy, Math.cos(cam.yaw) * flat)
    camera.lookAt(cam.x + sx, cam.y + sy, 0)

    sun.position.set(cam.x - 8, cam.y + 16, 12)
    sun.target.position.set(cam.x, cam.y, 0)
    sunDisc.position.set(cam.x + 18, H + 10, -70)
    skyThings.position.x = cam.x
    sunDisc.lookAt(camera.position)
  }

  function dispose() {
    for (const d of disposables) d.dispose()
    heroMat.map?.dispose()
    renderer.dispose()
  }

  return { render, resize, setHero, handleEvents, dispose }
}

// A number from 0 to 1 that is always the same for the same input (for placing trees).
function hash(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

function gradientTexture(top, bottom) {
  const c = document.createElement('canvas')
  c.width = 2
  c.height = 256
  const ctx = c.getContext('2d')
  const g = ctx.createLinearGradient(0, 0, 0, 256)
  g.addColorStop(0, top)
  g.addColorStop(1, bottom)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 2, 256)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function grassTopCanvas(color, speckles) {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const ctx = c.getContext('2d')
  ctx.fillStyle = color
  ctx.fillRect(0, 0, 64, 64)
  speckles.forEach((s, k) => {
    ctx.fillStyle = s
    for (let i = 0; i < 35; i++) ctx.fillRect(hash(i + k * 100) * 64, hash(i + k * 100 + 50) * 64, 2, 3.5)
  })
  return c
}

function swirlCanvas() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, 128, 128)
  ctx.lineWidth = 10
  ;['#ff4d6d', '#4cc9f0', '#ffd23f'].forEach((color, k) => {
    ctx.strokeStyle = color
    ctx.beginPath()
    for (let a = 0; a < Math.PI * 6; a += 0.1) {
      const r = a * 3.2
      const t = a + (k * Math.PI * 2) / 3
      ctx.lineTo(64 + Math.cos(t) * r, 64 + Math.sin(t) * r)
    }
    ctx.stroke()
  })
  return c
}

function dotCanvas(ring) {
  const c = document.createElement('canvas')
  c.width = c.height = 32
  const ctx = c.getContext('2d')
  ctx.beginPath()
  ctx.arc(16, 16, 13, 0, Math.PI * 2)
  if (ring) {
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.fillStyle = 'rgba(255,255,255,0.25)'
    ctx.fill()
  } else {
    ctx.fillStyle = '#ffffff'
    ctx.fill()
  }
  return c
}

function flagCanvas() {
  const c = document.createElement('canvas')
  c.width = 128
  c.height = 80
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#06d6a0'
  ctx.fillRect(0, 0, 128, 80)
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? 9 : 22
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2
    ctx.lineTo(64 + Math.cos(a) * r, 40 + Math.sin(a) * r)
  }
  ctx.fill()
  return c
}
