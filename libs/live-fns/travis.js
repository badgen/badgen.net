const got = require('../got.js')

const statuses = [
  ['passed', 'green'],
  ['passing', 'green'],
  ['failed', 'orange'],
  ['failing', 'orange'],
  ['error', 'red'],
  ['errored', 'red'],
  ['pending', 'yellow'],
  ['fixed', 'yellow'],
  ['broken', 'red'],
  ['canceled', 'grey']
]

module.exports = async (user, repo, branch = 'master') => {
  const com = `https://api.travis-ci.com/${user}/${repo}.svg?branch=${branch}`
  const org = `https://api.travis-ci.org/${user}/${repo}.svg?branch=${branch}`
  const [svg1, svg2] = await Promise.all([
    got(com, { json: false }).then(({ body }) => body),
    got(org, { json: false }).then(({ body }) => body)
  ])

  const result = statuses.find(st => {
    return (svg1 && svg1.includes(st[0])) || (svg2 && svg2.includes(st[0]))
  })

  if (result) {
    return {
      subject: 'travis',
      status: result[0],
      color: result[1]
    }
  } else {
    return {
      subject: 'travis',
      status: 'unknown',
      color: 'grey'
    }
  }
}
