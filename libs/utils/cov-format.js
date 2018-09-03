/**
 * Format coverage precision
 *
 * @param {Number|String} percent
 */

module.exports = (percent) => {
  return Number(percent).toFixed(1).replace(/\.0$/, '') + '%'
}
