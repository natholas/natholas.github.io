//@ts-check

import { values, configs } from "../configs.js"

const levels = [
  'Novice Gardener',
  'Hobbyist Gardener',
  'Amateur Gardener',
  'Apprentice Gardener',
  'Gardener',
  'Experienced Gardener',
  'Senior Gardener',
  'Expert Gardener',
  'Amazing Gardener',
  'Epic Gardener',
  'Master Gardener',
  'Elder Gardener',
  'God Gardener',
  'God Gardener',
  'God Gardener',
  'God Gardener',
  'God Gardener',
  'God Gardener',
  'God Gardener',
]

export const calcLevel = (offset = 0) => {
  let remainingXp = values.xp
  let level = 0
  let xpRequired = configs.xpLevelRequirement
  while (true) {
    xpRequired *= configs.xpLevelMultiplier
    if (remainingXp < xpRequired) break
    level += 1
    remainingXp -= xpRequired
  }
  return level + offset
}

export const getLevel = (offset = 0) => {

  return levels[calcLevel(offset)]
}

export const xpToGoForNextLevel = () => {
  let remainingXp = values.xp
  let level = 0
  let xpRequired = configs.xpLevelRequirement
  while (true) {
    xpRequired *= configs.xpLevelMultiplier
    if (remainingXp < xpRequired) break
    level += 1
    remainingXp -= xpRequired
  }
  return remainingXp
}

export const totalXpNextLevel = () => {
  let remainingXp = values.xp
  let level = 0
  let xpRequired = configs.xpLevelRequirement
  while (true) {
    xpRequired *= configs.xpLevelMultiplier
    if (remainingXp < xpRequired) break
    level += 1
    remainingXp -= xpRequired
  }
  return xpRequired
}

export const nextLevelPercent = () => {
  let remainingXp = values.xp
  let level = 0
  let xpRequired = configs.xpLevelRequirement
  while (true) {
    xpRequired *= configs.xpLevelMultiplier
    if (remainingXp < xpRequired) break
    level += 1
    remainingXp -= xpRequired
  }
  return 100 / xpRequired * remainingXp
}