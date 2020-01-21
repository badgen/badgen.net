import ky from '../libs/ky'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

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

export default createBadgenHandler({
  title: 'With HTTPS Endpoint',
  help,
  examples: {
    '/https/cal-badge-icd0onfvrxx6.runkit.sh': 'https endpoint',
    '/https/cal-badge-icd0onfvrxx6.runkit.sh/Asia/Shanghai': 'https endpoint (with path args)',
    '/https/cal-badge-icd0onfvrxx6.runkit.sh/America/Los_Angeles': 'https endpoint (with path args)',
  },
  handlers: {
    '/https/:hostname/:path*': handler
  }
})

async function handler ({ hostname, path }: PathArgs) {
  const endpoint = `https://${hostname}/${path || ''}`
  return await ky(endpoint).then(res => res.json())
}
