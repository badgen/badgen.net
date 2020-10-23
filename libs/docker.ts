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

// query the docker registry api
export function queryDockerRegistry<T = any>(path: string, headers) {
  const prefixUrl = process.env.DOCKER_REGISTRY_API || 'https://registry.hub.docker.com/'
  return got.get(path, { prefixUrl, headers }).json<T>()
}
