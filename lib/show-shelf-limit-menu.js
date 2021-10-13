//@ts-check
import { configs, values } from '../configs.js'
import { createSprite } from './create-sprite.js'
import { closeShelfLimitMenu } from './close-shelf-limit-menu.js'
import { getAmountText } from './get-amount-text.js'

export const showShelfLimitMenu = () => {
  return new Promise(resolve => {
    values.sounds.button.play()
    values.vueApp.shelfLimitMenuOpen = true
    const bg = createSprite('shelf-limit-bg')
    bg.y = 26
    values.shelfLimitMenuSprites.push(bg)

    const closeButton = createSprite('button_close', () => {
      values.sounds.button.play()
      closeShelfLimitMenu()
      resolve(false)
    })
    closeButton.y = 31
    closeButton.x = values.addPlantMenuBg.width - closeButton.width - 5
    values.shelfLimitMenuSprites.push(closeButton)

    let amount = configs.shelfBaseCost
    let newShelfCount = values.shelves.length + 1
    let baseShelfCount = configs.minShelves
    for (let i = baseShelfCount; i < newShelfCount; i++) {
      amount *= configs.shelfCostMultiplier
    }

    values.vueApp.shelfLimitMenuMeta = `
    Shelf limit reached!<br>
    Buy another shelf?<br>
    <b>$${getAmountText(amount)}</b>
    `
    const confirmButton = createSprite('button_confirm', () => {
      if (values.points < amount) return
      closeShelfLimitMenu()
      values.points -= amount
      values.maxShelfCount += 1
      resolve(true)
    })
    confirmButton.y = 100
    confirmButton.x = 35
    values.shelfLimitMenuSprites.push(confirmButton)

    if (values.points < amount) confirmButton.alpha = 0.5
  })
}