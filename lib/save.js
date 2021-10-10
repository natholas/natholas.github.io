//@ts-check

import { values } from '../configs.js'
import { getSaveData } from "./get-save-obj.js";

export const save = () => {
  if (values.killed) return

  const data = getSaveData()
  localStorage.setItem('data', JSON.stringify(data))
}