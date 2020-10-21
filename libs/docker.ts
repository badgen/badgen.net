import got from './got'

// request image specific DockerHub pull token
export function getDockerAuthToken<T = any>(scope: string, name: string) {
  const prefixUrl = process.env.DOCKER_AUTHENTICATION_API || 'https://auth.docker.io/'
  const service = 'registry.docker.io'
  const searchParams = {
    service: service,
    scope: `repository:${scope}/${name}:pull`
  }
  return got.get("token", { prefixUrl, searchParams }).json<T>()
}

// request fat manifest
export function getDockerFatManifest<T = any>(scope: string, name: string, tag: string, token: string) {
  const headers = {
    authorization: `Bearer ${token}`,
    accept: `application/vnd.docker.distribution.manifest.list.v2+json`
  }
  const prefixUrl = process.env.DOCKER_REGISTRY_API || 'https://registry.hub.docker.com/'
  const path = `v2/${scope}/${name}/manifests/${tag}`
  return got.get(path, { prefixUrl, headers }).json<T>()
}

// request specific image manifest
export function getDockerImageManifest<T = any>(scope: string, name: string, digest: string, token: string) {
  const headers = {
    authorization: `Bearer ${token}`,
    accept: `application/vnd.docker.distribution.manifest.v2+json`
  }
  const prefixUrl = process.env.DOCKER_REGISTRY_API || 'https://registry.hub.docker.com/'
  const path = `v2/${scope}/${name}/manifests/${digest}`
  return got.get(path, { prefixUrl, headers }).json<T>()
}
