//@ts-check
import { values } from '../configs.js'
import { addShelf } from './add-shelf.js'

export const getNextEmptyShelf = (spaces) => {
  const shelf = values.shelves.find(shelf => shelf.pots.reduce((t, pot) => t + pot.spaces, 0) < 5 - spaces)
  return shelf || addShelf()
}