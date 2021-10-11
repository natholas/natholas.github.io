//@ts-check

import { values, configs } from '../configs.js'
import { showNotification } from './show-notification.js'
import { getAllPlants } from './get-all-plants.js'

export const applyWater = () => {
  const lastWater = values.waters[values.waters.length - 1]
  const timetoRunningOut = lastWater.end - Date.now()
  let waterLevel = 1 / configs.waterDrainTime * timetoRunningOut
  const allPlants = getAllPlants()

  if (!allPlants.length) waterLevel = values.lastSeenWaterLevel

  if (waterLevel < 0) waterLevel = 0
  if (waterLevel > 1) waterLevel = 1
  if (waterLevel === 0 && values.waterLevel > 0) {
    showNotification('Water is empty!', {icon: '/assets/buttons/water.png'})
  }

  values.waterLevel = waterLevel
  values.lastSeenWaterLevel = waterLevel
}