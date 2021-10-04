//@ts-check

import { values, htmlElements } from '../configs.js'

export const closeSelectPlantMenu = () => {
  values.plantMenuOpen = false
  htmlElements.selectPlantMenuMeta.classList.remove('shown')
  values.addPlantMenuSprites.forEach(sprite => {
    values.app.stage.removeChild(sprite)
  })
}