//@ts-check

import { values, htmlElements } from '../configs.js'

export const closePlantInfoMenu = () => {
  values.plantInfoMenuOpen = false
  htmlElements.plantInfoMeta.classList.remove('shown')
  values.plantInfoMenuSprites.forEach(sprite => {
    values.app.stage.removeChild(sprite)
  })
}