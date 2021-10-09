//@ts-check

import { values, htmlElements } from '../configs.js'

export const closeShelfLimitMenu = () => {
  values.shelfLimitMenuOpen = false
  htmlElements.shelfLimitMenuMeta.classList.remove('shown')
  values.shelfLimitMenuSprites.forEach(sprite => {
    values.app.stage.removeChild(sprite)
  })
}