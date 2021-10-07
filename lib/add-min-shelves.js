//@ts-check

import { configs, values } from '../configs.js'
import { addShelf } from './add-shelf.js'

export const addMinShelves = () => {
  while (values.shelves.length < configs.minShelves) addShelf(1)
}