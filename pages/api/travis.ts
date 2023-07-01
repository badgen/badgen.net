import got from '../../libs/got'
import { createBadgenHandler, PathArgs } from '../../libs/create-badgen-handler-next'

export default createBadgenHandler({
  title: 'Travis CI',
  examples: {
    '/travis/babel/babel': 'build',
    '/travis/babel/babel/6.x': 'build (branch)',
  },
  handlers: {
    '/travis/:owner/:repo/:branch?': handler
  }
})

async function handler ({ owner, repo, branch }: PathArgs) {
  const badgePath = `${owner}/${repo}.svg`
  const searchParams = new URLSearchParams()
  if (branch) searchParams.set('branch', branch)

  const svg = await got(`https://api.travis-ci.com/${badgePath}`, { searchParams }).text()

  const result = statuses.find(([status]) => {
    return svg.includes(status)
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
