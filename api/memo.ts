import got from '../libs/got'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

const help = `
## help
`

export default createBadgenHandler({
  title: 'Memoized',
  help,
  examples: {
    '/memo/deployed': 'https endpoint',
  },
  handlers: {
    '/memo/:name': handler
  }
})

async function handler ({ name, path }: PathArgs) {
  const endpoint = `https://badgen-store.amio.workers.dev/${name}`
  const data = await got(endpoint).json<any>()
  data.subject = data.subject || data.label
  return data
}
