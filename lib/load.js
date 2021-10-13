//@ts-check
import { values, configs } from '../configs.js'
import { addPlant } from './add-plant.js'
import { plants } from '../plants.js'
import { apply } from './apply.js'
import { fixShelves } from './fix-shelves.js'
import { init } from './init.js'
import { setPlantStage } from './set-plant-stage.js'

let checkInterval

export const load = async (data) => {
  for (var i = values.app.stage.children.length - 1; i >= 0; i--) {	values.app.stage.removeChild(values.app.stage.children[i]);};
  values.vueApp.plantMenuOpen = false
  values.vueApp.plantInfoMenuOpen = false
  values.vueApp.shelfLimitMenuOpen = false
  values.shelves = []
  init()
  if (data) {
    if (data.waters) values.waters = data.waters
    if (data.lastSeenWaterLevel) values.lastSeenWaterLevel = data.lastSeenWaterLevel
    values.addPlantSelectedPlantIndex = data.addPlantSelectedPlantIndex
    values.addPlantSelectedPotIndex = data.addPlantSelectedPotIndex || 0
    values.points = data.points
    if (data.stats) values.vueApp.stats = data.stats
    values.maxShelfCount = data.maxShelfCount || configs.minShelves
    for (let shelfData of data.shelves) {
      for (let plantData of shelfData) {
        let template = plants.find(p => p.key === plantData.key)
        const plant = await addPlant(template, plantData.potIndex, true)
        plant.plantedTime = plantData.plantedTime
        
        // temp to fix old data
        if (!plant.plantedTime) {
          let totalAge = plantData.growthAmount
          totalAge += template.growthTime / template.numberOfStages * plantData.stage
          plant.plantedTime = Date.now() - totalAge
        }
        setPlantStage(plant)
      }
    }
  }

  fixShelves()
  apply()
  if (checkInterval) {
    clearInterval(checkInterval)
    checkInterval = undefined
  }
  checkInterval = setInterval(apply, configs.checkRate)
}