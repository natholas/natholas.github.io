//@ts-check
import { getNextEmptyShelf } from './get-next-empty-shelf.js'
import { createSprite } from './create-sprite.js'
import { fixShelves } from './fix-shelves.js'
import { showShelfLimitMenu } from './show-shelf-limit-menu.js'
import { showPlantInfoMenu } from './show-plant-info-menu.js'

export const addPlant = async (template, potIndex = 0, ignoreShelfLimit = false) => {
  const shelf = getNextEmptyShelf(template.spaces, template.height, ignoreShelfLimit)
  if (!shelf) {
    let resp = await showShelfLimitMenu()
    if (resp === true) return addPlant(template, potIndex, ignoreShelfLimit)
    fixShelves()
    return
  }
  const potSprite = createSprite('pot-' + (potIndex + 1))
  potSprite.parent = shelf.sprite
  potSprite.y = shelf.sprite.height - potSprite.height - 2

  const spacesTaken = shelf.pots.reduce((t, pot) => t + pot.spaces, 0)
  const x = 9 + spacesTaken * 28

  const pot = { sprite: potSprite, spaces: template.spaces, potIndex }
  const plantSprite = createSprite(template.key + '_stage-0', () => showPlantInfoMenu(shelf, pot))

  potSprite.x = x + plantSprite.width / 2 - potSprite.width /2
  plantSprite.y = pot.sprite.height - plantSprite.height
  plantSprite.x = potSprite.width /2 - plantSprite.width / 2
  plantSprite.parent = potSprite
  pot.plant = {
    stage: 0,
    key: template.key,
    sprite: plantSprite,
    plantedTime: Date.now(),
    value: template.value,
    height: template.height,
  }
  shelf.pots.push(pot)
  fixShelves()
  return pot.plant
}