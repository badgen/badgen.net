export default (resp: Response) => {
  const contentType = resp.headers.get('content-type') || ''
  return contentType.includes('image/svg+xml')
}
