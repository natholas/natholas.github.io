//@ts-check
import { values } from '../configs.js'
import { save } from './save.js'

export const applyMissions = () => {
  const mission = values.vueApp.activeMission
  console.log(mission);
  if (!mission) return
  if (mission.isCompleted(mission.startTime)) {
    values.vueApp.activeMission = undefined
    values.points += mission.reward.points
    values.xp += mission.reward.xp
    values.completedMissions.push(mission)
    mission.completedTime = Date.now()
    save()
  }
}