const numberOfShelves = 4
const shelfHeight = 48

let app = new PIXI.Application({ width: 128, height: 48 * numberOfShelves });
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
document.body.appendChild(app.view);

const loader = PIXI.Loader.shared;
const sprites = {};
const shelves = []

// Chainable `add` to enqueue a resource
loader.add('bg', 'assets/bg.png')
loader.add('pot', 'assets/pot.png')

loader.add('cactus-1_stage-1', 'assets/cactus-1/stage-1.png')
loader.add('cactus-1_stage-2', 'assets/cactus-1/stage-2.png')
loader.add('cactus-1_stage-3', 'assets/cactus-1/stage-3.png')
loader.add('cactus-1_stage-4', 'assets/cactus-1/stage-4.png')
loader.add('cactus-1_stage-5', 'assets/cactus-1/stage-5.png')
loader.add('cactus-1_stage-6', 'assets/cactus-1/stage-6.png')


loader.load((loader, resources) => {
  for (let i = 0; i < numberOfShelves; i++) {
    const bgSprite = new PIXI.Sprite(resources.bg.texture)
    bgSprite.interactive = true
    bgSprite.y = shelfHeight * i
    app.stage.addChild(bgSprite)
    bgSprite.on('click', () => onShelfClick(i));
    shelves.push({sprite: bgSprite, pots: []})
  }
})

const onShelfClick = (index) => {
  const shelf = shelves[index]
  if (shelf.pots.length >= 4) return alert('Too many pots')

  const potSprite = new PIXI.Sprite(loader.resources.pot.texture)
  potSprite.interactive = true
  potSprite.y = shelfHeight * index + shelfHeight - potSprite.height - 2
  potSprite.x = 8 + shelf.pots.length * (potSprite.width + 5)
  app.stage.addChild(potSprite)
  let potIndex = shelf.pots.length
  potSprite.on('click', (event) => onPotClick(index, potIndex));
  shelf.pots.push({sprite: potSprite, plant: undefined})
}

const onPotClick = (shelfIndex, potIndex) => {
  const pot = shelves[shelfIndex].pots[potIndex]
  if (!pot.plant) {
    const name = 'cactus-1'
    const plantSprite = new PIXI.Sprite(loader.resources[name + '_stage-1'].texture)
    plantSprite.x = pot.sprite.x
    plantSprite.y = pot.sprite.y
    pot.plant = {stage: 1, name, sprite: plantSprite}
    app.stage.addChild(plantSprite)
  } else {
    pot.plant.stage += 1
    pot.plant.sprite.texture = loader.resources[pot.plant.name + '_stage-' + pot.plant.stage].texture
  }
}



// Add a ticker callback to move the sprite back and forth
// let elapsed = 0.0;
// app.ticker.add((delta) => {
//   elapsed += delta;
//   sprite.x = 100.0 + Math.cos(elapsed/50.0) * 100.0;
// });