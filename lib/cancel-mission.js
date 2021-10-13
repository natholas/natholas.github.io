//@ts-check

import { values } from "../configs.js"
import { save } from "./save.js"

export const cancelMission = () => {
  values.vueApp.activeMission = undefined
  save()
}