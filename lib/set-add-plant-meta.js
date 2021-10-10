
//@ts-check
import { values } from '../configs.js'
import { plants } from '../plants.js'
import { getTimeAmount } from './get-time-amount.js'
import { getAmountText } from './get-amount-text.js'

export const setAddPlantMenuMeta = () => {
  const template = plants[values.addPlantSelectedPlantIndex]
  values.vueApp.selectPlantMenuMeta = `
  Costs: <b>$${getAmountText(template.cost)}</b><br>
  Takes: <b>${getTimeAmount(template.growthTime)}</b><br>
  Sell for: <b>$${getAmountText(template.value)}</b>
  `

  values.addPlantMenuPreview.x = values.addPlantMenuBg.width / 2 - (values.addPlantMenuPreview.width / 2)
  values.addPlantMenuPreview.y = 28 + values.addPlantMenuBg.height / 2 - (values.addPlantMenuPreview.height / 2)
  values.addPlantMenuPot.x = values.addPlantMenuBg.width / 2 - (values.addPlantMenuPot.width / 2)
  values.addPlantMenuPot.y = values.addPlantMenuPreview.y + values.addPlantMenuPreview.height - values.addPlantMenuPot.height
}