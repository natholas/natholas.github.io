//@ts-check

export const configs = {
  version: 4,
  shelfHeight: 48,
  topHeight: 28,
  bottomHeight: 20,
  checkRate: 1000,
  minShelves: 4,
  waterDrainTime: 1000 * 60 * 30,
  numberOfPots: 7,
  timeScale: 1,
}

export const values = {
  app: undefined,
  shelves: [],
  points: 4,
  bottomSprite: undefined,
  waterLevel: undefined,
  waterLevelSprite: undefined,
  killed: false,
  plantMenuOpen: false,
  lastUpdateTime: Date.now(),
  lastWateredTime: Date.now(),
  lastWaterCheckTime: Date.now(),
  addPlantMenuSprites: [],
  addPlantSelectedPlantIndex: 0,
  addPlantSelectedPotIndex: 0,
  leftArrow: undefined,
  rightArrow: undefined,
  addPlantMenuConfirmButton: undefined,
  addPlantMenuPot: undefined,
  addPlantMenuPreview: undefined,
  addPlantMenuBg: undefined,
  leftPotArrow: undefined,
  rightPotArrow: undefined,
  sounds: {}
}

export const htmlElements = {
  selectPlantMenuMeta: document.getElementById('select-plant-meta'),
  waterLevelText: document.getElementById('water-level')
}