//@ts-check
import { configs, values } from '../configs.js'
import { plants } from '../plants.js'

export const handleAddPlantMenuButtonAlphas = () => {
  values.rightArrow.alpha = 1
  values.leftArrow.alpha = 1
  values.rightPotArrow.alpha = 1
  values.leftPotArrow.alpha = 1
  values.addPlantMenuConfirmButton.alpha = 1
  if (values.addPlantSelectedPlantIndex === 0) values.leftArrow.alpha = 0.5
  if (values.addPlantSelectedPlantIndex === plants.length - 1) values.rightArrow.alpha = 0.5
  if (values.addPlantSelectedPotIndex === 0) values.leftPotArrow.alpha = 0.5
  if (values.addPlantSelectedPotIndex === configs.numberOfPots - 1) values.rightPotArrow.alpha = 0.5
  if (values.points < plants[values.addPlantSelectedPlantIndex].cost) values.addPlantMenuConfirmButton.alpha = 0.5
}