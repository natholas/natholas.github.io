//@ts-check

import { values, configs } from '../configs.js'
import { getTotalNumberOfPlants } from './get-total-number-of-plants.js'
import { showNotification } from './show-notification.js'

export const applyWater = () => {
  let msSinceLastWatered = (Date.now() - values.lastWateredTime) * configs.timeScale
  if (!getTotalNumberOfPlants()) values.lastWateredTime += (Date.now() - values.lastWaterCheckTime)

  let newWaterLevel = Math.ceil(100 - (100 / configs.waterDrainTime * msSinceLastWatered))
  if (newWaterLevel < 0) newWaterLevel = 0

  if (newWaterLevel === 0 && values.waterLevel > 0) {
    showNotification('Water is empty!', {icon: '/assets/buttons/water.png'})
  }

  values.waterLevel = newWaterLevel
  values.lastWaterCheckTime = Date.now()
}