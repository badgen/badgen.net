import got from './got'
import { BadgenError } from './create-badgen-handler'

// request image specific DockerHub pull token
export function getDockerAuthToken<T = any>(scope: string, name: string) {
  const prefixUrl = process.env.DOCKER_AUTHENTICATION_API || 'https://auth.docker.io/'
  const service = 'registry.docker.io'
  const searchParams = {
    service: service,
    scope: `repository:${scope}/${name}:pull`
  }
  
  const resp = got.get("token", { prefixUrl, searchParams }).json<T>()

  if (! resp) {
    throw new BadgenError({ status: 'unknown image' })
  }

  return resp
}

// query the docker registry api
function queryDockerRegistry<T = any>(path: string, headers) {
  const prefixUrl = process.env.DOCKER_REGISTRY_API || 'https://registry.hub.docker.com/'
  return got.get(path, { prefixUrl, headers }).json<T>()
}

// get fat manifest list and return
export async function getManifestList<T = any>(scope: string, name: string, tag: string, architecture: string, variant: string, token: string) {
  const headers = {
    authorization: `Bearer ${token}`,
    accept: `application/vnd.docker.distribution.manifest.list.v2+json`
  }
  const path = `v2/${scope}/${name}/manifests/${tag}`
  const manifest_list = (await queryDockerRegistry(path, headers)).manifests

  if (! manifest_list) {
    throw new BadgenError({ status: 'unknown tag' })
  }

  let manifest = manifest_list.find(manifest_list => manifest_list.platform.architecture === architecture)

  if (! manifest) {
    throw new BadgenError({ status: 'unknown architecture' })
  }

  if (variant) {
    manifest = manifest_list.filter(manifest_list => manifest_list.platform.architecture === architecture).find(manifest_list => manifest_list.platform.variant === variant)

    if (! manifest) {
      throw new BadgenError({ status: 'unknown variant' })
    }
  }

  if (! manifest.digest) {
    throw new BadgenError({ status: 'image digest error' })
  }

  return manifest
}

export async function getImageManifest<T = any>(scope: string, name: string, digest: string, token: string) {
  const headers = {
    authorization: `Bearer ${token}`,
    accept: `application/vnd.docker.distribution.manifest.list.v2+json`
  }
  const path = `v2/${scope}/${name}/manifests/${digest}`
  const image_manifest = await queryDockerRegistry(path, headers)

  if (! image_manifest) {
    throw new BadgenError({ status: 'image manifest error' })
  }

  return image_manifest
}

export async function getImageConfig<T = any>(scope: string, name: string, digest: string, token: string) {
  const headers = {
    authorization: `Bearer ${token}`,
    accept: `application/vnd.docker.image.config+json`
  }
  const path = `v2/${scope}/${name}/blobs/${digest}`
  const image_config = await queryDockerRegistry(path, headers)

  if (! image_config) {
    throw new BadgenError({ status: 'image config error' })
  }
  return image_config
}