import millify from 'millify'
import got from '../libs/got'
import {
  badgenServe,
  BadgenServeMeta as Meta,
  BadgenServeHandlers as Handlers,
  BadgenServeHandlerArgs as Args
} from '../libs/badgen-serve'

export const meta: Meta = {
  title: 'Docker',
  examples: {
    '/docker/pulls/library/ubuntu': 'pulls (library)',
    '/docker/stars/library/ubuntu': 'stars (library)',
    '/docker/pulls/amio/node-chrome': 'pulls (scoped)',
    '/docker/stars/library/mongo?icon=docker&label=stars': 'stars (icon & label)',
  }
}

export const handlers: Handlers = {
  '/docker/:topic<stars|pulls>/:scope/:name': handler
}

export default badgenServe(handlers)

async function handler ({ topic, scope, name }: Args) {
  if (!['stars', 'pulls'].includes(topic)) {
    return {
      subject: 'docker',
      status: 'unknown topic',
      color: 'grey'
    }
  }

  /* eslint-disable camelcase */
  const endpoint = `https://hub.docker.com/v2/repositories/${scope}/${name}`
  const { pull_count, star_count } = await got(endpoint).then(res => res.body)

  switch (topic) {
    case 'stars':
      return {
        subject: 'docker stars',
        status: millify(star_count),
        color: 'blue'
      }
    case 'pulls':
      return {
        subject: 'docker pulls',
        status: millify(pull_count),
        color: 'blue'
      }
  }
}
