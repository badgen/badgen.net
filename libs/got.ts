import got from 'got'

export default got.extend({
  timeout: {
    request: 6400,
  },
  retry: {
    limit: 0,
  },
  headers: {
    'user-agent': 'Mozilla/5.0 (compatible; Badgen/1.0; +https://badgen.net)',
  }
})<any>
