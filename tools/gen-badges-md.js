const fs = require('fs')
const path = require('path')

const metaPath = path.join(__dirname, '../public/.meta/badge-list.json')
const destPath = path.join(__dirname, '../public/badges.md')

const data = JSON.parse(fs.readFileSync(metaPath, 'utf8'))

let md = `# Badgen Services

> A comprehensive list of badge generators available on badgen.net.

`

for (const key in data) {
  const item = data[key]
  md += `## ${item.title}\n\n`

  if (item.help) {
    md += item.help.trim() + '\n\n'
  }

  if (item.examples) {
    md += `### Examples\n\n`
    for (const [url, desc] of Object.entries(item.examples)) {
      md += `- [${desc}](https://badgen.net${url})\n`
    }
    md += '\n'
  }
}

fs.writeFileSync(destPath, md)
console.log(`Generated ${destPath}`)
