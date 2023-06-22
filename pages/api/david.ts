import { createBadgenHandler, PathArgs } from '../../libs/create-badgen-handler-next'

const help = `
## Discontinued

Please refer to [https://github.com/alanshaw/david](https://github.com/alanshaw/david) for more info.
`

export default createBadgenHandler({
  title: 'David DM',
  examples: {
    '/david/dep/zeit/pkg': 'dependencies',
    '/david/dev/zeit/pkg': 'dev dependencies',
    '/david/peer/epoberezkin/ajv-keywords': 'peer dependencies',
    '/david/optional/epoberezkin/ajv-keywords': 'optional dependencies',
    '/david/dep/babel/babel/packages/babel-cli': 'dependencies (sub path)',
  },
  handlers: {
    '/david/:topic/:owner/:repo/:path*': handler
  },
  help
})

async function handler ({ topic, owner, repo, path = '' }: PathArgs) {
  return {
    subject: 'david badge',
    status: 'discontinued',
    color: 'grey',
  }
}
