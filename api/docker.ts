import millify from 'millify'
import got from '../libs/got'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'Docker',
  examples: {
    '/docker/pulls/library/ubuntu': 'pulls (library)',
    '/docker/stars/library/ubuntu': 'stars (library)',
    '/docker/size/library/ubuntu/latest': 'size (library)',
    '/docker/pulls/amio/node-chrome': 'pulls (scoped)',
    '/docker/stars/library/mongo?icon=docker&label=stars': 'stars (icon & label)',
  },
  handlers: {
    '/docker/:topic<stars|pulls>/:scope/:name': starPullHandler,
    '/docker/size/:scope/:name/:tag': sizeHandler
  }
})

async function starPullHandler ({ topic, scope, name }: PathArgs) {
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

async function sizeHandler ({ scope, name, tag }: PathArgs) {
  /* eslint-disable camelcase */
  const endpoint = `https://hub.docker.com/v2/repositories/${scope}/${name}/tags`
  let body = await got(endpoint).then(res => res.body)

  let results = [...body.results]
  while (body.next) {
    body = await got(body.next).then(res => res.body)
    results = [...results, ...body.results]
  }

  const tagData = results.find(tagData => tagData.name === tag)

  if (!tagData) {
    return {
      subject: 'docker',
      status: 'unknown tag',
      color: 'grey'
    }
  }

  const sizeInMegabytes = (tagData.full_size / 1024 / 1024).toFixed(2)

  return {
    subject: 'docker image size',
    status: `${sizeInMegabytes} MB`,
    color: 'blue'
  }
}
