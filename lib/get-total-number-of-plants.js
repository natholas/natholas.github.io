//@ts-check
import { values } from '../configs.js'

export const getTotalNumberOfPlants = () => {
  let total = 0
  values.shelves.forEach(shelf => total += shelf.pots.length)
  return total
}