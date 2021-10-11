//@ts-check
import { values } from '../configs.js'

export const getAllPlants = () => {
  let plants = []
  values.shelves.forEach(shelf => shelf.pots.forEach(p => plants.push(p.plant)))
  return plants
}