//@ts-check

import { values } from "../configs.js"
import { plants } from "../plants.js"

export const getPlantGrowthPercent = (plant, waters) => {
  if (!waters) waters = values.waters
  const template = plants.find(_plant => _plant.key === plant.key)
  let growthTime = Date.now() - plant.plantedTime

  let timeWaterWasAvailable = 0
  waters.forEach(w => {
    if (w.end < plant.plantedTime) return
    let start = w.start
    let end = w.end
    if (plant.plantedTime > start) start = plant.plantedTime
    if (end > Date.now()) end = Date.now()
    timeWaterWasAvailable += end - start
  })

  if (timeWaterWasAvailable < growthTime) growthTime = timeWaterWasAvailable

  let percent = 1 / template.growthTime * growthTime
  if (percent > 1) percent = 1

  return percent
}