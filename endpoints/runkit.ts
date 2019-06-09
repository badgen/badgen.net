import got from '../libs/got'
import {
  badgenServe,
  BadgenServeMeta as Meta,
  BadgenServeHandlers as Handlers,
  BadgenServeHandlerArgs as Args
} from '../libs/badgen-serve'

const help = `
    https://badgen.net/runkit/cal-badge-icd0onfvrxx6/Asia/Shanghai
                              ──┬─────────────────── ──┬──────────
                                └─ endpoint-id         └─ path-args (optional)


## RunKit Endpoint

https://runkit.com/home#endpoint

If you are not familiar with RunKit endpoint, [this guide](https://runkit.com/docs/endpoint) would help.

## Use Badgen with RunKit Endpoint

1. Create a RunKit notebook (e.g. https://runkit.com/amio/cal-badge), which gives you an endpoint:

    \`\`\`
    https://cal-badge-icd0onfvrxx6.runkit.sh
    \`\`\`

  it returns a JSON like:

    \`\`\`
    {
      "subject": "2019",
      "status": "6-1",
      "color": "blue"
    }
    \`\`\`

2. Click <kbd>endpoint</kbd> on notebook page for the endpoint address, then you have \`endpoint-id\` from it's subdomain:

    \`\`\`
    cal-badge-icd0onfvrxx6
    \`\`\`

3. Use \`endpoint-id\` within badgen url:

    \`\`\`
    https://badgen.net/runkit/cal-badge-icd0onfvrxx6
    \`\`\`

  That's it:

  ![](https://badgen.net/runkit/cal-badge-icd0onfvrxx6)

Furthermore, you can append arbitrary path args (e.g. \`/Asia/Shanghai\`) to the end of badgen url, Badgen will request RunKit endpoint with that. This badge:

\`\`\`
https://badgen.net/runkit/cal-badge-icd0onfvrxx6/Asia/Shanghai
\`\`\`

represents data from:

\`\`\`
https://cal-badge-icd0onfvrxx6.runkit.sh/Asia/Shanghai
\`\`\`
`

export const meta: Meta = {
  title: 'With RunKit Endpoint',
  examples: {
    '/runkit/satisfaction-flq08o9mm3ka/102909/topic': 'satisfaction (topic)',
    '/runkit/satisfaction-flq08o9mm3ka/102909/people': 'satisfaction (people)',
    '/runkit/satisfaction-flq08o9mm3ka/102909/employee': 'satisfaction (employ)',
  },
  help
}

export const handlers: Handlers = {
  '/runkit/:endpoint-id/:path*': handler
}

async function handler ({ 'endpoint-id': id, path }: Args) {
  const endpoint = `https://${id}.runkit.sh/${path || ''}`
  return await got(endpoint).then(res => res.body)
}

export default badgenServe(handlers)
