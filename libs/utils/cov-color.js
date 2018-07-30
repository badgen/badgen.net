/**
 * Generate color from coverage number
 *
 * @param {Number} value
 * @param {Number} orange
 * @param {Number} yellow
 * @param {Number} green
 */

module.exports = function cc (value, orange = 70, yellow = 85, green = 100) {
  if (value <= 0) {
    return 'red'
  }
  if (value < orange) {
    return 'ef6c00'
  }
  if (value < yellow) {
    return 'c0ca33'
  }
  if (value < green) {
    return 'a4a61d'
  }
  return 'green'
}
