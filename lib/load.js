//@ts-check
import { values, configs } from '../configs.js'
import { addPlant } from './add-plant.js'
import { plants } from '../plants.js'
import { init } from './init.js'
import { apply } from './apply.js'

export const load = (data) => {
  let shelfCount = configs.minShelves
  if (data && data.shelves.length > shelfCount) shelfCount = data.shelves.length
  init(shelfCount)

  if (data) {
    values.lastUpdateTime = data.lastUpdateTime
    values.lastWateredTime = data.lastWateredTime
    values.addPlantSelectedPlantIndex = data.addPlantSelectedPlantIndex
    values.addPlantSelectedPotIndex = data.addPlantSelectedPotIndex || 0
    values.points = data.points
    console.log(data.points);
    data.shelves.forEach(shelfData => {
      shelfData.forEach(plantData => {
        let template = plants.find(p => p.key === plantData.key)
        const plant = addPlant(template, plantData.potIndex)
        plant.growthAmount = plantData.growthAmount
        plant.stage = plantData.stage
      })
    })
  }

  apply()
  setInterval(apply, configs.checkRate)
}