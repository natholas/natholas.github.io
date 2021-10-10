//@ts-check
import { values } from '../configs.js'
import { apply } from './apply.js'
import { cloudSaveDebounced } from './cloud-save.js'

export const water = () => {
  values.sounds.button.play()
  values.lastWateredTime = Date.now()
  values.sounds.water.play()
  values.vueApp.stats.waters += 1
  cloudSaveDebounced()
  apply()
}