// import path from 'path'

import matchRoute from 'my-way'

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

  const { examples, routes, help = '' } = meta

  let md = `# /${id}\n\n${help}`

  const egCats = routes.reduce((accu, curr) => {
    accu[curr] = []
    return accu
  }, {})

  Object.entries(examples).forEach((eg) => {
    const scheme = routes.find(r => matchRoute(r, eg[0]))
    if (scheme) {
      egCats[scheme].push(eg)
    }
  })

  md += '## Examples\n\n'

  Object.entries(egCats).forEach(([cat, egs]) => {
    // @ts-ignore
    const egList = egs.map(([url, desc]) => {
      return `- ![${url}](${url}) [${url}](${url}) <i>${desc}</i>`
    }).join('\n')
    md += `\n\n__\`${cat}\`__\n${egList}`
  })

  return md
}
