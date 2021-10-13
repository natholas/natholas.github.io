//@ts-check

import { values } from '../configs.js'

export const closeMissionsMenu = () => {
  values.vueApp.missionsMenuOpen = false
  values.missionsMenuSprites.forEach(sprite => {
    values.app.stage.removeChild(sprite)
  })
}