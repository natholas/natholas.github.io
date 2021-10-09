//@ts-check

export const getAmountText = (value) => {
  const units = ['', 'K', 'M', 'B', 'T']
  let unitIndex = 0
  while (value >= 1000) {
    unitIndex += 1
    value /= 1000
  }

  let val = value.toFixed(1)
  
  if (val.endsWith('.0')) val = val.substring(0, val.length - 2)

  if (val.split('.')[0].length > 2) val = val.split('.')[0]

  return val + units[unitIndex]
}