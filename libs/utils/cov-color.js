/**
 * Generate color from coverage number
 *
 * @param {Number} value
 * @param {Number} green
 * @param {Number} yellow
 * @param {Number} orange
 */
module.exports = (value, green = 100, yellow = 85, orange = 70, red = 35) => {
  if (value < red) {
    return 'red'
  }
  if (value < orange) {
    return 'orange'
  }
  if (value < yellow) {
    return 'EEAA22'
  }
  if (value < green) {
    return '99CC09'
  }
  return 'green'
}
