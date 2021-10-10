//@ts-check

import { values } from '../configs.js'

export const closePlantInfoMenu = () => {
  values.vueApp.plantInfoMenuOpen = false
  values.plantInfoMenuSprites.forEach(sprite => {
    values.app.stage.removeChild(sprite)
  })
}