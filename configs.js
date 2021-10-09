//@ts-check

export const configs = {
  version: 4,
  shelfHeight: 48,
  topHeight: 28,
  bottomHeight: 20,
  numberOfPots: 7,
  checkRate: 1000,
  minShelves: 4,
  waterDrainTime: 1000 * 60 * 30,
  shelfBaseCost: 100,
  shelfCostMultiplier: 3,
  timeScale: 1,
  scale: 2
}

export const values = {
  stats: {waters: 0, planted: {}, harvested: {}},
  app: undefined,
  shelves: [],
  points: 0,
  bottomSprite: undefined,
  waterLevel: undefined,
  waterLevelSprite: undefined,
  killed: false,
  lastUpdateTime: Date.now(),
  lastWateredTime: Date.now(),
  lastWaterCheckTime: Date.now(),
  plantMenuOpen: false,
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
  sounds: {},
  shelfLimitMenuOpen: false,
  shelfLimitMenuSprites: [],
  plantInfoMenuOpen: false,
  plantInfoMenuSprites: [],
}

export const htmlElements = {
  selectPlantMenuMeta: document.getElementById('select-plant-meta'),
  shelfLimitMenuMeta: document.getElementById('shelf-limit-meta'),
  plantInfoMeta: document.getElementById('plant-info-meta'),
  waterLevelText: document.getElementById('water-level')
}