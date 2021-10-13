//@ts-check

import { getAllPlants } from "./get-all-plants.js"
import { getAmountText } from "./get-amount-text.js"
import { getPlantQuality } from "./get-plant-quality.js"
import { getTimeAmount } from "./get-time-amount.js"
import { getPlantGrowthPercent } from './get-plant-growth-percent.js'
import { values } from "../configs.js"
import { removePlant } from "./delete-plant.js"

export const missionsClasses = [
  {
    getTitle(difficulty) {
      return `High quality plants`
    },
    getVals(difficulty) {
      return {
        numberOfPlants: 2 * difficulty,
        time: 5 * difficulty * 1000 * 60,
        quality: 90,
      }
    },
    getText(difficulty) {
      const vals = this.getVals(difficulty)
      return `Plant ${vals.numberOfPlants} new plants. Wait for them to be older than ${getTimeAmount(vals.time)} and make sure they have a quality higher than ${vals.quality}.`
    },
    getReward(difficulty) {
      const pounts = 12 * difficulty * difficulty
      const xp = 4 * difficulty * difficulty
      return {
        points: pounts,
        pointsText: getAmountText(pounts),
        xp: xp,
        xpText: getAmountText(xp)
      }
    },
    getProgress(startTime, difficulty) {
      const vals = this.getVals(difficulty)
      const planted = getAllPlants().filter(p => p.plantedTime > startTime).length
      const completed = getAllPlants().filter(p => p.plantedTime > startTime && getPlantQuality(p) > vals.quality && Date.now() - p.plantedTime > vals.time).length
      return `${planted} out of ${vals.numberOfPlants} planted<br>${completed} out of ${vals.numberOfPlants} meet criteria`
    },
    isCompleted(startTime, difficulty) {
      const vals = this.getVals(difficulty)
      return getAllPlants().filter(p => p.plantedTime > startTime && getPlantQuality(p) > vals.quality && Date.now() - p.plantedTime > vals.time).length >= vals.numberOfPlants
    },
    isFailed() {
      return false
    },
    onCompletion() { },
  },
  {
    getTitle(difficulty) {
      return `Plants for the plant god`
    },
    getVals(difficulty) {
      return {
        numberOfPlants: 10 * difficulty,
        time: 2 * 1000 * 60,
      }
    },
    getText(difficulty) {
      const vals = this.getVals(difficulty)
      return `Plant and full grow ${vals.numberOfPlants} plants withing the next ${getTimeAmount(vals.time)}.`
    },
    getReward(difficulty) {
      const pounts = 20 * difficulty * difficulty
      const xp = 5 * difficulty * difficulty
      return {
        points: pounts,
        pointsText: getAmountText(pounts),
        xp: xp,
        xpText: getAmountText(xp)
      }
    },
    getProgress(startTime, difficulty) {
      const vals = this.getVals(difficulty)
      const timeRemaining = vals.time - (Date.now() - startTime)
      const planted = getAllPlants().filter(p => p.plantedTime > startTime).length
      const completed = getAllPlants().filter(p => p.plantedTime > startTime && getPlantGrowthPercent(p) === 1).length
      return `${planted} out of ${vals.numberOfPlants} planted<br>${completed} out of ${vals.numberOfPlants} fully grown<br>${getTimeAmount(timeRemaining)} remaining`
    },
    isCompleted(startTime, difficulty) {
      const vals = this.getVals(difficulty)
      return getAllPlants().filter(p => p.plantedTime > startTime && getPlantGrowthPercent(p) === 1).length >= vals.numberOfPlants
    },
    isFailed(startTime, difficulty) {
      const vals = this.getVals(difficulty)
      return Date.now() - startTime > vals.time
    },
    onCompletion(startTime, difficulty) {
      const vals = this.getVals(difficulty)
      const toRemove = getAllPlants().filter(p => p.plantedTime > startTime && getPlantGrowthPercent(p) === 1).slice(0, vals.numberOfPlants)
      toRemove.forEach(plant => {
        const pot = potFromPlant(plant)
        const shelf = shelfFromPlant(plant)
        removePlant(shelf, pot)
      })
    }
  }
]

const shelfFromPlant = (plant) => {
  for (let shelf of values.shelves) {
    const pot = shelf.pots.find(p => p.plant === plant)
    if (pot) return shelf
  }
}
const potFromPlant = (plant) => {
  for (let shelf of values.shelves) {
    const pot = shelf.pots.find(p => p.plant === plant)
    if (pot) return pot
  }
}