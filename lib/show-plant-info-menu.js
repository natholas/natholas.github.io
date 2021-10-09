//@ts-check
import { values, htmlElements } from '../configs.js'
import { createSprite } from './create-sprite.js'
import { closePlantInfoMenu } from './close-plant-info-menu.js'
import { deletePlant } from './delete-plant.js'
import { plants } from '../plants.js'
import { getTimeAmount } from './get-time-amount.js'
import { getAmountText } from './get-amount-text.js'

export const showPlantInfoMenu = (shelf, pot) => {
  if (values.plantMenuOpen) return
  if (values.shelfLimitMenuOpen) return
  if (values.plantInfoMenuOpen) return

  values.plantInfoMenuOpen = true
  let updateInterval
  const bg = createSprite('shelf-limit-bg')
  bg.y = 26
  values.plantInfoMenuSprites.push(bg)

  const closeButton = createSprite('button_close', () => {
    values.sounds.button.play()
    closePlantInfoMenu()
    clearInterval(updateInterval)
    updateInterval = undefined
  })
  closeButton.y = 31
  closeButton.x = bg.width - closeButton.width - (5)
  values.plantInfoMenuSprites.push(closeButton)
  
  const template = plants.find(p => p.key === pot.plant.key)
  
  const sellButton = createSprite('button_sell', () => {
    deletePlant(shelf, pot)
    closePlantInfoMenu()
    clearInterval(updateInterval)
    updateInterval = undefined
  })
  values.plantInfoMenuSprites.push(sellButton)
  sellButton.x = 35
  sellButton.y = 124
  sellButton.alpha = 0.5

  const updateVals = () => {
    let totalAge = pot.plant.growthAmount
    totalAge += template.growthTime / template.numberOfStages * pot.plant.stage

    const remaining = template.growthTime - totalAge
  
    htmlElements.plantInfoMeta.innerHTML = `
    Age: <b>${getTimeAmount(totalAge)}</b><br>
    ${remaining > 0 ? 'Remaining: <b>'+ getTimeAmount(remaining) + '</b><br>' : ''}
    Sells for: <b>$${getAmountText(template.value)}</b>
    `

    if (pot.plant.stage === template.numberOfStages) sellButton.alpha = 1
  }

  updateVals()
  updateInterval = setInterval(() => updateVals(), 1000);

  htmlElements.plantInfoMeta.classList.add('shown')
}