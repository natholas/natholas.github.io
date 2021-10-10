//@ts-check
import {values} from '../configs.js'

export const createSprite = (name, onClick) => {
  const sprite = new PIXI['Sprite'](PIXI['Loader'].shared.resources[name].texture)
  values.app.stage.addChild(sprite)
  if (onClick) {
    sprite.interactive = true
    sprite.on('pointerdown', onClick);
  }
  return sprite
}