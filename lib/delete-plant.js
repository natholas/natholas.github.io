//@ts-check

import { values } from '../configs.js'
import { apply } from './apply.js'
import { fixShelves } from './fix-shelves.js'
import { getPlantGrowthPercent } from './get-plant-growth-percent.js'
import { getPlantQuality } from './get-plant-quality.js'
import { save } from './save.js'
import { closePlantInfoMenu } from './close-plant-info-menu.js'

export const deletePlant = (shelf, pot) => {
  const percent = getPlantGrowthPercent(pot.plant)
  if (percent < 1) {
    values.sounds.buttonDisabled.play()
    return false
  }
  values.sounds.button.play()

  if (!values.vueApp.stats.harvested[pot.plant.key]) values.vueApp.stats.harvested[pot.plant.key] = 0
  values.vueApp.stats.harvested[pot.plant.key] += 1
  const quality = getPlantQuality(pot.plant)
  values.points += pot.plant.value * quality / 100
  values.sounds.money.play()
  removePlant(shelf, pot)
  apply()
  save()
  return true
}

export const removePlant = (shelf, pot) => {
  values.app.stage.removeChild(pot.plant.sprite)
  values.app.stage.removeChild(pot.sprite)
  shelf.pots.splice(shelf.pots.indexOf(pot), 1)
  shelf.pots.forEach((pot, i) => {
    const spacesTaken = shelf.pots.slice(0, i).reduce((t, pot) => t + pot.spaces, 0)
    const x = 9 + spacesTaken * 28
    pot.sprite.x = x + pot.plant.sprite.width / 2 - pot.sprite.width / 2
  })
  if (values.vueApp.plantInfoMenuOpen) closePlantInfoMenu()
  fixShelves()
}