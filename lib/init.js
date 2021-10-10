//@ts-check
import { values } from '../configs.js'
import { createSprite } from './create-sprite.js'
import { showSelectPlantMenu } from './show-select-plant-menu.js'
import { water } from './water.js'

export const init = () => {
  const topSprite = createSprite('bg-top')
  topSprite.y = 16
  values.bottomSprite = createSprite('bg-bottom')

  createSprite('text-frame')

  values.waterLevelSprite = createSprite('water-level')
  values.waterLevelSprite.y = 6
  values.waterLevelSprite.x = 62
  values.waterLevelSprite.height = 8

  // Add buttons
  createSprite('button_add-plant', showSelectPlantMenu)

  const waterButtonSprite = createSprite('button_water', water)
  waterButtonSprite.x = 128 - waterButtonSprite.width
}