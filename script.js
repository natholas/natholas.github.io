const numberOfShelves = 3
const shelfHeight = 48
const sizeMultiplier = 4
const topHeight = 12
const bottomHeight = 20
const waterDrainRate = 1000 * 4
const speedRate = 1000

let app = new PIXI.Application({ width: 128, height: topHeight + bottomHeight, backgroundAlpha: 0 });
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
document.body.appendChild(app.view);

const loader = PIXI.Loader.shared;
const sprites = {};
const shelves = []
let points = 10
let bottomSprite
let waterLevel = 4

// load main textures
loader.add('bg', 'assets/bg.png')
loader.add('bg-top', 'assets/bg-top.png')
loader.add('bg-bottom', 'assets/bg-bottom.png')
loader.add('pot', 'assets/pot.png')

// load buttons
loader.add('button_add-plant', 'assets/buttons/add-plant.png')
loader.add('button_water', 'assets/buttons/water.png')

// load all plant stages
const plants = [
  {
    key: 'cactus-1',
    growthTime: 35,
    growthRateVariation: 1.5,
    numberOfStages: 6
  },
  {
    key: 'flower-1',
    growthTime: 15,
    growthRateVariation: 2,
    numberOfStages: 6
  }
]
plants.forEach(plant => {
  for (let i = 1; i <= 6; i++) {
    loader.add(plant.key + '_stage-' + i, 'assets/'+ plant.key +'/stage-' + i +'.png')
  }
})

loader.load(() => {
  const topSprite = new PIXI.Sprite(loader.resources['bg-top'].texture)
  app.stage.addChild(topSprite)

  bottomSprite = new PIXI.Sprite(loader.resources['bg-bottom'].texture)
  bottomSprite.y = topHeight
  app.stage.addChild(bottomSprite)

  addShelf()
  addShelf()
  addShelf()

  // Add buttons
  const addPlantButton = new PIXI.Sprite(loader.resources['button_add-plant'].texture)
  app.stage.addChild(addPlantButton)
  addPlantButton.interactive = true
  addPlantButton.on('pointerdown', (event) => {
    addPlant()
  });

  const waterButtonSprite = new PIXI.Sprite(loader.resources['button_water'].texture)
  app.stage.addChild(waterButtonSprite)
  waterButtonSprite.interactive = true
  waterButtonSprite.x = 128 - waterButtonSprite.width
  waterButtonSprite.on('pointerdown', (event) => {
    water()
  });
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
  shelves.push({sprite: bgSprite, pots: []})
  app.view.height += shelfHeight
  app.renderer.resize(128, app.view.height);
}

const deletePot = (shelf, pot) => {
  const template = plants.find(plant => plant.key === pot.plant.key)
  if (pot.plant.stage === template.numberOfStages) {
    points += 2
  }
  app.stage.removeChild(pot.plant.sprite)
  app.stage.removeChild(pot.sprite)
  shelf.pots.splice(shelf.pots.indexOf(pot), 1)
  shelf.pots.forEach((pot, i) => {
    pot.sprite.x = 8 + i * (pot.sprite.width + 5)
    pot.plant.sprite.x = pot.sprite.x
  })
}

const getGrowthTime = (plantTemplate) => {
  const base = plantTemplate.growthTime
  const variation = (Math.random() * plantTemplate.growthRateVariation) - (plantTemplate.growthRateVariation/2)
  return Math.round(base + variation)
}

const water = () => {
  waterLevel = 4
}

const addPlant = () => {
  if (!points) return
  points -= 1
  let index = shelves.findIndex(s => s.pots.length < 4)
  if (index === -1) {
    addShelf()
    index = shelves.length - 1
  }
  const shelf = shelves[index]
  const potSprite = new PIXI.Sprite(loader.resources.pot.texture)
  potSprite.y = topHeight + shelfHeight * index + shelfHeight - potSprite.height - 2
  potSprite.x = 8 + shelf.pots.length * (potSprite.width + 5)
  app.stage.addChild(potSprite)

  const pot = {sprite: potSprite}

  const plantTemplate = getRandomPlant()
  const plantSprite = new PIXI.Sprite(loader.resources[plantTemplate.key + '_stage-1'].texture)
  plantSprite.interactive = true
  plantSprite.on('click', () => deletePot(shelf, pot))
  plantSprite.x = pot.sprite.x
  plantSprite.y = pot.sprite.y
  const growthTime = getGrowthTime(plantTemplate)
  pot.plant = {stage: 1, key: plantTemplate.key, sprite: plantSprite, growthTime, growthAmount: 0}
  app.stage.addChild(plantSprite)
  shelf.pots.push(pot)
}

const waterLoop = () => {
  waterLevel -= 1
  if (waterLevel < 0) waterLevel = 0
}

const loop = () => {
  console.log(waterLevel);
  shelves.forEach(shelf => {
    shelf.pots.forEach(pot => {
      const template = plants.find(plant => plant.key === pot.plant.key)
      if (pot.plant.stage === template.numberOfStages) return
      growPlant(pot)
    })
  })
}

setInterval(loop, speedRate)

setInterval(waterLoop, waterDrainRate)