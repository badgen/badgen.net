const got = require('../got.js')
const byteSize = require('byte-size')

module.exports = async (topic, ...args) => {
  const endpoint = `https://packagephobia.now.sh/api.json?p=${args.join('/')}`
  const { installSize, publishSize } = await got(endpoint).then(res => res.body)

  switch (topic) {
    case 'publish':
      return {
        subject: 'publish size',
        status: formatSize(publishSize),
        color: formatColor(publishSize)
      }
    case 'install':
      return {
        subject: 'install size',
        status: formatSize(installSize),
        color: formatColor(installSize)
      }
    default:
      return {
        subject: 'packagephobia',
        status: 'unknown topic',
        color: 'grey'
      }
  }
}

const formatSize = (size) => {
  return byteSize(size, {
    units: 'iec',
    precision: 2
  }).toString().replace(/iB\b/, 'B')
}

/**
 * Color schema from
 * https://github.com/styfle/packagephobia/blob/master/src/util/npm-parser.ts
 */

const KB = 1024
const oneHundredKb = 100 * KB
const megabyte = 1024 * KB
const fiveMb = 5 * megabyte
const thirtyMb = 30 * megabyte
const oneHundredMb = 100 * megabyte
const fiveHundredMb = 500 * megabyte

const color = {
  brightgreen: '44CC11',
  limegreen: '97CA00',
  yellow: 'DFB317',
  orange: 'FE7D37',
  red: 'E05D44',
  blue: '007EC6',
  pink: 'FF69B4'
}

const formatColor = bytes => {
  if (bytes < oneHundredKb) {
    return color.brightgreen
  } else if (bytes < megabyte) {
    return color.limegreen
  } else if (bytes < fiveMb) {
    return color.blue
  } else if (bytes < thirtyMb) {
    return color.yellow
  } else if (bytes < oneHundredMb) {
    return color.orange
  } else if (bytes < fiveHundredMb) {
    return color.red
  } else {
    return color.pink
  }
}
