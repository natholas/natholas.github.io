//@ts-check
import { values, configs } from '../configs.js'
import { addShelf } from './add-shelf.js'

export const removeEmptyShelves = () => {
  const toDelete = values.shelves.filter(shelf => shelf.pots.length === 0)
  toDelete.forEach(shelf => {
    values.app.stage.removeChild(shelf.sprite)
    values.shelves.splice(values.shelves.indexOf(shelf), 1)
    values.app.view.height -= configs.shelfHeight
    values.app.renderer.resize(128, values.app.view.height);
  })
  while (values.shelves.length < configs.minShelves) addShelf()
  values.shelves.forEach((shelf, i) => shelf.sprite.y = configs.topHeight + configs.shelfHeight * i)
  const bottomShelf = values.shelves[values.shelves.length - 1]
  values.bottomSprite.y = bottomShelf.sprite.y + bottomShelf.sprite.height
}