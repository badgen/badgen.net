import url from 'url'
import serveBadge from './serve-badge'

export default function (req, res) {
  const params = {
    subject: 'Badgen',
    status: '404',
    color: 'orange'
  }

  const { query } = url.parse(req.url, true)

  serveBadge(req, res, { code: 404, params, query: query as any })
}
