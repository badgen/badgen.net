import got from 'got'

export default got.extend({
  timeout: 3200,
  retry: 0
})
