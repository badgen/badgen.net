import millify from 'millify'
import got from '../libs/got'
import { getDockerAuthToken, queryDockerRegistry } from '../libs/docker'
import { createBadgenHandler, PathArgs } from '../libs/create-badgen-handler'

export default createBadgenHandler({
  title: 'Docker',
  examples: {
    '/docker/pulls/library/ubuntu': 'pulls (library)',
    '/docker/stars/library/ubuntu': 'stars (library)',
    '/docker/size/library/ubuntu': 'size (library)',
    '/docker/pulls/amio/node-chrome': 'pulls (scoped)',
    '/docker/stars/library/mongo?icon=docker&label=stars': 'stars (icon & label)',
    '/docker/size/lukechilds/bitcoind/latest/amd64': 'size (scoped/tag/architecture)',
    '/docker/size/lucashalbert/curl/latest/arm/v6': 'size (scoped/tag/architecture/variant)',
    '/docker/metadata/size/lucashalbert/curl/latest/arm/v6': 'metadata (size)',
    '/docker/metadata/layers/lucashalbert/curl/latest/arm/v7': 'metadata (layers and size)',
    '/docker/metadata/layers/lucashalbert/curl/latest/arm/v7?icon=docker&label=layers': 'metadata (layers) [icon & label]',
    '/docker/metadata/layers/lucashalbert/curl/latest/arm/v7?label=docker%20layers': 'metadata (layers) [label]',
    '/docker/metadata/version/lucashalbert/curl/latest/arm64/v8': 'metadata (version)',
    '/docker/metadata/architecture/lucashalbert/curl/latest/arm64/v8': 'metadata (architecture)',
    '/docker/metadata/build-date/lucashalbert/curl/latest/arm64/v8': 'metadata (build-date)',
    '/docker/metadata/maintainer/lucashalbert/curl/latest/arm64/v8': 'metadata (maintainer)',
  },
  handlers: {
    '/docker/:topic<stars|pulls>/:scope/:name': starPullHandler,
    '/docker/size/:scope/:name/:tag?/:architecture?/:variant?': sizeHandler,
    '/docker/metadata/:type<size|layers|version|architecture|build-date|maintainer>/:scope/:name/:tag?/:architecture?/:variant?': metadataHandler,
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
  }
}

async function sizeHandler ({ scope, name, tag, architecture, variant }: PathArgs) {
  tag = tag ? tag : 'latest'
  architecture = architecture ? architecture : 'amd64'
  variant = variant ? variant : ''
  /* eslint-disable camelcase */
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
    subject: 'docker image size',
    status: `${sizeInMegabytes} MB`,
    color: 'blue'
  }
}

async function metadataHandler ({ type, scope, name, tag, architecture, variant }: PathArgs) {
  if (!['size', 'layers', 'version', 'architecture', 'build-date', 'maintainer'].includes(type)) {
    return {
      subject: 'docker metadata',
      status: `unknown type: ${type}`,
      color: 'grey'
    }
  }

  tag = tag ? tag : 'latest'
  architecture = architecture ? architecture : 'amd64'
  variant = variant ? variant : ''

  const token = (await getDockerAuthToken(scope, name)).token
  
  if (! token) {
    return {
      subject: 'docker metadata',
      status: `unknown image: ${scope}/${name}`,
      color: 'grey'
    }
  }

  let headers = {
    authorization: `Bearer ${token}`,
    accept: `application/vnd.docker.distribution.manifest.list.v2+json`
  }
  let path = `v2/${scope}/${name}/manifests/${tag}`
  
  const manifest_list = (await queryDockerRegistry(path, headers)).manifests
  
  if (! manifest_list) {
    return {
      subject: `docker image ${type}`,
      status: `unknown tag: ${tag}`,
      color: 'grey'
    }
  }

  let manifest = manifest_list.find(manifest_list => manifest_list.platform.architecture === architecture)

  if (! manifest) {
    return {
      subject: `docker image ${type}`,
      status: `unknown architecture: ${architecture}`,
      color: 'grey'
    }
  }

  if (variant) {
    manifest = manifest_list.filter(manifest_list => manifest_list.platform.architecture === architecture).find(manifest_list => manifest_list.platform.variant === variant)

    if (! manifest) {
      return {
        subject: `docker image ${type}`,
        status: `unknown variant: ${variant}`,
        color: 'grey'
      }
    }
  }

  if (! manifest.digest) {
    return {
      subject: `docker image ${type}`,
      status: 'error getting image digest',
      color: 'grey'
    }
  }

  path = `v2/${scope}/${name}/manifests/${manifest.digest}`
  const image_manifest = await queryDockerRegistry(path, headers)

  if (! image_manifest) {
    return {
      subject: `docker image ${type}`,
      status: 'error getting image manifest',
      color: 'grey'
    }
  }

  const size = image_manifest.layers.map(layer => layer.size).reduce((accumulator, current) => accumulator + current, 0)
  const sizeInMegabytes = (size / 1024 / 1024).toFixed(2)

  headers = {
    authorization: `Bearer ${token}`,
    accept: `application/vnd.docker.image.config+json`
  }
  path = `v2/${scope}/${name}/blobs/${image_manifest.config.digest}`
  const image_config = await queryDockerRegistry(path, headers)

  if (! image_config) {
    return {
      subject: `docker image ${type}`,
      status: 'error getting image config',
      color: 'grey'
    }
  }


  switch (type) {
    case 'size':
      return {
        subject: `docker image ${type}`,
        status: `${sizeInMegabytes} MB`,
        color: 'blue'
      }
    
    case 'layers':
      const layers = image_config.history
      if (! layers) {
        return {
          subject: `docker image ${type}`,
          status: 'error getting layers',
          color: 'grey'
        }
      }

      return {
        subject: `${sizeInMegabytes} MB`,
        status: `${layers.length}`,
        color: 'blue'
      }

    case 'version':
      const version = image_config.container_config.Labels["org.label-schema.version"]
      if (! version) {
        return {
          subject: `docker image ${type}`,
          status: 'error getting version',
          color: 'grey'
        }
      }

      return {
        subject: `docker image ${type}`,
        status: `${version}`,
        color: 'blue'
      }

    case 'architecture':
      const arch = image_config.container_config.Labels["org.label-schema.architecture"]
      if (! arch) {
        return {
          subject: `docker image ${type}`,
          status: 'error getting architecture',
          color: 'grey'
        }
      }

      return {
        subject: `docker image ${type}`,
        status: `${arch}`,
        color: 'blue'
      }

    case 'build-date':
      const build_date = image_config.container_config.Labels["org.label-schema.build-date"]
      if (! build_date) {
        return {
          subject: `docker image ${type}`,
          status: 'error getting build-date',
          color: 'grey'
        }
      }

      return {
        subject: `docker image ${type}`,
        status: `${build_date}`,
        color: 'blue'
      }

    case 'maintainer':
      const maintainer = image_config.container_config.Labels["org.label-schema.maintainer"]
      if (! maintainer) {
        return {
          subject: `docker image ${type}`,
          status: 'error getting maintainer',
          color: 'grey'
        }
      }

      return {
        subject: `docker image ${type}`,
        status: `${maintainer}`,
        color: 'blue'
      }
  }
}
