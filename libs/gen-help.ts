// import path from 'path'
// import { liveBadgeList } from './badge-list'

const { live: liveBadges } = require('../static/.gen/badges.json')

/** not supported on Now */
// export const liveBadges = liveBadgeList.reduce((accu, curr) => {
//   const { meta, handlers } = require(path.resolve(__dirname, `../endpoints/${curr}`))
//   const { title, examples, help } = meta
//   accu[curr] = {
//     id: curr,
//     title,
//     examples,
//     routes: Object.keys(handlers),
//     help
//   }
//   return accu
// }, {})

export default function genHelp (id) {
  const meta = liveBadges.find(b => b.id === id)

  if (!meta) {
    return ''
  }

  const { examples, routes, help } = meta

  const Docs = `# /${id}\n\n${help || ''}`
  const schemeLinks = routes.map(r => `- \`${r}\``)
  const Schemes = `## Schemes\n\n${schemeLinks.join('  \n')}`
  // @ts-ignore
  const exampleList = Object.entries(examples)
    .map(([url, desc]) => `- ![${url}](${url}) [${url}](${url}) <i>${desc}</i>`)
  const Examples = `## Examples\n\n${exampleList.join('\n')}`

  return [Docs, Schemes, Examples].join('\n\n')
}
