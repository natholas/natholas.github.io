//@ts-check

import { values } from '../configs.js'

export const closeSelectPlantMenu = () => {
  values.vueApp.plantMenuOpen = false
  values.addPlantMenuSprites.forEach(sprite => {
    values.app.stage.removeChild(sprite)
  })
}