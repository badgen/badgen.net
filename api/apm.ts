import { createBadgenHandler } from '../libs/create-badgen-handler'

const help = `
## Discontinued

Read all about GitHub [Sunsetting Atom](https://github.blog/2022-06-08-sunsetting-atom/).
`

export default createBadgenHandler({
  title: 'Atom Package',
  examples: {},
  handlers: {
    '/apm/:topic/:pkg': handler
  }
})

async function handler () {
  return {
    subject: 'apm',
    status: 'discontinued',
    color: 'grey'
  }
}
