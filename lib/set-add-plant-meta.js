
//@ts-check
import { values, htmlElements } from '../configs.js'
import { plants } from '../plants.js'
import { getTimeAmount } from './get-time-amount.js'
import { getAmountText } from './get-amount-text.js'

export const setAddPlantMenuMeta = () => {
  const template = plants[values.addPlantSelectedPlantIndex]
  htmlElements.selectPlantMenuMeta.innerHTML = `
  
  $${getAmountText(template.cost)} - 
  ${getTimeAmount(template.growthTime)}<br>
  Sell: $${getAmountText(template.value)}
  `
  values.addPlantMenuPreview.x = values.addPlantMenuBg.width / 2 - (values.addPlantMenuPreview.width / 2)
  values.addPlantMenuPreview.y = 20 + values.addPlantMenuBg.height / 2 - (values.addPlantMenuPreview.height / 2)
  values.addPlantMenuPot.x = values.addPlantMenuBg.width / 2 - (values.addPlantMenuPot.width / 2)
  values.addPlantMenuPot.y = values.addPlantMenuPreview.y + values.addPlantMenuPreview.height - values.addPlantMenuPot.height
}