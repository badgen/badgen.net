import got from 'got'

export default got.extend({
  timeout: {
    request: 4600,
  },
  retry: {
    limit: 0,
  }
})<any>
