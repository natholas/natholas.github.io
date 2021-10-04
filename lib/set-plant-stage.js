//@ts-check

import { showNotification } from './show-notification.js'
import { plants } from '../plants.js'

const loader = PIXI['Loader'].shared;

// timePassed: amount of time the plant has been growing for since last check
export const setPlantStage = (plant, timePassed) => {
  const template = plants.find(_plant => _plant.key === plant.key)
  plant.growthAmount += timePassed
  const stageGrowthTime = template.growthTime / template.numberOfStages
  while (plant.growthAmount >= stageGrowthTime) {
    if (plant.stage === template.numberOfStages) break
    plant.growthAmount -= stageGrowthTime
    plant.stage += 1
    if (plant.stage === template.numberOfStages) {
      showNotification('Plant ready for harvesting', {icon: '/assets/' + plant.key + '/stage-' + template.numberOfStages + '.png'})
    }
  }
  plant.sprite.texture = loader.resources[plant.key + '_stage-' + plant.stage].texture
}