import serveBadge from './serve-badge'

export default function (req, res) {
  const params = {
    subject: 'Badgen',
    status: '404',
    color: 'orange'
  }

  serveBadge(req, res, { code: 404, params })
}
