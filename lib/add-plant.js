//@ts-check
import { getNextEmptyShelf } from './get-next-empty-shelf.js'
import { createSprite } from './create-sprite.js'
import { deletePlant } from './delete-plant.js'
import { fixShelves } from './fix-shelves.js'

export const addPlant = (template, potIndex = 0) => {
  const shelf = getNextEmptyShelf(template.spaces, template.height)
  const potSprite = createSprite('pot-' + (potIndex + 1))
  potSprite.parent = shelf.sprite
  potSprite.y = shelf.sprite.height - potSprite.height - 2 // shelf.sprite.y +

  const spacesTaken = shelf.pots.reduce((t, pot) => t + pot.spaces, 0)
  const x = 9 + spacesTaken * 28

  const pot = { sprite: potSprite, spaces: template.spaces, potIndex }
  const plantSprite = createSprite(template.key + '_stage-0', () => deletePlant(shelf, pot))

  potSprite.x = x + plantSprite.width / 2 - potSprite.width /2
  plantSprite.y = pot.sprite.height - plantSprite.height
  plantSprite.x = potSprite.width /2 - plantSprite.width / 2
  plantSprite.parent = potSprite
  pot.plant = {stage: 0, key: template.key, sprite: plantSprite, growthAmount: 0, value: template.value, height: template.height}
  shelf.pots.push(pot)
  fixShelves()
  return pot.plant
}