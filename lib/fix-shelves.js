//@ts-check
import { configs, values } from '../configs.js'
import { addMinShelves } from './add-min-shelves.js'
import { removeEmptyShelves } from './remove-empty-shelves.js'

export const fixShelves = () => {
  removeEmptyShelves()
  addMinShelves()

  values.shelves.forEach((shelf, i) => {
    let maxHeight = Math.max(...shelf.pots.map(p => p.plant.height))
    if (maxHeight < 1) maxHeight = 1
    if (shelf.height !== maxHeight) {
      shelf.sprite.texture = PIXI['Loader'].shared.resources['shelf-' + maxHeight].texture
      shelf.height = maxHeight
  
      shelf.pots.forEach(pot => {
        pot.sprite.y = shelf.sprite.height - pot.sprite.height
      })
    }
    const previous = values.shelves[i - 1]
    if (previous) {
      shelf.sprite.y = previous.sprite.y + previous.sprite.height
    } else {
      shelf.sprite.y = configs.topHeight + configs.spacingTop
    }
  })

  const bottomShelf = values.shelves[values.shelves.length - 1]
  if (bottomShelf) values.bottomSprite.y = bottomShelf.sprite.y + bottomShelf.sprite.height

  values.app.view.height = values.bottomSprite.y + values.bottomSprite.height
  values.app.renderer.resize(128, values.app.view.height);
}