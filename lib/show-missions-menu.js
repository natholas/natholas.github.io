//@ts-check
import { values } from '../configs.js'
import { createSprite } from './create-sprite.js'
import { closePlantInfoMenu } from './close-plant-info-menu.js'
import { deletePlant } from './delete-plant.js'
import { plants } from '../plants.js'
import { getTimeAmount } from './get-time-amount.js'
import { getAmountText } from './get-amount-text.js'
import { getCanvasScaling } from './get-canvas-scaling.js'
import { getPlantGrowthPercent } from './get-plant-growth-percent.js'
import { getPlantGrowthQuality } from './get-plant-growth-quality.js'
import { closeMissionsMenu } from './close-missions-menu.js'


export const showMissionsMenu = () => {
  if (values.vueApp.shelfLimitMenuOpen) return values.sounds.buttonDisabled.play()
  if (values.vueApp.plantMenuOpen) return values.sounds.buttonDisabled.play()
  if (values.vueApp.plantInfoMenuOpen) return values.sounds.buttonDisabled.play()
  if (values.vueApp.missionsMenuOpen) return values.sounds.buttonDisabled.play()
  values.vueApp.missionsMenuOpen = true
  values.sounds.button.play()

  const bg = createSprite('plant-select-menu-bg')
  bg.y = 26
  values.missionsMenuSprites.push(bg)

  const closeButton = createSprite('button_close', () => {
    values.sounds.button.play()
    closeMissionsMenu()
  })
  closeButton.y = 31
  closeButton.x = bg.width - closeButton.width - 5
  values.missionsMenuSprites.push(closeButton)
}