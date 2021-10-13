//@ts-check

import { values } from '../configs.js'
import { cloudSave } from './cloud-save.js';
import { debounce } from './debounce.js';
import { getSaveMissionsData } from './get-save-missions-obj.js';
import { getSaveData } from "./get-save-obj.js";

export const save = () => {
  if (values.killed) return
  const data = getSaveData()
  const missionData = getSaveMissionsData()
  localStorage.setItem('data', JSON.stringify(data))
  localStorage.setItem('missions', JSON.stringify(missionData))
  cloudSave(data, missionData)
}

export const debouncedSave = debounce(() => {
  save()
}, 1000)