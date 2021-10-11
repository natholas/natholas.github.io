//@ts-check
import { values } from '../configs.js'
import { applyWater } from './apply-water.js'
import { updateTexts } from './update-texts.js'
import { setPlantStage } from './set-plant-stage.js'

export const apply = () => {
  applyWater()
  values.shelves.forEach(shelf => shelf.pots.forEach(pot => setPlantStage(pot.plant)))
  updateTexts()
}