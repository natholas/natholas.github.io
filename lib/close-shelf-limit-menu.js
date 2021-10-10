//@ts-check

import { values } from '../configs.js'

export const closeShelfLimitMenu = () => {
  values.vueApp.shelfLimitMenuOpen = false
  values.shelfLimitMenuSprites.forEach(sprite => {
    values.app.stage.removeChild(sprite)
  })
}