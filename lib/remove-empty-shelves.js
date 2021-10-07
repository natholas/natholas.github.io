//@ts-check
import { values, configs } from '../configs.js'

export const removeEmptyShelves = () => {
  const toDelete = values.shelves.filter(shelf => shelf.pots.length === 0)
  toDelete.forEach(shelf => {
    values.app.stage.removeChild(shelf.sprite)
    values.shelves.splice(values.shelves.indexOf(shelf), 1)
    values.app.view.height -= configs.shelfHeight
    values.app.renderer.resize(128, values.app.view.height);
  })
}