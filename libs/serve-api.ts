import { send } from 'micro'

const STALE_CONTROL = 'stale-while-revalidate=604800, stale-if-error=604800'
const CACHE_CONTROL = `public, max-age=20, s-maxage=120, ${STALE_CONTROL}`

export default async function serveApi (req, res, { params }) {
  res.setHeader('Cache-Control', CACHE_CONTROL)
  return send(res, 200, params)
}
