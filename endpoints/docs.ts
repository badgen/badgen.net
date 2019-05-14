import path from 'path'
import serve404 from '../libs/serve-404'
import serveHelp from '../libs/serve-help'

// Handles `/docs/:name`
export default async function (req, res) {
  const [ , , name ] = req.url.split('/')

  if (name) {
    try {
      const handlerModulePath = path.join(__dirname, name)
      const { help, examples, handlers } = await import(handlerModulePath)
      if (help || examples) {
        return serveHelp(req, res, name, { help, examples, handlers })
      }
    } catch (error) {
      if (error.code !== 'MODULE_NOT_FOUND') {
        console.error(error)
        throw error
      }
    }
  }

  serve404(req, res)
}
