//@ts-check

import { configs, values } from "../configs.js"

export const getSaveData = () => {
  return {
    version: configs.version,
    waters: values.waters,
    lastSeenWaterLevel: values.lastSeenWaterLevel,
    addPlantSelectedPlantIndex: values.addPlantSelectedPlantIndex,
    addPlantSelectedPotIndex: values.addPlantSelectedPotIndex,
    maxShelfCount: values.maxShelfCount,
    stats: values.vueApp.stats,
    points: values.points,
    xp: values.xp,
    shelves: values.shelves.map(shelf => {
      return shelf.pots.map(pot => {
        return {
          key: pot.plant.key,
          plantedTime: pot.plant.plantedTime,
          potIndex: pot.potIndex
        }
      })
    }).filter(a => a.length)
  }
}