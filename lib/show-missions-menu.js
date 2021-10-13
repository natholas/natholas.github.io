//@ts-check
import { values } from '../configs.js'
import { createSprite } from './create-sprite.js'
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