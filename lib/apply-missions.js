//@ts-check
import { values } from '../configs.js'
import { save } from './save.js'
import { setupMissions } from './setup-missions.js'

export const applyMissions = () => {
  const mission = values.vueApp.activeMission
  if (!mission) return
  if (mission.isFailed(mission.startTime)) {
    values.vueApp.activeMission = undefined
    save()
  }
  else if (mission.isCompleted(mission.startTime)) {
    values.vueApp.activeMission = undefined
    values.points += mission.reward.points
    values.xp += mission.reward.xp
    values.completedMissions.push(mission)
    mission.completedTime = Date.now()
    mission.onCompletion(mission.startTime)
    setupMissions()
    save()
  }
}