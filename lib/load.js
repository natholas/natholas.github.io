//@ts-check
import { values, configs } from '../configs.js'
import { addPlant } from './add-plant.js'
import { plants } from '../plants.js'
import { apply } from './apply.js'
import { fixShelves } from './fix-shelves.js'

let saveInterval

export const load = async (data) => {
  if (data) {
    values.lastUpdateTime = data.lastUpdateTime
    values.lastWateredTime = data.lastWateredTime
    values.addPlantSelectedPlantIndex = data.addPlantSelectedPlantIndex
    values.addPlantSelectedPotIndex = data.addPlantSelectedPotIndex || 0
    values.points = data.points
    if (data.stats) values.stats = data.stats
    values.maxShelfCount = data.maxShelfCount || configs.minShelves
    for (let shelfData of data.shelves) {
      for (let plantData of shelfData) {
        let template = plants.find(p => p.key === plantData.key)
        const plant = await addPlant(template, plantData.potIndex, true)
        plant.growthAmount = plantData.growthAmount
        plant.stage = plantData.stage
      }
    }
  }

  fixShelves()
  apply()
  if (saveInterval) {
    clearInterval(saveInterval)
    saveInterval = undefined
  }
  saveInterval = setInterval(apply, configs.checkRate)
}