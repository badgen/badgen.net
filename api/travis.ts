import got from '../libs/got'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'Travis CI',
  examples: {
    '/travis/babel/babel': 'build',
    '/travis/babel/babel/6.x': 'build (branch)',
  },
  handlers: {
    '/travis/:user/:repo/:branch?': handler
  }
})

async function handler ({ user, repo, branch = 'master' }: PathArgs) {
  const com = `https://api.travis-ci.com/${user}/${repo}.svg?branch=${branch}`
  const org = `https://api.travis-ci.org/${user}/${repo}.svg?branch=${branch}`
  const [svg1, svg2] = await Promise.all([
    got(com).text(),
    got(org).text()
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

const statuses = [
  ['passed', 'green'],
  ['passing', 'green'],
  ['failed', 'red'],
  ['failing', 'red'],
  ['error', 'red'],
  ['errored', 'red'],
  ['pending', 'yellow'],
  ['fixed', 'yellow'],
  ['broken', 'red'],
  ['canceled', 'grey']
]
