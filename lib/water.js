//@ts-check
import { configs, values } from '../configs.js'
import { apply } from './apply.js'
import { getPlantGrowthPercent } from './get-plant-growth-percent.js'
import { getAllPlants } from './get-all-plants.js'
import { debouncedSave } from './save.js'

export const water = (afterPlant = false) => {
  values.sounds.button.play()
  values.sounds.water.play()
  values.vueApp.stats.waters += 1

  let _water = values.waters.find(w => w.end > Date.now())
  if (_water) _water.end = Date.now() + configs.waterDrainTime
  else values.waters.push({start: Date.now(), end: Date.now() + configs.waterDrainTime})

  if (values.waters.length > 1) {
    let watersWithoutFirst = values.waters.slice()
    watersWithoutFirst.shift()
    let plants = getAllPlants()
    if (!plants.length || !plants.find(p => getPlantGrowthPercent(p) !== getPlantGrowthPercent(p, watersWithoutFirst))) {
      values.waters.shift()
    }
  }
  if (!afterPlant) {
    debouncedSave()
    apply()
  }
}