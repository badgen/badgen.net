export default (resp: import('got').Response) => {
  const contentType = resp.headers['content-type'] || ''
  return contentType.includes('image/svg+xml')
}
