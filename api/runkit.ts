import got from '../libs/got'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

const help = `
    https://badgen.net/runkit/amio/cal-badge/Asia/Shanghai
                              ──┬─ ────┬──── ──┬──────────
                                │      │       └─ path-args (optional)
                                │  notebook
                                │
                              owner


## RunKit Endpoint

https://runkit.com/home#endpoint

If you are not familiar with RunKit endpoint, [this guide](https://runkit.com/docs/endpoint) would help.

## Use Badgen with RunKit Endpoint

1. Create a RunKit notebook (e.g. https://runkit.com/amio/cal-badge), which gives you an endpoint:

    \`\`\`
    https://runkit.io/amio/cal-badge/branches/master
    \`\`\`

  it returns a JSON like:

    \`\`\`
    {
      "subject": "2019",
      "status": "6-1",
      "color": "blue"
    }
    \`\`\`

3. Construct badgen url using \`owner\` and \`notebook\` params:

    \`\`\`
    https://badgen.net/runkit/amio/cal-badge
    \`\`\`

  That's it:

  ![](/runkit/amio/cal-badge)

Furthermore, you can append arbitrary path args (e.g. \`/Asia/Shanghai\`) to the end of badgen url, Badgen will request RunKit endpoint with that. This badge:

\`\`\`
https://badgen.net/runkit/amio/cal-badge/Asia/Shanghai
\`\`\`

![](/runkit/amio/cal-badge/Asia/Shanghai)

represents data from:

\`\`\`
https://runkit.io/amio/cal-badge/branches/master/Asia/Shanghai
\`\`\`
`

export default createBadgenHandler({
  title: 'With RunKit Endpoint',
  help,
  examples: {
    '/runkit/vladimyr/metaweather/44418/state': 'metaweather (state)',
    '/runkit/vladimyr/metaweather/44418/temperature': 'metaweather (temperature in °C)',
    '/runkit/vladimyr/metaweather/44418/temperature/f': 'metaweather (temperature in °F)',
    '/runkit/vladimyr/metaweather/44418/wind': 'metaweather (wind in km/h)',
    '/runkit/vladimyr/metaweather/44418/wind/mph': 'metaweather (wind in mph)',
    '/runkit/vladimyr/metaweather/44418/humidity': 'metaweather (humidity)',
  },
  handlers: {
    '/runkit/:endpoint-id<.+-[a-z0-9]{12}>/:path*': handler, // legacy handler
    '/runkit/:owner/:notebook/:path*': handler
  }
})

async function handler ({ 'endpoint-id': id, owner, notebook, path = '' }: PathArgs) {
  const endpoint = id
    ? `https://${id}.runkit.sh/${path}`
    : `https://runkit.io/${owner}/${notebook}/branches/master/${path}`
  return await got(endpoint).json<any>()
}
