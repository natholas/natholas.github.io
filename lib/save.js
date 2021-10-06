//@ts-check
import { values, configs } from '../configs.js'

export const save = () => {
  if (values.killed) return
  let data = {
    version: configs.version,
    lastUpdateTime: values.lastUpdateTime,
    lastWateredTime: values.lastWateredTime,
    addPlantSelectedPlantIndex: values.addPlantSelectedPlantIndex,
    addPlantSelectedPotIndex: values.addPlantSelectedPotIndex,
    points: values.points,
    shelves: values.shelves.map(shelf => {
      return shelf.pots.map(pot => {
        return {
          key: pot.plant.key,
          growthAmount: pot.plant.growthAmount,
          stage: pot.plant.stage,
          potIndex: pot.potIndex
        }
      })
    }).filter(a => a.length)
  }
  localStorage.setItem('data', JSON.stringify(data))
}