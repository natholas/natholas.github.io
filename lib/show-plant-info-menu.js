//@ts-check
import { values } from '../configs.js'
import { createSprite } from './create-sprite.js'
import { closePlantInfoMenu } from './close-plant-info-menu.js'
import { deletePlant } from './delete-plant.js'
import { plants } from '../plants.js'
import { getTimeAmount } from './get-time-amount.js'
import { getAmountText } from './get-amount-text.js'
import { getCanvasScaling } from './get-canvas-scaling.js'


export const showPlantInfoMenu = (shelf, pot) => {
  if (values.vueApp.plantMenuOpen) return
  if (values.vueApp.shelfLimitMenuOpen) return
  if (values.vueApp.plantInfoMenuOpen) return

  values.vueApp.plantInfoMenuOpen = true
  let updateInterval
  const bg = createSprite('shelf-limit-bg')
  bg.y = 26 + window.scrollY / getCanvasScaling()
  values.plantInfoMenuSprites.push(bg)

  const closeButton = createSprite('button_close', () => {
    values.sounds.button.play()
    closePlantInfoMenu()
    clearInterval(updateInterval)
    updateInterval = undefined
  })
  closeButton.y = 5
  closeButton.x = bg.width - closeButton.width - (5)
  closeButton.parent = bg
  values.plantInfoMenuSprites.push(closeButton)
  
  const template = plants.find(p => p.key === pot.plant.key)
  
  const sellButton = createSprite('button_sell', () => {
    deletePlant(shelf, pot)
    closePlantInfoMenu()
    clearInterval(updateInterval)
    updateInterval = undefined
  })
  values.plantInfoMenuSprites.push(sellButton)
  sellButton.parent = bg
  sellButton.x = 35
  sellButton.y = 98
  sellButton.alpha = 0.5

  const updateVals = () => {
    let totalAge = pot.plant.growthAmount
    totalAge += template.growthTime / template.numberOfStages * pot.plant.stage

    const remaining = template.growthTime - totalAge
  
    values.vueApp.plantInfoMeta = `
    Age: <b>${getTimeAmount(totalAge)}</b><br>
    ${remaining > 0 ? 'Remaining: <b>'+ getTimeAmount(remaining) + '</b><br>' : ''}
    Sells for: <b>$${getAmountText(template.value)}</b>
    `

    if (pot.plant.stage === template.numberOfStages) sellButton.alpha = 1
  }

  updateVals()
  updateInterval = setInterval(() => updateVals(), 1000);
}