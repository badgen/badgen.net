import { createBadgenHandler, PathArgs } from '../../libs/create-badgen-handler-next'

export default createBadgenHandler({
  title: 'Email',
  examples: {
    '/email/com/consulting/tunnckocore': 'email',
    '/email/co.uk/foobar/mydomain': 'email',
  },
  handlers: {
    '/email/:tld/:name/:domain': handler
  }
})

async function handler ({ tld, name, domain }: PathArgs) {
  return {
    subject: 'email',
    status: `${name}@${domain}.${tld}`,
    color: 'blue'
  }
}
