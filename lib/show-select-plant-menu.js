//@ts-check
import { configs, values, htmlElements } from '../configs.js'
import { createSprite } from './create-sprite.js'
import { plants } from '../plants.js'
import { setAddPlantMenuMeta } from './set-add-plant-meta.js'
import { addPlant } from './add-plant.js'
import { apply } from './apply.js'
import { closeSelectPlantMenu } from './close-select-plant-menu.js'
import { handleAddPlantMenuButtonAlphas } from './handle-add-plant-menu-button-alphas.js'

const loader = PIXI['Loader'].shared;

export const showSelectPlantMenu = () => {
  if (values.shelfLimitMenuOpen) return values.sounds.buttonDisabled.play()
  if (values.plantMenuOpen) return values.sounds.buttonDisabled.play()
  values.plantMenuOpen = true
  values.sounds.button.play()
  values.addPlantMenuBg = createSprite('plant-select-menu-bg')
  values.addPlantMenuBg.y = 26
  values.addPlantMenuSprites.push(values.addPlantMenuBg)

  const closeButton = createSprite('button_close', () => {
    values.sounds.button.play()
    closeSelectPlantMenu()
  })
  closeButton.y = 31
  closeButton.x = values.addPlantMenuBg.width - closeButton.width - 5
  values.addPlantMenuSprites.push(closeButton)

  values.addPlantMenuConfirmButton = createSprite('button_confirm', async () => {
    if (values.points < plants[values.addPlantSelectedPlantIndex].cost) return values.sounds.buttonDisabled.play()
    closeSelectPlantMenu()
    const added = await addPlant(plants[values.addPlantSelectedPlantIndex], values.addPlantSelectedPotIndex)
    if (added) {
      values.points -= plants[values.addPlantSelectedPlantIndex].cost
      if (!values.stats.planted[plant.key]) values.stats.planted[plant.key] = 0
      values.stats.planted[plant.key] += 1
      apply()
      values.sounds.plant.play()
    }
  })
  values.addPlantMenuConfirmButton.y = 182
  values.addPlantMenuConfirmButton.x = 35
  values.addPlantMenuSprites.push(values.addPlantMenuConfirmButton)
  
  values.addPlantMenuPot = createSprite('pot-' + (values.addPlantSelectedPotIndex + 1))
  values.addPlantMenuSprites.push(values.addPlantMenuPot)

  const plant = plants[values.addPlantSelectedPlantIndex]
  values.addPlantMenuPreview = createSprite(plant.key + '_stage-' + plant.numberOfStages)
  values.addPlantMenuPreview.y = 50
  values.addPlantMenuSprites.push(values.addPlantMenuPreview)

  values.leftArrow = createSprite('arrow-left', () => {
    if (values.addPlantSelectedPlantIndex === 0) return values.sounds.buttonDisabled.play()
    values.sounds.turn.play()
    values.addPlantSelectedPlantIndex -= 1
    handleAddPlantMenuButtonAlphas()
    const plant = plants[values.addPlantSelectedPlantIndex]
    values.addPlantMenuPreview.texture = loader.resources[plant.key + '_stage-' + plant.numberOfStages].texture
    setAddPlantMenuMeta()
  })
  values.leftArrow.x = 14
  values.leftArrow.y = 120
  values.addPlantMenuSprites.push(values.leftArrow)

  values.rightArrow = createSprite('arrow-right', () => {
    if (values.addPlantSelectedPlantIndex === plants.length - 1) return values.sounds.buttonDisabled.play()
    values.sounds.turn.play()
    values.addPlantSelectedPlantIndex += 1
    handleAddPlantMenuButtonAlphas()
    const plant = plants[values.addPlantSelectedPlantIndex]
    values.addPlantMenuPreview.texture = loader.resources[plant.key + '_stage-' + plant.numberOfStages].texture
    setAddPlantMenuMeta()
  })
  values.rightArrow.x = 101
  values.rightArrow.y = 120
  values.addPlantMenuSprites.push(values.rightArrow)

  values.leftPotArrow = createSprite('arrow-left', () => {
    if (values.addPlantSelectedPotIndex === 0) return values.sounds.buttonDisabled.play()
    values.sounds.button.play()
    values.addPlantSelectedPotIndex -= 1
    values.addPlantMenuPot.texture = loader.resources['pot-' + (values.addPlantSelectedPotIndex + 1)].texture
    handleAddPlantMenuButtonAlphas()
    setAddPlantMenuMeta()
  })
  values.leftPotArrow.x = 14
  values.leftPotArrow.y = 140
  values.addPlantMenuSprites.push(values.leftPotArrow)

  values.rightPotArrow = createSprite('arrow-right', () => {
    if (values.addPlantSelectedPotIndex === configs.numberOfPots - 1) return values.sounds.buttonDisabled.play()
    values.sounds.button.play()
    values.addPlantSelectedPotIndex += 1
    handleAddPlantMenuButtonAlphas()
    values.addPlantMenuPot.texture = loader.resources['pot-' + (values.addPlantSelectedPotIndex + 1)].texture
    setAddPlantMenuMeta()
  })
  values.rightPotArrow.x = 101
  values.rightPotArrow.y = 140
  values.addPlantMenuSprites.push(values.rightPotArrow)
  htmlElements.selectPlantMenuMeta.classList.add('shown')
  setAddPlantMenuMeta()
  handleAddPlantMenuButtonAlphas()
}