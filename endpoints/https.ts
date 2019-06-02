import got from '../libs/got'
import {
  badgenServe,
  BadgenServeMeta as Meta,
  BadgenServeHandlers as Handlers,
  BadgenServeHandlerArgs as Args
} from '../libs/badgen-serve'

const help = `
## Use Badgen with HTTPS Endpoint

1. Create a https endpoint with [RunKit][runkit-href] / [Now][now-href]
or any platform, which returns a JSON in this format:

   \`\`\`
   {
       subject: 'hello',
       status: 'world',
       color: 'blue'
   }
   \`\`\`

2. Assume the endpoint can be reached as:

   \`\`\`
   https://some-endpoint.example.com/what/ever/args
   \`\`\`

   then then the corresponding badge url on Badgen is:

   \`\`\`
   /https/some-endpoint.example.com/what/ever/args
   \`\`\`

Take this endpoint & badgen url for example:

- https://cal-badge-icd0onfvrxx6.runkit.sh
- https://badgen.net/https/cal-badge-icd0onfvrxx6.runkit.sh

Furthermore, you may append path args to it:

- https://cal-badge-icd0onfvrxx6.runkit.sh/Asia/Shanghai
- https://badgen.net/https/cal-badge-icd0onfvrxx6.runkit.sh/Asia/Shanghai

[runkit-href]: https://runkit.com/home#endpoint
[now-href]: https://zeit.co/now

<style>
  li a { font-family: monospace; font-size: 0.9em }
</style>
`

export const meta: Meta = {
  title: 'With https endpoint',
  examples: {
    '/https/cal-badge-icd0onfvrxx6.runkit.sh': 'https endpoint',
    '/https/cal-badge-icd0onfvrxx6.runkit.sh/Asia/Shanghai': 'https endpoint (with path args)',
  },
  help
}

export const handlers: Handlers = {
  '/https/:hostname': handler,
  '/https/:hostname/:path+': handler
}

async function handler ({ hostname, path }: Args) {
  const endpoint = `https://${hostname}/${path || ''}`
  return await got(endpoint).then(res => res.body)
}

export default badgenServe(handlers)
