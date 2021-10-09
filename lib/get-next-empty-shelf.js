//@ts-check
import { values, configs } from '../configs.js'
import { addShelf } from './add-shelf.js'
import { removeEmptyShelves } from './remove-empty-shelves.js'

export const getNextEmptyShelf = (spaces, height, ignoreShelfLimit) => {
  removeEmptyShelves()
  let shelf = values.shelves.find(shelf => {
    const usedSpaces = shelf.pots.reduce((t, pot) => t + pot.spaces, 0)
    return usedSpaces < 5 - spaces
  })
  if (!shelf) {
    if (values.shelves.length < values.maxShelfCount || ignoreShelfLimit) shelf = addShelf(height)
  }
  return shelf
}