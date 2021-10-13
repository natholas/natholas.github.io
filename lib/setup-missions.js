//@ts-check

import { values } from "../configs.js"
import { getAllPlants } from "./get-all-plants.js"
import { getAmountText } from "./get-amount-text.js"
import { getPlantQuality } from "./get-plant-quality.js"
import { getTimeAmount } from "./get-time-amount.js"

export const missionsClasses = [
  {
    getVals(difficulty) {
      return {
        numberOfPlants: 2 * difficulty,
        time: 0.1 * difficulty * 1000 * 60,
        quality: 90,
      }
    },
    getTitle(difficulty) {
      return `High quality plants`
    },
    getText(difficulty) {
      const vals = this.getVals(difficulty)
      return `Plant ${vals.numberOfPlants} new plants. Wait for them to be older than ${getTimeAmount(vals.time)} and make sure they have a quality higher than ${vals.quality}`
    },
    getReward(difficulty) {
      const pounts = 10 * difficulty
      const xp = 1 * difficulty
      return {
        points: pounts,
        pointsText: getAmountText(pounts),
        xp: xp,
        xpText: getAmountText(xp)
      }
    },
    isCompleted(startTime, difficulty) {
      const vals = this.getVals(difficulty)
      return getAllPlants().filter(p => p.plantedTime > startTime && getPlantQuality(p) > vals.quality && Date.now() - p.plantedTime > vals.time).length >= vals.numberOfPlants
    }
  }
]

export const createMission = (templateIndex, difficulty) => {
  const missionClass = missionsClasses[templateIndex]
  return {
    templateIndex,
    difficulty,
    title: missionClass.getTitle(difficulty),
    text: missionClass.getText(difficulty),
    reward: missionClass.getReward(difficulty),
    isCompleted: (startTime) => missionClass.isCompleted(startTime, difficulty),
  }
}

export const setupMissions = () => {
  values.vueApp.availableMissions = []
  const missions = values.vueApp.availableMissions
  const templateIndex = Math.floor(Math.random() * missionsClasses.length)
  const difficulty = 1 // TODO: dynamic difficulty
  missions.push(createMission(templateIndex, difficulty))
  values.vueApp.availableMissions = missions
}