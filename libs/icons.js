const fs = require('fs')
const { join, parse } = require('path')

const genIcons = (iconFolder, whiten) => {
  const icons = {}

  fs.readdirSync(join(__dirname, iconFolder)).forEach(filename => {
    const imageType = {
      '.svg': 'svg+xml',
      '.png': 'png'
    }[parse(filename).ext]

    if (!imageType) return

    const key = parse(filename).name
    const iconFile = join(__dirname, iconFolder, filename)
    const svgSource = fs.readFileSync(iconFile, 'utf8')
    const svg = whiten ? whitenSVG(svgSource) : svgSource
    const b64 = Buffer.from(svg).toString('base64')

    icons[key] = `data:image/${imageType};base64,${b64}`
  })

  return icons
}

const whitenSVG = (svg, whiten) => {
  return svg
    .replace(/fill="#\w{3,6}"/g, 'fill="white"')
    .replace(/stroke="#\w{3,6}"/g, 'stroke="white"')
    .replace(/<path /g, '<path fill="white" ')
}

module.exports = {
  builtin: genIcons('icons')
  // simple: genIcons('../node_modules/simple-icons/icons', true)
}
