export const getCanvasScaling = () => {
  const width = document.querySelector('canvas').clientWidth
  return width / 128
}