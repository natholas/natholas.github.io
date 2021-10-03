const version = 3

const numberOfShelves = 3
const shelfHeight = 48
const sizeMultiplier = 4
const topHeight = 28
const bottomHeight = 20
const waterDrainAmount = 0.2
const checkRate = 1000
const maxWaterLevel = 4
const minShelves = 3
const waterDrainTime = 1000 * 60 * 15

let app = new PIXI.Application({ width: 128, height: topHeight + bottomHeight, backgroundAlpha: 0 });
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
document.body.appendChild(app.view);

const loader = PIXI.Loader.shared;
const sprites = {};
const shelves = []
let points = 4
let bottomSprite
let waterLevel = maxWaterLevel
let waterLevelSprite
let killed = false

let lastUpdateTime = Date.now()
let lastWateredTime = Date.now()

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
    growthTime: 1000 * 60 * 1,
    growthRateVariation: 1.5,
    numberOfStages: 6,
    value: 1.5,
    cost: 1,
    spaces: 1,
  },
  {
    key: 'flower-2',
    growthTime: 1000 * 60 * 2,
    growthRateVariation: 1.5,
    numberOfStages: 5,
    value: 2.3,
    cost: 1.5,
    spaces: 1,
  },
  {
    key: 'cactus-1',
    growthTime: 1000 * 60 * 5,
    growthRateVariation: 1.5,
    numberOfStages: 6,
    value: 15,
    cost: 5,
    spaces: 1,
  },
  {
    key: 'bush-1',
    growthTime: 1000 * 60 * 15,
    growthRateVariation: 1.5,
    numberOfStages: 8,
    value: 50,
    cost: 20,
    spaces: 1,
  },
  {
    key: 'big-1',
    growthTime: 1000 * 60 * 45,
    growthRateVariation: 1.5,
    numberOfStages: 6,
    value: 40,
    cost: 25,
    spaces: 2,
  },
]
plants.forEach(plant => {
  for (let i = 1; i <= plant.numberOfStages; i++) {
    loader.add(plant.key + '_stage-' + i, 'assets/'+ plant.key +'/stage-' + i +'.png')
  }
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

// timePassed: amount of time the plant has been growing for since last check
const setPlantStage = (plant, timePassed) => {
  const template = plants.find(_plant => _plant.key === plant.key)
  plant.growthAmount += timePassed
  const stageGrowthTime = plant.growthTime / template.numberOfStages
  while (plant.growthAmount >= stageGrowthTime) {
    if (plant.stage === template.numberOfStages) break
    plant.growthAmount -= stageGrowthTime
    plant.stage += 1
  }
  plant.sprite.texture = loader.resources[plant.key + '_stage-' + plant.stage].texture
}

const addShelf = () => {
  const index = shelves.length
  const shelfSprite = createSprite('bg')
  shelfSprite.y = topHeight + shelfHeight * index
  bottomSprite.y = shelfSprite.y + shelfSprite.height
  const shelf = {sprite: shelfSprite, pots: []}
  shelves.push(shelf)
  app.view.height += shelfHeight
  app.renderer.resize(128, app.view.height);
  return shelf
}

const deletePot = (shelf, pot) => {
  const template = plants.find(plant => plant.key === pot.plant.key)
  if (pot.plant.stage === template.numberOfStages) {
    points += pot.plant.value
  } else {
    points += template.cost
  }
  app.stage.removeChild(pot.plant.sprite)
  app.stage.removeChild(pot.sprite)
  shelf.pots.splice(shelf.pots.indexOf(pot), 1)
  shelf.pots.forEach((pot, i) => {
    const spacesTaken = shelf.pots.slice(0, i).reduce((t, pot) => t + pot.spaces, 0)
    const x = 9 + spacesTaken * 28
    pot.sprite.x = x + pot.plant.sprite.width / 2 - pot.sprite.width /2
  })

  removeEmptyShelves()
  apply()
}

const removeEmptyShelves = () => {
  const toDelete = shelves.filter(shelf => shelf.pots.length === 0)
  toDelete.forEach(shelf => {
    app.stage.removeChild(shelf.sprite)
    shelves.splice(shelves.indexOf(shelf), 1)
    app.view.height -= shelfHeight
    app.renderer.resize(128, app.view.height);
  })
  while (shelves.length < minShelves) addShelf()
  shelves.forEach((shelf, i) => shelf.sprite.y =  topHeight + shelfHeight * i)
}

const getRandomGrowthTime = (plantTemplate) => {
  const base = plantTemplate.growthTime
  const variation = (Math.random() * plantTemplate.growthRateVariation) - (plantTemplate.growthRateVariation/2)
  return Math.round(base + variation)
}

const water = () => {
  lastWateredTime = Date.now()
  apply()
}

const getNextEmptyShelf = (spaces) => {
  const shelf = shelves.find(shelf => shelf.pots.reduce((t, pot) => t + pot.spaces, 0) < 5 - spaces)
  return shelf || addShelf()
}

const addPlant = (plantTemplate) => {
  let index = shelves.indexOf(getNextEmptyShelf(plantTemplate.spaces))
  const shelf = shelves[index]
  const potSprite = new PIXI.Sprite(loader.resources.pot.texture)
  app.stage.addChild(potSprite)
  potSprite.parent = shelf.sprite
  potSprite.y = shelfHeight - potSprite.height - 2

  const spacesTaken = shelf.pots.reduce((t, pot) => t + pot.spaces, 0)
  const x = 9 + spacesTaken * 28

  const pot = {sprite: potSprite, spaces: plantTemplate.spaces}
  const plantSprite = createSprite(plantTemplate.key + '_stage-1', () => deletePot(shelf, pot))

  potSprite.x = x + plantSprite.width / 2 - potSprite.width /2
  plantSprite.y = pot.sprite.height - plantSprite.height
  plantSprite.x = potSprite.width /2 - plantSprite.width / 2
  plantSprite.parent = potSprite
  const growthTime = getRandomGrowthTime(plantTemplate)
  pot.plant = {stage: 1, key: plantTemplate.key, sprite: plantSprite, growthTime, growthAmount: 0, value: plantTemplate.value}
  shelf.pots.push(pot)
  return pot.plant
}

const applyWater = () => {
  if (!getTotalNumberOfPlants()) lastWateredTime = Date.now()
  let timeSinceLastWatered = Date.now() - lastWateredTime
  waterLevel = 100 - (100 / waterDrainTime * timeSinceLastWatered)
  if (waterLevel < 0) waterLevel = 0
}

const getTotalNumberOfPlants = () => {
  let total = 0
  shelves.forEach(shelf => total += shelf.pots.length)
  return total
}

const apply = () => {
  applyWater()
  let timePassed = Date.now() - lastUpdateTime
  let timeSinceLastWatered = Date.now() - lastWateredTime

  let wateredTime = waterDrainTime - timeSinceLastWatered
  if (wateredTime < 0) wateredTime = 0

  if (timePassed > wateredTime) timePassed = wateredTime
  lastUpdateTime = Date.now()

  shelves.forEach(shelf => {
    shelf.pots.forEach(pot => setPlantStage(pot.plant, timePassed))
  })
  updateTexts()
  save()
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
    points -= plants[addPlantSelectedPlantIndex].cost
    apply()
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
  
  $${getAmountText(plant.cost)} - 
  ${getTimeAmount(plant.growthTime)}<br>
  Sell: $${getAmountText(plant.value)}
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
  const percent = waterLevel / 100
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

const getTimeAmount = (value) => {
  value /= 1000
  let suffix = 'S'
  if (value >= 60) {
    suffix = ' minute'
    value /= 60
    if (value >= 60) {
      suffix = ' hour'
      value /= 60
      if (value >= 24) {
        suffix = ' day'
        value /= 24
      }
    }
  }
  value = Math.round(value)
  if (value !== 1 && suffix) suffix += 's'
  return value + suffix
}

const save = () => {
  if (killed) return
  let data = {
    version,
    lastUpdateTime,
    lastWateredTime,
    addPlantSelectedPlantIndex,
    points,
    shelves: shelves.map(shelf => {
      return shelf.pots.map(pot => {
        return {
          key: pot.plant.key,
          growthAmount: pot.plant.growthAmount,
          growthTime: pot.plant.growthTime,
          stage: pot.plant.stage,
        }
      })
    }).filter(a => a.length)
  }
  localStorage.setItem('data', JSON.stringify(data))
}

const load = (data) => {
  let shelfCount = minShelves
  if (data && data.shelves.length > shelfCount) shelfCount = data.shelves.length
  init(shelfCount)

  if (data) {
    lastUpdateTime = data.lastUpdateTime
    lastWateredTime = data.lastWateredTime
    addPlantSelectedPlantIndex = data.addPlantSelectedPlantIndex
    points = data.points
    data.shelves.forEach(shelfData => {
      shelfData.forEach(plantData => {
        let template = plants.find(p => p.key === plantData.key)
        const plant = addPlant(template)
        plant.growthAmount = plantData.growthAmount
        plant.growthTime = plantData.growthTime
        plant.stage = plantData.stage
      })
    })
  }

  apply()
  setInterval(apply, checkRate)
}

const init = (numberOfShelves) => {
  const topSprite = createSprite('bg-top')
  topSprite.y = 16
  bottomSprite = createSprite('bg-bottom')
  bottomSprite.y = topHeight

  for (let i = 0; i < numberOfShelves; i++) addShelf()

  textFrame = createSprite('text-frame')

  waterLevelSprite = createSprite('water-level')
  waterLevelSprite.y = 6
  waterLevelSprite.x = 62
  waterLevelSprite.height = 8

  // Add buttons
  createSprite('button_add-plant', showSelectPlantMenu)

  const waterButtonSprite = createSprite('button_water', water)
  waterButtonSprite.x = 128 - waterButtonSprite.width
}

const reset = () => {
  if (!confirm('Are you sure?')) return
  localStorage.removeItem('data')
  killed = true
  window.location.reload()
}


loader.load(() => {
  let data
  try {
    data = JSON.parse(localStorage.getItem('data'))
    if (data.version !== version) data = undefined
  } catch(e) {}
  load(data)
})

