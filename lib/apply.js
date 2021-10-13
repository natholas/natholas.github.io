//@ts-check
import { values } from '../configs.js'
import { applyWater } from './apply-water.js'
import { updateTexts } from './update-texts.js'
import { setPlantStage } from './set-plant-stage.js'
import { applyMissions } from './apply-missions.js'

export const apply = () => {
  applyWater()
  applyMissions()
  values.shelves.forEach(shelf => shelf.pots.forEach(pot => setPlantStage(pot.plant)))
  updateTexts()
}