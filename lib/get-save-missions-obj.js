//@ts-check

import { values } from "../configs.js"

export const getSaveMissionsData = () => {
  const activeMission = values.vueApp.activeMission
  return {
    completedMissions: values.completedMissions.filter(a => a).map(m => {
      return {
        templateIndex: m.templateIndex,
        difficulty: m.difficulty,
        startTime: m.startTime,
        completedTime: m.completedTime,
      }
    }),
    activeMission: activeMission ? {
      templateIndex: activeMission.templateIndex,
      difficulty: activeMission.difficulty,
      startTime: activeMission.startTime
    } : null,
  }
}