//@ts-check

import { values } from "../configs.js"
import { calcLevel } from "./calc-level.js"
import { missionsClasses } from "./mission-classes.js"

export const createMission = (templateIndex, difficulty) => {
  const missionClass = missionsClasses[templateIndex]
  return {
    templateIndex,
    difficulty,
    title: missionClass.getTitle(difficulty),
    text: missionClass.getText(difficulty),
    reward: missionClass.getReward(difficulty),
    isCompleted: (startTime) => missionClass.isCompleted(startTime, difficulty),
    getProgress: (startTime) => missionClass.getProgress(startTime, difficulty),
    isFailed: (startTime) => missionClass.isFailed(startTime, difficulty),
    onCompletion: (startTime) => missionClass.onCompletion(startTime, difficulty),
  }
}

export const setupMissions = () => {
  values.vueApp.availableMissions = []
  const difficulty = calcLevel() + 1
  for (let i = 0; i < missionsClasses.length; i++) {
    values.vueApp.availableMissions.push(createMission(i, difficulty))
  }
}