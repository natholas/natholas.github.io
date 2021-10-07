//@ts-check
import { values } from '../configs.js'
import { createBackgroundSprite } from './create-sprite.js'
import { addShelf } from './add-shelf.js'
import { showSelectPlantMenu } from './show-select-plant-menu.js'
import { water } from './water.js'

export const init = (numberOfShelves) => {
  const topSprite = createBackgroundSprite('bg-top')
  topSprite.y = 16
  values.bottomSprite = createBackgroundSprite('bg-bottom')

  for (let i = 0; i < numberOfShelves; i++) addShelf(1)

  createBackgroundSprite('text-frame')

  values.waterLevelSprite = createBackgroundSprite('water-level')
  values.waterLevelSprite.y = 6
  values.waterLevelSprite.x = 62
  values.waterLevelSprite.height = 8

  // Add buttons
  createBackgroundSprite('button_add-plant', showSelectPlantMenu)

  const waterButtonSprite = createBackgroundSprite('button_water', water)
  waterButtonSprite.x = 128 - waterButtonSprite.width
}