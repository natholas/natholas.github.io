//@ts-check

import { showNotification } from './show-notification.js'
import { plants } from '../plants.js'
import { getPlantGrowthPercent } from './get-plant-growth-percent.js';

const loader = PIXI['Loader'].shared;

// timePassed: amount of time the plant has been growing for since last check
export const setPlantStage = (plant) => {
  const template = plants.find(_plant => _plant.key === plant.key)
  if (plant.stage === template.numberOfStages) return
  const percent = getPlantGrowthPercent(plant)
  let stage = Math.round(template.numberOfStages * percent)
  if (stage > template.numberOfStages) stage = template.numberOfStages

  if (plant.stage !== stage) {
    if (plant.stage !== undefined && stage === template.numberOfStages) {
      showNotification('Plant ready for harvesting', {icon: '/assets/' + plant.key + '/stage-' + template.numberOfStages + '.png'})
    }
    plant.stage = stage
  }
  plant.sprite.texture = loader.resources[plant.key + '_stage-' + plant.stage].texture
}