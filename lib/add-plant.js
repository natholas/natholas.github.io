//@ts-check
import { values, configs } from '../configs.js'
import { getNextEmptyShelf } from './get-next-empty-shelf.js'
import { createSprite } from './create-sprite.js'
import { deletePot } from './delete-pot.js'

export const addPlant = (plantTemplate, potIndex = 0) => {
  let index = values.shelves.indexOf(getNextEmptyShelf(plantTemplate.spaces))
  const shelf = values.shelves[index]
  const potSprite = createSprite('pot-' + (potIndex + 1))
  potSprite.parent = shelf.sprite
  potSprite.y = configs.shelfHeight - potSprite.height - 2

  const spacesTaken = shelf.pots.reduce((t, pot) => t + pot.spaces, 0)
  const x = 9 + spacesTaken * 28

  const pot = {sprite: potSprite, spaces: plantTemplate.spaces, potIndex}
  const plantSprite = createSprite(plantTemplate.key + '_stage-0', () => deletePot(shelf, pot))

  potSprite.x = x + plantSprite.width / 2 - potSprite.width /2
  plantSprite.y = pot.sprite.height - plantSprite.height
  plantSprite.x = potSprite.width /2 - plantSprite.width / 2
  plantSprite.parent = potSprite
  pot.plant = {stage: 0, key: plantTemplate.key, sprite: plantSprite, growthAmount: 0, value: plantTemplate.value}
  shelf.pots.push(pot)
  return pot.plant
}