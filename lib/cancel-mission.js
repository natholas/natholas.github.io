//@ts-check

import { values } from "../configs.js"
import { debouncedSave } from "./save.js"

export const cancelMission = () => {
  values.vueApp.activeMission = undefined
  debouncedSave()
}