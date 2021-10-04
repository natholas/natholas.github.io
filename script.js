//@ts-check
import { plants } from './plants.js'
import { configs, values } from './configs.js'

const app = new PIXI['Application']({ width: 128, height: configs.topHeight + configs.bottomHeight, backgroundAlpha: 0 });
PIXI.settings.SCALE_MODE = PIXI['SCALE_MODES'].NEAREST;
document.body.appendChild(app.view);

const loader = PIXI['Loader'].shared;

let waterLevelText = document.getElementById('water-level')
let selectPlantMenuMeta = document.getElementById('select-plant-meta')

const sounds = {
  money: PIXI['sound'].Sound.from({url: '/assets/sounds/money.mp3', autoPlay: false}),
  plant: PIXI['sound'].Sound.from({url: '/assets/sounds/plant.mp3', autoPlay: false}),
  button: PIXI['sound'].Sound.from({url: '/assets/sounds/button.mp3', autoPlay: false}),
  buttonDisabled: PIXI['sound'].Sound.from({url: '/assets/sounds/button-disabled.mp3', autoPlay: false}),
  water: PIXI['sound'].Sound.from({url: '/assets/sounds/water.mp3', autoPlay: false}),
  turn: PIXI['sound'].Sound.from({url: '/assets/sounds/turn.mp3', autoPlay: false}),
}

// load main textures
loader.add('bg', 'assets/bg.png')
loader.add('bg-top', 'assets/bg-top.png')
loader.add('bg-bottom', 'assets/bg-bottom.png')
loader.add('text-frame', 'assets/text-frame.png')
loader.add('water-level', 'assets/water-level.png')
loader.add('plant-select-menu-bg', 'assets/plant-select-menu-bg.png')
loader.add('arrow-left', 'assets/buttons/arrow-left.png')
loader.add('arrow-right', 'assets/buttons/arrow-right.png')
loader.add('button_add-plant', 'assets/buttons/add-plant.png')
loader.add('button_water', 'assets/buttons/water.png')
loader.add('button_confirm', 'assets/buttons/confirm.png')
loader.add('button_close', 'assets/buttons/close.png')
for (let i = 1; i <= configs.numberOfPots; i++) loader.add('pot-' + i, 'assets/pot-' + i + '.png')

plants.forEach(plant => {
  for (let i = 0; i <= plant.numberOfStages; i++) loader.add(plant.key + '_stage-' + i, 'assets/'+ plant.key +'/stage-' + i +'.png')
})

const createSprite = (name, onClick) => {
  const sprite = new PIXI['Sprite'](loader.resources[name].texture)
  app.stage.addChild(sprite)
  if (onClick) {
    sprite.interactive = true
    sprite.on('pointerdown', onClick);
  }
  return sprite
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
    if (plant.stage === template.numberOfStages) {
      showNotification('Plant ready for harvesting', {icon: '/assets/' + plant.key + '/stage-' + template.numberOfStages + '.png'})
    }
  }
  plant.sprite.texture = loader.resources[plant.key + '_stage-' + plant.stage].texture
}

const addShelf = () => {
  const index = values.shelves.length
  const shelfSprite = createSprite('bg')
  shelfSprite.y = configs.topHeight + configs.shelfHeight * index
  values.bottomSprite.y = shelfSprite.y + shelfSprite.height
  const shelf = {sprite: shelfSprite, pots: []}
  values.shelves.push(shelf)
  app.view.height += configs.shelfHeight
  app.renderer.resize(128, app.view.height);
  return shelf
}

const deletePot = (shelf, pot) => {
  if (values.plantMenuOpen) return
  const template = plants.find(plant => plant.key === pot.plant.key)
  if (pot.plant.stage !== template.numberOfStages) {
    sounds.buttonDisabled.play()
    return
  }
  sounds.button.play()

  if (pot.plant.stage === template.numberOfStages) {
    values.points += pot.plant.value
    sounds.money.play()
  } else {
    values.points += template.cost
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
  const toDelete = values.shelves.filter(shelf => shelf.pots.length === 0)
  toDelete.forEach(shelf => {
    app.stage.removeChild(shelf.sprite)
    values.shelves.splice(values.shelves.indexOf(shelf), 1)
    app.view.height -= configs.shelfHeight
    app.renderer.resize(128, app.view.height);
  })
  while (values.shelves.length < configs.minShelves) addShelf()
  values.shelves.forEach((shelf, i) => shelf.sprite.y = configs.topHeight + configs.shelfHeight * i)
}

const water = () => {
  sounds.button.play()
  values.lastWateredTime = Date.now()
  sounds.water.play()
  apply()
}

const getNextEmptyShelf = (spaces) => {
  const shelf = values.shelves.find(shelf => shelf.pots.reduce((t, pot) => t + pot.spaces, 0) < 5 - spaces)
  return shelf || addShelf()
}

const addPlant = (plantTemplate, potIndex = 0) => {
  let index = values.shelves.indexOf(getNextEmptyShelf(plantTemplate.spaces))
  const shelf = values.shelves[index]
  const potSprite = createSprite('pot-' + (potIndex + 1))
  potSprite.parent = shelf.sprite
  potSprite.y = configs.shelfHeight - potSprite.height - 2

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
  values.shelves.forEach(shelf => total += shelf.pots.length)
  return total
}

const applyWater = () => {
  let msSinceLastWatered = (Date.now() - values.lastWateredTime) * configs.timeScale
  if (!getTotalNumberOfPlants()) values.lastWateredTime += (Date.now() - values.lastWaterCheckTime)

  let newWaterLevel = Math.ceil(100 - (100 / configs.waterDrainTime * msSinceLastWatered))
  if (newWaterLevel < 0) newWaterLevel = 0

  if (newWaterLevel === 0 && values.waterLevel > 0) {
    showNotification('Water is empty!', {icon: '/assets/buttons/water.png'})
  }

  values.waterLevel = newWaterLevel
  values.lastWaterCheckTime = Date.now()
}

const apply = () => {
  applyWater()
  let timePassed = Date.now() - values.lastUpdateTime
  let timeSinceLastWatered = Date.now() - values.lastWateredTime

  let wateredTime = configs.waterDrainTime - timeSinceLastWatered
  if (wateredTime < 0) wateredTime = 0

  if (timePassed > wateredTime) timePassed = wateredTime
  values.lastUpdateTime = Date.now()

  values.shelves.forEach(shelf => shelf.pots.forEach(pot => setPlantStage(pot.plant, timePassed * configs.timeScale)))
  updateTexts()
  save()
}

const showSelectPlantMenu = () => {
  if (values.plantMenuOpen) return sounds.buttonDisabled.play()
  values.plantMenuOpen = true
  sounds.button.play()
  values.addPlantMenuBg = createSprite('plant-select-menu-bg')
  values.addPlantMenuBg.y = 26
  values.addPlantMenuSprites.push(values.addPlantMenuBg)

  const closeButton = createSprite('button_close', () => {
    sounds.button.play()
    closeSelectPlantMenu()
  })
  closeButton.y = 31
  closeButton.x = values.addPlantMenuBg.width - closeButton.width - 5
  values.addPlantMenuSprites.push(closeButton)

  values.addPlantMenuConfirmButton = createSprite('button_confirm', () => {
    if (values.points < plants[values.addPlantSelectedPlantIndex].cost) {
      sounds.buttonDisabled.play()
      return
    }
    addPlant(plants[values.addPlantSelectedPlantIndex], values.addPlantSelectedPotIndex)
    values.points -= plants[values.addPlantSelectedPlantIndex].cost
    apply()
    sounds.plant.play()
    closeSelectPlantMenu()
  })
  values.addPlantMenuConfirmButton.y = 126
  values.addPlantMenuConfirmButton.x = 35
  values.addPlantMenuSprites.push(values.addPlantMenuConfirmButton)

  const plant = plants[values.addPlantSelectedPlantIndex]
  values.addPlantMenuPreview = createSprite(plant.key + '_stage-' + plant.numberOfStages)
  values.addPlantMenuSprites.push(values.addPlantMenuPreview)

  values.addPlantMenuPot = createSprite('pot-' + (values.addPlantSelectedPotIndex + 1))
  values.addPlantMenuSprites.push(values.addPlantMenuPot)

  values.leftArrow = createSprite('arrow-left', () => {
    if (values.addPlantSelectedPlantIndex === 0) {
      sounds.buttonDisabled.play()
      return
    }
    sounds.turn.play()
    values.addPlantSelectedPlantIndex -= 1
    handleAddPlantMenuButtonAlphas()
    const plant = plants[values.addPlantSelectedPlantIndex]
    values.addPlantMenuPreview.texture = loader.resources[plant.key + '_stage-' + plant.numberOfStages].texture
    setAddPlantMenuMeta()
  })
  values.leftArrow.x = 4
  values.leftArrow.y = 72
  values.addPlantMenuSprites.push(values.leftArrow)

  values.rightArrow = createSprite('arrow-right', () => {
    if (values.addPlantSelectedPlantIndex === plants.length - 1) {
      sounds.buttonDisabled.play()
      return
    }
    sounds.turn.play()
    values.addPlantSelectedPlantIndex += 1
    handleAddPlantMenuButtonAlphas()
    const plant = plants[values.addPlantSelectedPlantIndex]
    values.addPlantMenuPreview.texture = loader.resources[plant.key + '_stage-' + plant.numberOfStages].texture
    setAddPlantMenuMeta()
  })
  values.rightArrow.x = 111
  values.rightArrow.y = 72
  values.addPlantMenuSprites.push(values.rightArrow)


  values.leftPotArrow = createSprite('arrow-left', () => {
    if (values.addPlantSelectedPotIndex === 0) {
      sounds.buttonDisabled.play()
      return
    }
    sounds.button.play()
    values.addPlantSelectedPotIndex -= 1
    handleAddPlantMenuButtonAlphas() // todo

    values.addPlantMenuPot.texture = loader.resources['pot-' + (values.addPlantSelectedPotIndex + 1)].texture

    setAddPlantMenuMeta()
  })
  values.leftPotArrow.x = 4
  values.leftPotArrow.y = 86
  values.addPlantMenuSprites.push(values.leftPotArrow)

  values.rightPotArrow = createSprite('arrow-right', () => {
    if (values.addPlantSelectedPotIndex === configs.numberOfPots - 1) {
      sounds.buttonDisabled.play()
      return
    }
    sounds.button.play()
    values.addPlantSelectedPotIndex += 1
    handleAddPlantMenuButtonAlphas() // todo

    values.addPlantMenuPot.texture = loader.resources['pot-' + (values.addPlantSelectedPotIndex + 1)].texture

    setAddPlantMenuMeta()
  })
  values.rightPotArrow.x = 111
  values.rightPotArrow.y = 86
  values.addPlantMenuSprites.push(values.rightPotArrow)


  selectPlantMenuMeta.classList.add('shown')
  setAddPlantMenuMeta()
  handleAddPlantMenuButtonAlphas()
}

const setAddPlantMenuMeta = () => {
  const template = plants[values.addPlantSelectedPlantIndex]
  selectPlantMenuMeta.innerHTML = `
  
  $${getAmountText(template.cost)} - 
  ${getTimeAmount(template.growthTime)}<br>
  Sell: $${getAmountText(template.value)}
  `
  values.addPlantMenuPreview.x = values.addPlantMenuBg.width / 2 - (values.addPlantMenuPreview.width / 2)
  values.addPlantMenuPreview.y = 20 + values.addPlantMenuBg.height / 2 - (values.addPlantMenuPreview.height / 2)
  values.addPlantMenuPot.x = values.addPlantMenuBg.width / 2 - (values.addPlantMenuPot.width / 2)
  values.addPlantMenuPot.y = values.addPlantMenuPreview.y + values.addPlantMenuPreview.height - values.addPlantMenuPot.height
}

const handleAddPlantMenuButtonAlphas = () => {
  values.rightArrow.alpha = 1
  values.leftArrow.alpha = 1
  values.rightPotArrow.alpha = 1
  values.leftPotArrow.alpha = 1
  values.addPlantMenuConfirmButton.alpha = 1
  if (values.addPlantSelectedPlantIndex === 0) values.leftArrow.alpha = 0.5
  if (values.addPlantSelectedPlantIndex === plants.length - 1) values.rightArrow.alpha = 0.5
  if (values.addPlantSelectedPotIndex === 0) values.leftPotArrow.alpha = 0.5
  if (values.addPlantSelectedPotIndex === configs.numberOfPots - 1) values.rightPotArrow.alpha = 0.5
  if (values.points < plants[values.addPlantSelectedPlantIndex].cost) values.addPlantMenuConfirmButton.alpha = 0.5
}

const closeSelectPlantMenu = () => {
  values.plantMenuOpen = false
  selectPlantMenuMeta.classList.remove('shown')
  values.addPlantMenuSprites.forEach(sprite => {
    app.stage.removeChild(sprite)
  })
}

const updateTexts = () => {
  waterLevelText.innerText = "$" + getAmountText(values.points)
  let percent = values.waterLevel / 100
  if (percent > 1) percent = 1
  values.waterLevelSprite.width = 33 * percent
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
  if (values.killed) return
  let data = {
    version: configs.version,
    lastUpdateTime: values.lastUpdateTime,
    lastWateredTime: values.lastWateredTime,
    addPlantSelectedPlantIndex: values.addPlantSelectedPlantIndex,
    addPlantSelectedPotIndex: values.addPlantSelectedPotIndex,
    values: values.points,
    shelves: values.shelves.map(shelf => {
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
  let shelfCount = configs.minShelves
  if (data && data.shelves.length > shelfCount) shelfCount = data.values.shelves.length
  init(shelfCount)

  if (data) {
    values.lastUpdateTime = data.lastUpdateTime
    values.lastWateredTime = data.lastWateredTime
    values.addPlantSelectedPlantIndex = data.addPlantSelectedPlantIndex
    values.addPlantSelectedPotIndex = data.addPlantSelectedPotIndex || 0
    values.points = data.points
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
  setInterval(apply, configs.checkRate)
}

const init = (numberOfShelves) => {
  const topSprite = createSprite('bg-top')
  topSprite.y = 16
  values.bottomSprite = createSprite('bg-bottom')
  values.bottomSprite.y = configs.topHeight

  for (let i = 0; i < numberOfShelves; i++) addShelf()

  createSprite('text-frame')

  values.waterLevelSprite = createSprite('water-level')
  values.waterLevelSprite.y = 6
  values.waterLevelSprite.x = 62
  values.waterLevelSprite.height = 8

  // Add buttons
  createSprite('button_add-plant', showSelectPlantMenu)

  const waterButtonSprite = createSprite('button_water', water)
  waterButtonSprite.x = 128 - waterButtonSprite.width
}

const showNotification = (title, options) => {
  Notification.requestPermission().then(result => {
    if (document.hasFocus()) return
    if (result !== 'granted') return
    const notification = new Notification(title, options);
    notification.onclick = (e) => {
      e.preventDefault()
      window.focus();
    }
   });
}

window['reset'] = () => {
  if (!confirm('Are you sure?')) return
  localStorage.removeItem('data')
  values.killed = true
  window.location.reload()
}

loader.load(() => {
  let data
  try {
    data = JSON.parse(localStorage.getItem('data'))
    if (data.version !== configs.version) data = undefined
  } catch(e) {}
  load(data)
})

