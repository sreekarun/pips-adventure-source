// 👗 Costumes you can find in treasure chests.
// The drawings are in art/costumes.js. To add a costume, add it here AND draw it there.
export const COSTUMES = [
  { id: 'space', name: 'Space Explorer', emoji: '🚀' },
  { id: 'pirate', name: 'Pirate', emoji: '🏴‍☠️' },
  { id: 'wizard', name: 'Wizard', emoji: '🧙' },
  { id: 'mermaid', name: 'Mermaid', emoji: '🧜' },
]

export function getCostume(id) {
  return COSTUMES.find((c) => c.id === id) ?? null
}
