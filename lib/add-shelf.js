//@ts-check
import { values, configs } from '../configs.js'
import { createSprite } from './create-sprite.js'

export const addShelf = (height) => {
  const shelfSprite = createSprite('shelf-' + height)
  const shelf = {sprite: shelfSprite, pots: [], height}
  values.shelves.push(shelf)
  return shelf
}