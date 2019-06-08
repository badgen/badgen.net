/**
 * Format coverage precision
 *
 * @param {Number|String} percent
 */

export default (percent) => {
  return Number(percent).toFixed(1).replace(/\.0$/, '') + '%'
}
