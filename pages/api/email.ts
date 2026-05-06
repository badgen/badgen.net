import { createBadgenHandler, PathArgs } from '../../libs/create-badgen-handler-next'

export default createBadgenHandler({
  title: 'Email',
  examples: {
    '/email/consulting/tunnckocore.com': 'email',
    '/email/foobar/mydomain.co.uk': 'email',
  },
  handlers: {
    '/email/:name/:domain': handler
  }
})

async function handler ({ name, domain }: PathArgs) {
  return {
    subject: 'email',
    status: `${name}@${domain}`,
    color: 'blue'
  }
}
