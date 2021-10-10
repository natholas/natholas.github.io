//@ts-check
import { values } from '../configs.js'
import { getAmountText } from './get-amount-text.js'

export const updateTexts = () => {
  values.vueApp.money = "$" + getAmountText(values.points)
  let percent = values.waterLevel / 100
  if (percent > 1) percent = 1
  values.waterLevelSprite.width = 33 * percent
}