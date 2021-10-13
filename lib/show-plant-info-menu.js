//@ts-check
import { values } from '../configs.js'
import { createSprite } from './create-sprite.js'
import { closePlantInfoMenu } from './close-plant-info-menu.js'
import { deletePlant } from './delete-plant.js'
import { plants } from '../plants.js'
import { getTimeAmount } from './get-time-amount.js'
import { getAmountText } from './get-amount-text.js'
import { getCanvasScaling } from './get-canvas-scaling.js'
import { getPlantGrowthPercent } from './get-plant-growth-percent.js'
import { getPlantQuality } from './get-plant-quality.js'


export const showPlantInfoMenu = (shelf, pot) => {
  if (values.vueApp.plantMenuOpen) return
  if (values.vueApp.shelfLimitMenuOpen) return
  if (values.vueApp.plantInfoMenuOpen) return
  if (values.vueApp.missionsMenuOpen) return

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
    let resp = deletePlant(shelf, pot)
    if (!resp) return
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
    let totalAge = Date.now() - pot.plant.plantedTime
    const percent = getPlantGrowthPercent(pot.plant)
    const quality = getPlantQuality(pot.plant)
    const remaining = template.growthTime * (1 - percent)
    values.vueApp.plantInfoMeta = `
    Age: <b>${getTimeAmount(totalAge)}</b><br>
    Quality: <b>${quality}</b><br>
    ${remaining > 0 ? 'Remaining: <b>'+ getTimeAmount(remaining) + '</b><br>' : ''}
    Sells for: <b>$${getAmountText(template.value * (quality / 100))}/$${getAmountText(template.value)}</b>
    `

    if (percent === 1) sellButton.alpha = 1
  }

  updateVals()
  updateInterval = setInterval(() => updateVals(), 1000);
}