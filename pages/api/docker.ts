import millify from 'millify'
import got from '../../libs/got'
import { getDockerAuthToken, getManifestList, getImageManifest, getImageConfig } from '../../libs/docker'
import { createBadgenHandler, PathArgs } from '../../libs/create-badgen-handler-next'

const help = `## Usage

- \`/docker/stars/:scope/:name\`   _stars_
- \`/docker/pulls/:scope/:name\`   _pulls_
- \`/docker/size/:scope/:name/:tag?/:architecture?/:variant?\` _size (scoped/tag/architecture/variant)_
- \`/docker/layers/:scope/:name/:tag?/:architecture?/:variant?\` _layers (scoped/tag/architecture/variant)_
- \`/docker/metadata/:type/:scope/:name/:tag?/:architecture?/:variant?\` _metadata (type/scoped/tag/architecture/variant)_

### Querying [Label-Schema](http://label-schema.org/) Metadata

Metadata associated with an image in the [label-schema](http://label-schema.org/) format can be queried using the metadata handler. For example, a label of \`org.label-schema.build-date=2020-10-26T14:25:14Z\` on the image \`lucashalbert/curl\` can be queried using the badgen URL of [/docker/metadata/build-date/lucashalbert/curl/](/docker/metadata/build-date/lucashalbert/curl/).
`

export default createBadgenHandler({
  help,
  title: 'Docker',
  examples: {
    '/docker/pulls/library/ubuntu': 'pulls (library)',
    '/docker/stars/library/ubuntu': 'stars (library)',
    '/docker/size/library/ubuntu': 'size (library)',
    '/docker/pulls/amio/node-chrome': 'pulls (scoped)',
    '/docker/stars/library/mongo?icon=docker&label=stars': 'stars (icon & label)',
    '/docker/size/lukechilds/bitcoind/latest/amd64': 'size (scoped/tag/architecture)',
    '/docker/size/lucashalbert/curl/latest/arm/v6': 'size (scoped/tag/architecture/variant)',
    '/docker/layers/lucashalbert/curl/latest/arm/v7': 'layers (size)',
    '/docker/layers/lucashalbert/curl/latest/arm/v7?icon=docker&label=layers': 'layers (icon & label)',
    '/docker/layers/lucashalbert/curl/latest/arm/v7?label=docker%20layers': 'layers (label)',
    '/docker/metadata/version/lucashalbert/curl/latest/arm64/v8': 'metadata (version)',
    '/docker/metadata/architecture/lucashalbert/curl/latest/arm64/v8': 'metadata (architecture)',
    '/docker/metadata/build-date/lucashalbert/curl/latest/arm64/v8': 'metadata (build-date)',
    '/docker/metadata/maintainer/lucashalbert/curl/latest/arm64/v8': 'metadata (maintainer)',
  },
  handlers: {
    '/docker/:topic<stars|pulls>/:scope/:name': starPullHandler,
    '/docker/size/:scope/:name/:tag?/:architecture?/:variant?': sizeHandler,
    '/docker/layers/:scope/:name/:tag?/:architecture?/:variant?': layersHandler,
    '/docker/metadata/:type/:scope/:name/:tag?/:architecture?/:variant?': metadataHandler,
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

   
  const endpoint = `https://hub.docker.com/v2/repositories/${scope}/${name}`
  const { pull_count, star_count } = await got(endpoint).json<any>()

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
    default:
      return {
        subject: 'docker',
        status: 'unknown topic',
        color: 'grey'
      }
  }
}

async function sizeHandler ({ scope, name, tag, architecture, variant }: PathArgs) {
  tag = tag ? tag : 'latest'
  architecture = architecture ? architecture : 'amd64'
  variant = variant ? variant : ''
   
  const endpoint = `https://hub.docker.com/v2/repositories/${scope}/${name}/tags`
  let body = await got(endpoint).json<any>()

  let results = [...body.results]
  while (body.next) {
    body = await got(body.next).json<any>()
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

  let imageData = tagData.images.find(image => image.architecture === architecture)

  if (!imageData) {
    return {
      subject: 'docker',
      status: 'unknown architecture',
      color: 'grey'
    }
  }

  if (variant) {
    imageData = tagData.images.filter(image => image.architecture === architecture).find(image => image.variant === variant)

    if (!imageData) {
      return {
        subject: 'docker',
        status: 'unknown variant',
        color: 'grey'
      }
    }
  }

  const sizeInMegabytes = (imageData.size / 1024 / 1024).toFixed(2)

  return {
    subject: 'docker size',
    status: `${sizeInMegabytes} MB`,
    color: 'blue'
  }
}

async function layersHandler ({ scope, name, tag, architecture, variant }: PathArgs) {
  tag = tag ? tag : 'latest'
  architecture = architecture ? architecture : 'amd64'
  variant = variant ? variant : ''

  const token = (await getDockerAuthToken(scope, name)).token

  const manifest_list = await getManifestList(scope, name, tag, architecture, variant, token)

  const image_manifest = await getImageManifest(scope, name, manifest_list.digest, token)

  const image_config = await getImageConfig(scope, name, image_manifest.config.digest, token)

  const layers = image_config.history
  if (! layers) {
    return {
      subject: 'docker layers',
      status: 'error getting layers',
      color: 'grey'
    }
  }

  return {
    subject: 'docker layers',
    status: `${layers.length}`,
    color: 'blue'
  }
}

async function metadataHandler ({ type, scope, name, tag, architecture, variant }: PathArgs) {
  tag = tag ? tag : 'latest'
  architecture = architecture ? architecture : 'amd64'
  variant = variant ? variant : ''

  const token = (await getDockerAuthToken(scope, name)).token

  const manifest_list = await getManifestList(scope, name, tag, architecture, variant, token)

  const image_manifest = await getImageManifest(scope, name, manifest_list.digest, token)

  const image_config = await getImageConfig(scope, name, image_manifest.config.digest, token)

  const metadata = image_config.container_config.Labels[`org.label-schema.${type}`] || image_config.container_config.Labels[`org.opencontainers.image.${type}`]
  if (! metadata) {
    return {
      subject: 'docker metadata',
      status: `error getting ${type}`,
      color: 'grey'
    }
  }

  return {
    subject: `${type}`,
    status: `${metadata}`,
    color: 'blue'
  }
}
