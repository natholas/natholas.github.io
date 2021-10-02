const numberOfShelves = 3
const shelfHeight = 48
const sizeMultiplier = 4
const topHeight = 28
const bottomHeight = 20
const waterDrainRate = 1000 * 4 * 10
const waterDrainAmount = 0.2
const speedRate = 1000 * 2
const maxWaterLevel = 4

let app = new PIXI.Application({ width: 128, height: topHeight + bottomHeight, backgroundAlpha: 0 });
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
document.body.appendChild(app.view);

const loader = PIXI.Loader.shared;
const sprites = {};
const shelves = []
let points = 20
let bottomSprite
let waterLevel = maxWaterLevel
let waterLevelSprite

let waterLevelText = document.getElementById('water-level')
let selectPlantMenuMeta = document.getElementById('select-plant-meta')

// load main textures
loader.add('bg', 'assets/bg.png')
loader.add('bg-top', 'assets/bg-top.png')
loader.add('bg-bottom', 'assets/bg-bottom.png')
loader.add('text-frame', 'assets/text-frame.png')
loader.add('water-level', 'assets/water-level.png')
loader.add('pot', 'assets/pot.png')

loader.add('plant-select-menu-bg', 'assets/plant-select-menu-bg.png')
loader.add('arrow-left', 'assets/buttons/arrow-left.png')
loader.add('arrow-right', 'assets/buttons/arrow-right.png')

// load buttons
loader.add('button_add-plant', 'assets/buttons/add-plant.png')
loader.add('button_water', 'assets/buttons/water.png')
loader.add('button_confirm', 'assets/buttons/confirm.png')
loader.add('button_close', 'assets/buttons/close.png')

let addPlantMenuSprites = []
let addPlantSelectedPlantIndex = 0

let leftArrow, rightArrow, addPlantMenuConfirmButton, addPlantMenuPot, addPlantMenuPreview, addPlantMenuBg

// load all plant stages
const plants = [
  
  {
    key: 'flower-1',
    growthTime: 15,
    growthRateVariation: 2,
    numberOfStages: 6,
    value: 2,
    cost: 1,
    spaces: 1
  },
  {
    key: 'cactus-1',
    growthTime: 35,
    growthRateVariation: 1.5,
    numberOfStages: 6,
    value: 4,
    cost: 2,
    spaces: 1
  },
  {
    key: 'fume-1',
    growthTime: 35,
    growthRateVariation: 1.5,
    numberOfStages: 1,
    value: 4,
    cost: 2,
    spaces: 1
  },
  {
    key: 'fume-2',
    growthTime: 35,
    growthRateVariation: 1.5,
    numberOfStages: 1,
    value: 4,
    cost: 2,
    spaces: 2
  },
]
plants.forEach(plant => {
  for (let i = 1; i <= plant.numberOfStages; i++) {
    loader.add(plant.key + '_stage-' + i, 'assets/'+ plant.key +'/stage-' + i +'.png')
  }
})

loader.load(() => {
  const topSprite = createSprite('bg-top')
  topSprite.y = 16

  bottomSprite = createSprite('bg-bottom')
  bottomSprite.y = topHeight

  for (let i = 0; i < 3; i++) addShelf()

  textFrame = createSprite('text-frame')

  waterLevelSprite = createSprite('water-level')
  waterLevelSprite.y = 6
  waterLevelSprite.x = 62
  waterLevelSprite.height = 8

  // Add buttons
  createSprite('button_add-plant', showSelectPlantMenu)

  const waterButtonSprite = createSprite('button_water', water)
  waterButtonSprite.x = 128 - waterButtonSprite.width
  updateTexts()
})

const createSprite = (name, onClick) => {
  const sprite = new PIXI.Sprite(loader.resources[name].texture)
  app.stage.addChild(sprite)
  if (onClick) {
    sprite.interactive = true
    sprite.on('pointerdown', onClick);
  }
  return sprite
}

const getRandomPlant = () => {
  const index = Math.floor(Math.random() * plants.length)
  return plants[index]
}

const growPlant = (pot) => {
  pot.plant.growthAmount += waterLevel
  if (pot.plant.growthAmount >= pot.plant.growthTime) {
    pot.plant.growthAmount = 0
    pot.plant.stage += 1
    pot.plant.sprite.texture = loader.resources[pot.plant.key + '_stage-' + pot.plant.stage].texture
  }
}

const addShelf = () => {
  const index = shelves.length
  const bgSprite = new PIXI.Sprite(loader.resources.bg.texture)
  bgSprite.y = topHeight + shelfHeight * index
  app.stage.addChild(bgSprite)
  bottomSprite.y = bgSprite.y + bgSprite.height
  const shelf = {sprite: bgSprite, pots: []}
  shelves.push(shelf)
  app.view.height += shelfHeight
  app.renderer.resize(128, app.view.height);
  return shelf
}

const deletePot = (shelf, pot) => {
  const template = plants.find(plant => plant.key === pot.plant.key)
  if (pot.plant.stage === template.numberOfStages) {
    points += pot.plant.value
  }
  app.stage.removeChild(pot.plant.sprite)
  app.stage.removeChild(pot.sprite)
  shelf.pots.splice(shelf.pots.indexOf(pot), 1)
  shelf.pots.forEach((pot, i) => {
    let offset = 5
    let previous = shelf.pots[i - 1]
    if (previous) offset = previous.sprite.x + previous.sprite.width * previous.spaces
    pot.sprite.x = offset + 4
    pot.plant.sprite.x = pot.sprite.x
  })
  updateTexts()
}

const getGrowthTime = (plantTemplate) => {
  const base = plantTemplate.growthTime
  const variation = (Math.random() * plantTemplate.growthRateVariation) - (plantTemplate.growthRateVariation/2)
  return Math.round(base + variation)
}

const water = () => {
  waterLevel = maxWaterLevel
  updateTexts()
}

const getNextEmptyShelf = () => {
  const shelf = shelves.find(shelf => shelf.pots.reduce((t, pot) => t + pot.spaces, 0) < 4)
  return shelf || addShelf()
}

const addPlant = (plantTemplate) => {
  if (points < plantTemplate.cost) return
  points -=  plantTemplate.cost
  let index = shelves.indexOf(getNextEmptyShelf())
  const shelf = shelves[index]
  const potSprite = new PIXI.Sprite(loader.resources.pot.texture)
  app.stage.addChild(potSprite)
  potSprite.y = topHeight + shelfHeight * index + shelfHeight - potSprite.height - 2

  const spacesTaken = shelf.pots.reduce((t, pot) => t + pot.spaces, 0)
  const x = 9 + spacesTaken * 28

  const pot = {sprite: potSprite, spaces: plantTemplate.spaces}
  const plantSprite = createSprite(plantTemplate.key + '_stage-1', () => deletePot(shelf, pot))

  potSprite.x = x + plantSprite.width / 2 - potSprite.width /2

  plantSprite.x = x
  plantSprite.y = pot.sprite.y + pot.sprite.height - plantSprite.height
  const growthTime = getGrowthTime(plantTemplate)
  pot.plant = {stage: 1, key: plantTemplate.key, sprite: plantSprite, growthTime, growthAmount: 0, value: plantTemplate.value}
  shelf.pots.push(pot)
  updateTexts()
}

const waterLoop = () => {
  if (!getTotalNumberOfPlants()) return
  if (waterLevel <= 0) return
  waterLevel -= waterDrainAmount
  updateTexts()
}

const getTotalNumberOfPlants = () => {
  let total = 0
  shelves.forEach(shelf => total += shelf.pots.length)
  return total
}

const loop = () => {
  shelves.forEach(shelf => {
    shelf.pots.forEach(pot => {
      const template = plants.find(plant => plant.key === pot.plant.key)
      if (pot.plant.stage === template.numberOfStages) return
      growPlant(pot)
    })
  })
}

const showSelectPlantMenu = () => {
  addPlantMenuBg = new PIXI.Sprite(loader.resources['plant-select-menu-bg'].texture)
  addPlantMenuBg.y = 26
  app.stage.addChild(addPlantMenuBg)
  addPlantMenuSprites.push(addPlantMenuBg)

  const closeButton = createSprite('button_close', closeSelectPlantMenu)
  closeButton.y = 31
  closeButton.x = addPlantMenuBg.width - closeButton.width - 5
  addPlantMenuSprites.push(closeButton)

  addPlantMenuConfirmButton = createSprite('button_confirm', () => {
    if (points < plants[addPlantSelectedPlantIndex].cost) return
    addPlant(plants[addPlantSelectedPlantIndex])
    closeSelectPlantMenu()
  })
  addPlantMenuConfirmButton.y = 126
  addPlantMenuConfirmButton.x = 35
  addPlantMenuSprites.push(addPlantMenuConfirmButton)

  const plant = plants[addPlantSelectedPlantIndex]
  addPlantMenuPreview = createSprite(plant.key + '_stage-' + plant.numberOfStages)
  addPlantMenuSprites.push(addPlantMenuPreview)

  addPlantMenuPot = createSprite('pot')
  addPlantMenuSprites.push(addPlantMenuPot)

  leftArrow = createSprite('arrow-left', () => {
    if (addPlantSelectedPlantIndex === 0) return
    addPlantSelectedPlantIndex -= 1
    handleAddPlantMenuButtonAlphas()
    const plant = plants[addPlantSelectedPlantIndex]
    addPlantMenuPreview.texture = loader.resources[plant.key + '_stage-' + plant.numberOfStages].texture
    setAddPlantMenuMeta()
  })
  leftArrow.x = 4
  leftArrow.y = 78
  addPlantMenuSprites.push(leftArrow)

  rightArrow = createSprite('arrow-right', () => {
    if (addPlantSelectedPlantIndex === plants.length - 1) return
    addPlantSelectedPlantIndex += 1
    handleAddPlantMenuButtonAlphas()
    const plant = plants[addPlantSelectedPlantIndex]
    addPlantMenuPreview.texture = loader.resources[plant.key + '_stage-' + plant.numberOfStages].texture
    setAddPlantMenuMeta()
  })
  rightArrow.x = 111
  rightArrow.y = 78
  addPlantMenuSprites.push(rightArrow)

  selectPlantMenuMeta.classList.add('shown')
  setAddPlantMenuMeta()
  handleAddPlantMenuButtonAlphas()
}

const setAddPlantMenuMeta = () => {
  const plant = plants[addPlantSelectedPlantIndex]
  selectPlantMenuMeta.innerHTML = `
  Cost: $${getAmountText(plant.cost)}<br>
  Value: $${getAmountText(plant.value)}<br>
  Time: ${getAmountText(plant.growthTime * plant.numberOfStages)}
  `
  addPlantMenuPreview.x = addPlantMenuBg.width / 2 - (addPlantMenuPreview.width / 2)
  addPlantMenuPreview.y = 20 + addPlantMenuBg.height / 2 - (addPlantMenuPreview.height / 2)
  addPlantMenuPot.x = addPlantMenuBg.width / 2 - (addPlantMenuPot.width / 2)
  addPlantMenuPot.y = addPlantMenuPreview.y + addPlantMenuPreview.height - addPlantMenuPot.height
}

const handleAddPlantMenuButtonAlphas = () => {
  rightArrow.alpha = 1
  leftArrow.alpha = 1
  addPlantMenuConfirmButton.alpha = 1
  if (addPlantSelectedPlantIndex === 0) leftArrow.alpha = 0.5
  if (addPlantSelectedPlantIndex === plants.length - 1) rightArrow.alpha = 0.5
  if (points < plants[addPlantSelectedPlantIndex].cost) addPlantMenuConfirmButton.alpha = 0.5
}

const closeSelectPlantMenu = () => {
  selectPlantMenuMeta.classList.remove('shown')
  addPlantMenuSprites.forEach(sprite => {
    app.stage.removeChild(sprite)
  })
}

updateTexts = () => {
  waterLevelText.innerText = "$" + getAmountText(points)
  const percent = 1 / maxWaterLevel * waterLevel
  waterLevelSprite.width = 33 * percent
}

const getAmountText = (value) => {
  const units = ['', 'K', 'M', 'B', 'T']
  let unitIndex = 0
  while (value >= 1000) {
    unitIndex += 1
    value /= 1000
  }

  let val = value.toFixed(1)
  if (val.endsWith('.0')) val = val.substring(0, val.length - 2)

  return val + units[unitIndex]
}

setInterval(loop, speedRate)
setInterval(waterLoop, waterDrainRate)