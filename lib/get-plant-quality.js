//@ts-check

import { values } from "../configs.js"
import { plants } from "../plants.js"

export const getPlantQuality = (plant, waters) => {
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

  let quality = 100 / growthTime * timeWaterWasAvailable
  if (quality > 100) quality = 100
  if (quality < 0) quality = 0

  return Math.round(quality * 10) / 10
}