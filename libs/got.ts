import got from 'got'

export default got.extend({
  timeout: {
    request: 3200,
  },
  retry: {
    limit: 0,
  }
})<any>
