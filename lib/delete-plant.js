//@ts-check

import { values } from '../configs.js'
import { plants } from '../plants.js'
import { apply } from './apply.js'
import { fixShelves } from './fix-shelves.js'

export const deletePlant = (shelf, pot) => {
  const template = plants.find(plant => plant.key === pot.plant.key)
  if (pot.plant.stage !== template.numberOfStages) {
    values.sounds.buttonDisabled.play()
    return
  }
  values.sounds.button.play()

  if (!values.stats.planted[pot.plant.key]) values.stats.harvested[pot.plant.key] = 0
  values.stats.harvested[pot.plant.key] += 1

  values.points += pot.plant.value
  values.sounds.money.play()
  values.app.stage.removeChild(pot.plant.sprite)
  values.app.stage.removeChild(pot.sprite)
  shelf.pots.splice(shelf.pots.indexOf(pot), 1)
  shelf.pots.forEach((pot, i) => {
    const spacesTaken = shelf.pots.slice(0, i).reduce((t, pot) => t + pot.spaces, 0)
    const x = 9 + spacesTaken * 28
    pot.sprite.x = x + pot.plant.sprite.width / 2 - pot.sprite.width / 2
  })
  fixShelves()
  apply()
}