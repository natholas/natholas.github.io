//@ts-check
import { values } from '../configs.js'
import { getAmountText } from './get-amount-text.js'

export const updateTexts = () => {
  values.vueApp.money = "$" + getAmountText(values.points)
  values.waterLevelSprite.width = 33 * values.waterLevel
}