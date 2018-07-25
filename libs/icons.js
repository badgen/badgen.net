const fs = require('fs')
const { join, parse } = require('path')

const icons = {}

fs.readdirSync(join(__dirname, 'icons')).forEach(filename => {
  const imageType = {
    '.svg': 'svg+xml',
    '.png': 'png'
  }[parse(filename).ext]

  if (!imageType) return

  const key = parse(filename).name
  const b64 = fs.readFileSync(join(__dirname, 'icons', filename)).toString('base64')

  icons[key] = `data:image/${imageType};base64,${b64}`
})

module.exports = icons
