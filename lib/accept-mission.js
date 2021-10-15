//@ts-check

import { values } from "../configs.js"
import { debouncedSave, save } from "./save.js"

export const acceptMission = (mission) => {
  values.vueApp.activeMission = mission
  mission.startTime = Date.now()
  debouncedSave()
}