//@ts-check
import { values, configs } from '../configs.js'
import { createSprite } from './create-sprite.js'

export const addShelf = () => {
  const index = values.shelves.length
  const shelfSprite = createSprite('bg')
  shelfSprite.y = configs.topHeight + configs.shelfHeight * index
  values.bottomSprite.y = shelfSprite.y + shelfSprite.height
  const shelf = {sprite: shelfSprite, pots: []}
  values.shelves.push(shelf)
  values.app.view.height += configs.shelfHeight
  values.app.renderer.resize(128, values.app.view.height);
  return shelf
}