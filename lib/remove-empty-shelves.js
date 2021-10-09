//@ts-check
import { values } from '../configs.js'

export const removeEmptyShelves = () => {
  const toDelete = values.shelves.filter(shelf => shelf.pots.length === 0)
  toDelete.forEach(shelf => {
    values.app.stage.removeChild(shelf.sprite)
    values.shelves.splice(values.shelves.indexOf(shelf), 1)
  })
}