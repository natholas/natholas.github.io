//@ts-check
import { values, configs } from '../configs.js'
import { applyWater } from './apply-water.js'
import { updateTexts } from './update-texts.js'
import { setPlantStage } from './set-plant-stage.js'
import { save } from './save.js'

export const apply = () => {
  applyWater()
  let timePassed = Date.now() - values.lastUpdateTime
  let timeSinceLastWatered = Date.now() - values.lastWateredTime

  let wateredTime = configs.waterDrainTime - timeSinceLastWatered
  if (wateredTime < 0) wateredTime = 0

  if (timePassed > wateredTime) timePassed = wateredTime
  values.lastUpdateTime = Date.now()

  values.shelves.forEach(shelf => shelf.pots.forEach(pot => setPlantStage(pot.plant, timePassed * configs.timeScale)))
  updateTexts()
  save()
}