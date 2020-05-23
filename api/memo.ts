import got from '../libs/got'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

const help = `
A badge with memory

## Usage

Update a badge meta with a \`PUT\` request:

    curl -X PUT https://badgen.net/memo/a-public-writable-badge/coverage/75%25/orange

Then you have it:

    https://badgen.net/memo/a-public-writable-badge

![](https://badgen.net/badge/coverage/75%25/orange)

## Limits

Up to 1 write per second per badge.

## Caveat

Since everyone can write to any badge, it's recommended to add a uuid prefix to badge name:

    https://badgen.net/memo/df3ff1af-4703-435a-b4ea-20a38e711c7d-my-coverage-badge

For uuid, you may grab on at https://uuid.now.sh
`

export default createBadgenHandler({
  title: 'Memoized',
  help,
  examples: {
    '/memo/deployed': 'memoized badge for deploy status',
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
