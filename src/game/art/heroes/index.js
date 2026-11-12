// The hero shapes you can color in. To add one (bunny? robot?), make a file like dog.js
// and add it to this list.
import { cat } from './cat.js'
import { dog } from './dog.js'

export const HERO_SHAPES = [cat, dog]

export function getShape(id) {
  return HERO_SHAPES.find((s) => s.id === id) ?? HERO_SHAPES[0]
}

export function defaultShapeColors() {
  return Object.fromEntries(HERO_SHAPES.map((s) => [s.id, { ...s.colors }]))
}

export function makeHeroSvg(shapeId, colors) {
  const shape = getShape(shapeId)
  return shape.draw({ ...shape.colors, ...colors })
}
