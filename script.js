const numberOfShelves = 3
const shelfHeight = 48
const sizeMultiplier = 4
const topHeight = 13
const bottomHeight = 20
const waterDrainRate = 1000 * 4
const waterDrainAmount = 0.2
const speedRate = 1000
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

let leftArrow, rightArrow, addPlantMenuConfirmButton

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
]
plants.forEach(plant => {
  for (let i = 1; i <= 6; i++) {
    loader.add(plant.key + '_stage-' + i, 'assets/'+ plant.key +'/stage-' + i +'.png')
  }
})

loader.load(() => {
  const topSprite = new PIXI.Sprite(loader.resources['bg-top'].texture)
  topSprite.y = 1
  app.stage.addChild(topSprite)

  bottomSprite = new PIXI.Sprite(loader.resources['bg-bottom'].texture)
  bottomSprite.y = topHeight
  app.stage.addChild(bottomSprite)

  for (let i = 0; i < 3; i++) addShelf()

  textFrame = new PIXI.Sprite(loader.resources['text-frame'].texture)
  app.stage.addChild(textFrame)

  waterLevelSprite = new PIXI.TilingSprite(loader.resources['water-level'].texture)
  waterLevelSprite.y = 6
  waterLevelSprite.x = 62
  waterLevelSprite.height = 8
  app.stage.addChild(waterLevelSprite)

  // Add buttons
  const addPlantButton = new PIXI.Sprite(loader.resources['button_add-plant'].texture)
  app.stage.addChild(addPlantButton)
  addPlantButton.interactive = true
  addPlantButton.on('pointerdown', (event) => {
    showSelectPlantMenu()
  });

  const waterButtonSprite = new PIXI.Sprite(loader.resources['button_water'].texture)
  app.stage.addChild(waterButtonSprite)
  waterButtonSprite.interactive = true
  waterButtonSprite.x = 128 - waterButtonSprite.width
  waterButtonSprite.on('pointerdown', (event) => {
    water()
  });
  updateTexts()
})

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
  potSprite.y = topHeight + shelfHeight * index + shelfHeight - potSprite.height - 2
  let offset = 5
  let previous = shelf.pots[shelf.pots.length - 1]
  if (previous) offset = previous.sprite.x + previous.sprite.width * previous.spaces
  potSprite.x = offset + 4
  app.stage.addChild(potSprite)

  const pot = {sprite: potSprite, spaces: plantTemplate.spaces}
  const plantSprite = new PIXI.Sprite(loader.resources[plantTemplate.key + '_stage-1'].texture)
  plantSprite.interactive = true
  plantSprite.on('pointerdown', () => deletePot(shelf, pot))
  plantSprite.x = pot.sprite.x
  plantSprite.y = pot.sprite.y
  const growthTime = getGrowthTime(plantTemplate)
  pot.plant = {stage: 1, key: plantTemplate.key, sprite: plantSprite, growthTime, growthAmount: 0, value: plantTemplate.value}
  app.stage.addChild(plantSprite)
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
  const menuBg = new PIXI.Sprite(loader.resources['plant-select-menu-bg'].texture)
  menuBg.y = 20
  app.stage.addChild(menuBg)
  addPlantMenuSprites.push(menuBg)

  const closeButton = new PIXI.Sprite(loader.resources['button_close'].texture)
  app.stage.addChild(closeButton)
  closeButton.y = 25
  closeButton.x = menuBg.width - closeButton.width - 5
  closeButton.interactive = true
  closeButton.on('pointerdown', () => {
    closeSelectPlantMenu()
  })
  addPlantMenuSprites.push(closeButton)

  addPlantMenuConfirmButton = new PIXI.Sprite(loader.resources['button_confirm'].texture)
  app.stage.addChild(addPlantMenuConfirmButton)
  addPlantMenuConfirmButton.y = 120
  addPlantMenuConfirmButton.x = 35
  addPlantMenuConfirmButton.interactive = true
  addPlantMenuConfirmButton.on('pointerdown', () => {
    if (points < plants[addPlantSelectedPlantIndex].cost) return
    addPlant(plants[addPlantSelectedPlantIndex])
    closeSelectPlantMenu()
  })
  addPlantMenuSprites.push(addPlantMenuConfirmButton)

  const plant = plants[addPlantSelectedPlantIndex]
  const preview = new PIXI.Sprite(loader.resources[plant.key + '_stage-' + plant.numberOfStages].texture)
  app.stage.addChild(preview)
  preview.x = menuBg.width / 2 - (preview.width / 2)
  preview.y = 20 + menuBg.height / 2 - (preview.height / 2)
  addPlantMenuSprites.push(preview)

  const pot = new PIXI.Sprite(loader.resources['pot'].texture)
  app.stage.addChild(pot)
  pot.x = preview.x
  pot.y = preview.y
  addPlantMenuSprites.push(pot)

  leftArrow = new PIXI.Sprite(loader.resources['arrow-left'].texture)
  app.stage.addChild(leftArrow)
  leftArrow.y = 74
  leftArrow.x = 4
  leftArrow.interactive = true
  leftArrow.on('pointerdown', () => {
    if (addPlantSelectedPlantIndex === 0) return
    addPlantSelectedPlantIndex -= 1
    handleAddPlantMenuButtonAlphas()
    const plant = plants[addPlantSelectedPlantIndex]
    preview.texture = loader.resources[plant.key + '_stage-' + plant.numberOfStages].texture
    setAddPlantMenuMeta()
  })
  addPlantMenuSprites.push(leftArrow)

  rightArrow = new PIXI.Sprite(loader.resources['arrow-right'].texture)
  app.stage.addChild(rightArrow)
  rightArrow.y = 74
  rightArrow.x = 111
  rightArrow.interactive = true
  rightArrow.on('pointerdown', () => {
    if (addPlantSelectedPlantIndex === plants.length - 1) return
    addPlantSelectedPlantIndex += 1
    handleAddPlantMenuButtonAlphas()
    const plant = plants[addPlantSelectedPlantIndex]
    preview.texture = loader.resources[plant.key + '_stage-' + plant.numberOfStages].texture
    setAddPlantMenuMeta()
  })
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

setInterval(loop, speedRate)

setInterval(waterLoop, waterDrainRate)

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