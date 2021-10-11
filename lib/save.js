//@ts-check

import { values } from '../configs.js'
import { cloudSave } from './cloud-save.js';
import { debounce } from './debounce.js';
import { getSaveData } from "./get-save-obj.js";

export const save = () => {
  if (values.killed) return
  const data = getSaveData()
  localStorage.setItem('data', JSON.stringify(data))
  cloudSave(data)
}

export const debouncedSave = debounce(() => {
  save()
}, 1000)