const version = 4

const numberOfShelves = 3
const shelfHeight = 48
const sizeMultiplier = 4
const topHeight = 28
const bottomHeight = 20
const checkRate = 1000
const minShelves = 3
const waterDrainTime = 1000 * 60 * 15
const numberOfPots = 3

let timeScale = 1

let app = new PIXI.Application({ width: 128, height: topHeight + bottomHeight, backgroundAlpha: 0 });
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
document.body.appendChild(app.view);

const loader = PIXI.Loader.shared;
const sprites = {};
const shelves = []
let points = 4
let bottomSprite
let waterLevel
let waterLevelSprite
let killed = false
let plantMenuOpen = false

let lastUpdateTime = Date.now()
let lastWateredTime = Date.now()
let lastWaterCheckTime = Date.now()

let waterLevelText = document.getElementById('water-level')
let selectPlantMenuMeta = document.getElementById('select-plant-meta')

const sounds = {
  money: PIXI.sound.Sound.from({url: '/assets/sounds/money.mp3', autoPlay: false}),
  plant: PIXI.sound.Sound.from({url: '/assets/sounds/plant.mp3', autoPlay: false}),
  button: PIXI.sound.Sound.from({url: '/assets/sounds/button.mp3', autoPlay: false}),
  buttonDisabled: PIXI.sound.Sound.from({url: '/assets/sounds/button-disabled.mp3', autoPlay: false}),
  water: PIXI.sound.Sound.from({url: '/assets/sounds/water.mp3', autoPlay: false}),
  turn: PIXI.sound.Sound.from({url: '/assets/sounds/turn.mp3', autoPlay: false}),
}

// load main textures
loader.add('bg', 'assets/bg.png')
loader.add('bg-top', 'assets/bg-top.png')
loader.add('bg-bottom', 'assets/bg-bottom.png')
loader.add('text-frame', 'assets/text-frame.png')
loader.add('water-level', 'assets/water-level.png')

for (let i = 1; i <= numberOfPots; i++) {
  loader.add('pot-' + i, 'assets/pot-' + i + '.png')
}

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
let addPlantSelectedPotIndex = 0


let leftArrow, rightArrow, addPlantMenuConfirmButton, addPlantMenuPot, addPlantMenuPreview, addPlantMenuBg

// load all plant stages
const plants = [
  {
    key: 'flower-1',
    growthTime: 1000 * 60 * 1,
    numberOfStages: 6,
    value: 1,
    cost: 0.5,
    spaces: 1,
  },
  {
    key: 'flower-2',
    growthTime: 1000 * 60 * 2,
    numberOfStages: 5,
    value: 2,
    cost: 1,
    spaces: 1,
  },
  {
    key: 'cactus-1',
    growthTime: 1000 * 60 * 5,
    numberOfStages: 6,
    value: 10,
    cost: 5,
    spaces: 1,
  },
  {
    key: 'bush-1',
    growthTime: 1000 * 60 * 15,
    numberOfStages: 8,
    value: 50,
    cost: 20,
    spaces: 1,
  },
  {
    key: 'cactus-2',
    growthTime: 1000 * 60 * 25,
    numberOfStages: 7,
    value: 120,
    cost: 58,
    spaces: 1,
  },
  {
    key: 'big-1',
    growthTime: 1000 * 60 * 45,
    numberOfStages: 6,
    value: 190,
    cost: 88,
    spaces: 2,
  },
]
plants.forEach(plant => {
  for (let i = 0; i <= plant.numberOfStages; i++) {
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
  const stageGrowthTime = template.growthTime / template.numberOfStages
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
  if (plantMenuOpen) return
  const template = plants.find(plant => plant.key === pot.plant.key)
  if (pot.plant.stage !== template.numberOfStages) {
    sounds.buttonDisabled.play()
    return
  }
  sounds.button.play()

  if (pot.plant.stage === template.numberOfStages) {
    points += pot.plant.value
    sounds.money.play()
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

const water = () => {
  sounds.button.play()
  lastWateredTime = Date.now()
  sounds.water.play()
  apply()
}

const getNextEmptyShelf = (spaces) => {
  const shelf = shelves.find(shelf => shelf.pots.reduce((t, pot) => t + pot.spaces, 0) < 5 - spaces)
  return shelf || addShelf()
}

const addPlant = (plantTemplate, potIndex = 0) => {
  let index = shelves.indexOf(getNextEmptyShelf(plantTemplate.spaces))
  const shelf = shelves[index]
  const potSprite = createSprite('pot-' + (potIndex + 1))
  potSprite.parent = shelf.sprite
  potSprite.y = shelfHeight - potSprite.height - 2

  const spacesTaken = shelf.pots.reduce((t, pot) => t + pot.spaces, 0)
  const x = 9 + spacesTaken * 28

  const pot = {sprite: potSprite, spaces: plantTemplate.spaces, potIndex}
  const plantSprite = createSprite(plantTemplate.key + '_stage-0', () => deletePot(shelf, pot))

  potSprite.x = x + plantSprite.width / 2 - potSprite.width /2
  plantSprite.y = pot.sprite.height - plantSprite.height
  plantSprite.x = potSprite.width /2 - plantSprite.width / 2
  plantSprite.parent = potSprite
  pot.plant = {stage: 0, key: plantTemplate.key, sprite: plantSprite, growthAmount: 0, value: plantTemplate.value}
  shelf.pots.push(pot)
  return pot.plant
}

const getTotalNumberOfPlants = () => {
  let total = 0
  shelves.forEach(shelf => total += shelf.pots.length)
  return total
}

const applyWater = () => {
  let msSinceLastWatered = (Date.now() - lastWateredTime) * timeScale
  if (!getTotalNumberOfPlants()) lastWateredTime += (Date.now() - lastWaterCheckTime)

  waterLevel = Math.ceil(100 - (100 / waterDrainTime * msSinceLastWatered))
  if (waterLevel < 0) waterLevel = 0
  lastWaterCheckTime = Date.now()
}

const apply = () => {
  applyWater()
  let timePassed = Date.now() - lastUpdateTime
  let timeSinceLastWatered = Date.now() - lastWateredTime

  let wateredTime = waterDrainTime - timeSinceLastWatered
  if (wateredTime < 0) wateredTime = 0

  if (timePassed > wateredTime) timePassed = wateredTime
  lastUpdateTime = Date.now()

  shelves.forEach(shelf => shelf.pots.forEach(pot => setPlantStage(pot.plant, timePassed * timeScale)))
  updateTexts()
  save()
}

const showSelectPlantMenu = () => {
  if (plantMenuOpen) return sounds.buttonDisabled.play()
  plantMenuOpen = true
  sounds.button.play()
  addPlantMenuBg = new PIXI.Sprite(loader.resources['plant-select-menu-bg'].texture)
  addPlantMenuBg.y = 26
  app.stage.addChild(addPlantMenuBg)
  addPlantMenuSprites.push(addPlantMenuBg)

  const closeButton = createSprite('button_close', () => {
    sounds.button.play()
    closeSelectPlantMenu()
  })
  closeButton.y = 31
  closeButton.x = addPlantMenuBg.width - closeButton.width - 5
  addPlantMenuSprites.push(closeButton)

  addPlantMenuConfirmButton = createSprite('button_confirm', () => {
    if (points < plants[addPlantSelectedPlantIndex].cost) {
      sounds.buttonDisabled.play()
      return
    }
    addPlant(plants[addPlantSelectedPlantIndex], addPlantSelectedPotIndex)
    points -= plants[addPlantSelectedPlantIndex].cost
    apply()
    sounds.plant.play()
    closeSelectPlantMenu()
  })
  addPlantMenuConfirmButton.y = 126
  addPlantMenuConfirmButton.x = 35
  addPlantMenuSprites.push(addPlantMenuConfirmButton)

  const plant = plants[addPlantSelectedPlantIndex]
  addPlantMenuPreview = createSprite(plant.key + '_stage-' + plant.numberOfStages)
  addPlantMenuSprites.push(addPlantMenuPreview)

  addPlantMenuPot = createSprite('pot-' + (addPlantSelectedPotIndex + 1))
  addPlantMenuSprites.push(addPlantMenuPot)

  leftArrow = createSprite('arrow-left', () => {
    if (addPlantSelectedPlantIndex === 0) {
      sounds.buttonDisabled.play()
      return
    }
    sounds.turn.play()
    addPlantSelectedPlantIndex -= 1
    handleAddPlantMenuButtonAlphas()
    const plant = plants[addPlantSelectedPlantIndex]
    addPlantMenuPreview.texture = loader.resources[plant.key + '_stage-' + plant.numberOfStages].texture
    setAddPlantMenuMeta()
  })
  leftArrow.x = 4
  leftArrow.y = 72
  addPlantMenuSprites.push(leftArrow)

  rightArrow = createSprite('arrow-right', () => {
    if (addPlantSelectedPlantIndex === plants.length - 1) {
      sounds.buttonDisabled.play()
      return
    }
    sounds.turn.play()
    addPlantSelectedPlantIndex += 1
    handleAddPlantMenuButtonAlphas()
    const plant = plants[addPlantSelectedPlantIndex]
    addPlantMenuPreview.texture = loader.resources[plant.key + '_stage-' + plant.numberOfStages].texture
    setAddPlantMenuMeta()
  })
  rightArrow.x = 111
  rightArrow.y = 72
  addPlantMenuSprites.push(rightArrow)


  leftPotArrow = createSprite('arrow-left', () => {
    if (addPlantSelectedPotIndex === 0) {
      sounds.buttonDisabled.play()
      return
    }
    sounds.button.play()
    addPlantSelectedPotIndex -= 1
    handleAddPlantMenuButtonAlphas() // todo

    addPlantMenuPot.texture = loader.resources['pot-' + (addPlantSelectedPotIndex + 1)].texture

    setAddPlantMenuMeta()
  })
  leftPotArrow.x = 4
  leftPotArrow.y = 86
  addPlantMenuSprites.push(leftPotArrow)

  rightPotArrow = createSprite('arrow-right', () => {
    if (addPlantSelectedPotIndex === numberOfPots - 1) {
      sounds.buttonDisabled.play()
      return
    }
    sounds.button.play()
    addPlantSelectedPotIndex += 1
    handleAddPlantMenuButtonAlphas() // todo

    addPlantMenuPot.texture = loader.resources['pot-' + (addPlantSelectedPotIndex + 1)].texture

    setAddPlantMenuMeta()
  })
  rightPotArrow.x = 111
  rightPotArrow.y = 86
  addPlantMenuSprites.push(rightPotArrow)


  selectPlantMenuMeta.classList.add('shown')
  setAddPlantMenuMeta()
  handleAddPlantMenuButtonAlphas()
}

const setAddPlantMenuMeta = () => {
  const template = plants[addPlantSelectedPlantIndex]
  selectPlantMenuMeta.innerHTML = `
  
  $${getAmountText(template.cost)} - 
  ${getTimeAmount(template.growthTime)}<br>
  Sell: $${getAmountText(template.value)}
  `
  addPlantMenuPreview.x = addPlantMenuBg.width / 2 - (addPlantMenuPreview.width / 2)
  addPlantMenuPreview.y = 20 + addPlantMenuBg.height / 2 - (addPlantMenuPreview.height / 2)
  addPlantMenuPot.x = addPlantMenuBg.width / 2 - (addPlantMenuPot.width / 2)
  addPlantMenuPot.y = addPlantMenuPreview.y + addPlantMenuPreview.height - addPlantMenuPot.height
}

const handleAddPlantMenuButtonAlphas = () => {
  rightArrow.alpha = 1
  leftArrow.alpha = 1
  rightPotArrow.alpha = 1
  leftPotArrow.alpha = 1
  addPlantMenuConfirmButton.alpha = 1
  if (addPlantSelectedPlantIndex === 0) leftArrow.alpha = 0.5
  if (addPlantSelectedPlantIndex === plants.length - 1) rightArrow.alpha = 0.5
  if (addPlantSelectedPotIndex === 0) leftPotArrow.alpha = 0.5
  if (addPlantSelectedPotIndex === numberOfPots - 1) rightPotArrow.alpha = 0.5
  if (points < plants[addPlantSelectedPlantIndex].cost) addPlantMenuConfirmButton.alpha = 0.5
}

const closeSelectPlantMenu = () => {
  plantMenuOpen = false
  selectPlantMenuMeta.classList.remove('shown')
  addPlantMenuSprites.forEach(sprite => {
    app.stage.removeChild(sprite)
  })
}

updateTexts = () => {
  waterLevelText.innerText = "$" + getAmountText(points)
  const percent = waterLevel / 100
  if (percent > 1) percent = 1
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
    addPlantSelectedPotIndex,
    points,
    shelves: shelves.map(shelf => {
      return shelf.pots.map(pot => {
        return {
          key: pot.plant.key,
          growthAmount: pot.plant.growthAmount,
          stage: pot.plant.stage,
          potIndex: pot.potIndex
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
    addPlantSelectedPotIndex = data.addPlantSelectedPotIndex || 0
    points = data.points
    data.shelves.forEach(shelfData => {
      shelfData.forEach(plantData => {
        let template = plants.find(p => p.key === plantData.key)
        const plant = addPlant(template, plantData.potIndex)
        plant.growthAmount = plantData.growthAmount
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

