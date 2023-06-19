import { createBadgenHandler } from '../../libs/create-badgen-handler-next'

const help = `
## Discontinued

Read all about GitHub [Sunsetting Atom](https://github.blog/2022-06-08-sunsetting-atom/).

For alternative service, you may use <a href="/ppm">/ppm</a> instead.
`

export default createBadgenHandler({
  title: 'Atom Package',
  examples: {
    '/apm/v/linter': 'version',
    '/apm/stars/linter': 'stars',
    '/apm/license/linter': 'license',
    '/apm/downloads/linter': 'downloads',
  },
  handlers: {
    '/apm/:topic/:pkg': handler
  },
  help: help
})

async function handler () {
  return {
    subject: 'apm',
    status: 'discontinued',
    color: 'grey'
  }
}
