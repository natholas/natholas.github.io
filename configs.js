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
  maxShelfCount: 4,
  uid: undefined,
  app: undefined,
  vueApp: undefined,
  shelves: [],
  points: 0,
  bottomSprite: undefined,
  waterLevel: undefined,
  waterLevelSprite: undefined,
  killed: false,
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
  sounds: {},
  shelfLimitMenuSprites: [],
  plantInfoMenuSprites: [],
  loadingUserData: false,
  waters: [{start: Date.now() - 1000 * 60 * 60 * 5, end: Date.now() + configs.waterDrainTime}],
  lastSeenWaterLevel: 1
}