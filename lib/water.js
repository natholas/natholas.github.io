//@ts-check
import { values } from '../configs.js'
import { apply } from './apply.js'

export const water = () => {
  values.sounds.button.play()
  values.lastWateredTime = Date.now()
  values.sounds.water.play()
  apply()
}