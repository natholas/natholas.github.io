//@ts-check
import { values, htmlElements, configs } from '../configs.js'
import { createSprite } from './create-sprite.js'
import { closePlantInfoMenu } from './close-plant-info-menu.js'
import { deletePlant } from './delete-plant.js'
import { plants } from '../plants.js'

export const showPlantInfoMenu = (shelf, pot) => {
  if (values.plantMenuOpen) return
  if (values.shelfLimitMenuOpen) return
  values.plantInfoMenuOpen = true
  const bg = createSprite('shelf-limit-bg')
  bg.y = 26
  values.plantInfoMenuSprites.push(bg)

  const closeButton = createSprite('button_close', () => {
    values.sounds.button.play()
    closePlantInfoMenu()
  })
  closeButton.y = 31
  closeButton.x = bg.width - closeButton.width - (5)
  values.plantInfoMenuSprites.push(closeButton)
  
  const template = plants.find(p => p.key === pot.plant.key)

  const potSprite = createSprite('pot-' + (pot.potIndex + 1))
  values.plantInfoMenuSprites.push(potSprite)
  potSprite.y = 50
  potSprite.x = bg.width / 2 - potSprite.width / 2

  const plantSprite = createSprite(pot.plant.key + '_stage-' + template.numberOfStages)
  values.plantInfoMenuSprites.push(plantSprite)
  plantSprite.parent = potSprite
  // plantSprite.width /= 2
  // plantSprite.height /= 2
  
  plantSprite.y = potSprite.height - plantSprite.height
  plantSprite.x = (potSprite.width / 2) - plantSprite.width / 2

  const sellButton = createSprite('button_confirm', () => {
    deletePlant(shelf, pot)
    closePlantInfoMenu()
  })
  values.plantInfoMenuSprites.push(sellButton)
  sellButton.x = 35
  sellButton.y = 120

  htmlElements.plantInfoMeta.innerHTML = `
  PLANT!! ${pot.plant.key}
  `

  htmlElements.plantInfoMeta.classList.add('shown')
}