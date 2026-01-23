import { createBadgenHandler, PathArgs } from '../../libs/create-badgen-handler-next'

const help = `
## Discontinued

Twitter API has been discontinued.
`

export default createBadgenHandler({
  title: 'Twitter',
  examples: {
    '/twitter/follow/rustlang': 'followers count',
    '/twitter/follow/golang': 'followers count',
  },
  handlers: {
    '/twitter/:topic<follow>/:user': handler
  },
  help
})

async function handler ({ topic, user }: PathArgs) {
  return {
    subject: 'twitter badge',
    status: 'discontinued',
    color: 'grey',
  }
}
