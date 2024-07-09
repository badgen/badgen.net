import got from 'got'

export default got.extend({
  timeout: {
    request: 6400,
  },
  retry: {
    limit: 0,
  }
})<any>
