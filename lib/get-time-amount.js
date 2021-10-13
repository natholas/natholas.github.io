//@ts-check

export const getTimeAmount = (value) => {
  value /= 1000
  let suffix = ' second'
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
      if (value >= 365) {
        suffix = ' year'
        value /= 365
      }
    }
  }
  value = Math.round(value * 10) / 10
  if (value !== 1 && suffix) suffix += 's'
  return value + suffix
}