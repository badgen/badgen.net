const axios = require('../axios.js')
const semColor = require('../utils/sem-color.js')
const v = require('../utils/version-formatter.js')

module.exports = async function (topic, pkg) {
  const endpoint = `https://hackage.haskell.org/package/${pkg}/${pkg}.cabal`

  const cabal = await axios.get(endpoint).then(res => res.data)
  const { version, license } = parseCabalFile(cabal)

  switch (topic) {
    case 'v':
      return {
        subject: 'hackage',
        status: v(version),
        color: semColor(version)
      }
    case 'license':
      return {
        subject: 'license',
        status: license,
        color: 'blue'
      }
    default:
      return {
        status: 'unknown topic'
      }
  }
}

// Naive implementation (only parse meta blocks)
function parseCabalFile (raw) {
  return raw.match(/[\w-]+:.+\S+$/gm).reduce((accu, line) => {
    const [key, value] = line.split(':')
    accu[key] = value.trim()
    return accu
  }, {})
}
