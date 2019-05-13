import got from 'got'

export default got.extend({
  json: true,
  timeout: 3200,
  retry: 0
})
