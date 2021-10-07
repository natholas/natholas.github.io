//@ts-check
import { values } from '../configs.js'
import { addShelf } from './add-shelf.js'
import { removeEmptyShelves } from './remove-empty-shelves.js'

export const getNextEmptyShelf = (spaces, height) => {
  removeEmptyShelves()
  let shelf = values.shelves.find(shelf => {
    const usedSpaces = shelf.pots.reduce((t, pot) => t + pot.spaces, 0)
    return usedSpaces < 5 - spaces
  })
  if (!shelf) shelf = addShelf(height)
  return shelf
}