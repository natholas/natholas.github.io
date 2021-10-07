//@ts-check
import { values, configs } from '../configs.js'
import { createBackgroundSprite } from './create-sprite.js'

export const addShelf = (height) => {
  const shelfSprite = createBackgroundSprite('shelf-' + height)
  const totalHeight = values.shelves.reduce((t, shelf) => t + shelf.sprite.height, 0)
  shelfSprite.y = configs.topHeight + totalHeight
  const shelf = {sprite: shelfSprite, pots: [], height}
  values.shelves.push(shelf)
  return shelf
}