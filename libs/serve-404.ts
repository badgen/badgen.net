import url from 'url'
import serveBadge from './serve-badge'

export default function (req, res) {
  const params = {
    subject: 'Badgen',
    status: '404',
    color: 'orange'
  }

  const { query } = url.parse(req.url, true)

  if (query.style === undefined) {
    const host = req.headers['x-forwarded-host'] || req.headers.host
    if (host.startsWith('flat')) {
      query.style = 'flat'
    }
  }

  serveBadge(req, res, { code: 404, params, query: query as any })
}
