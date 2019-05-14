import path from 'path'
import serve404 from '../libs/serve-404'

// Handles `/docs/:name`
export default async function (req, res) {
  const [ , , name ] = req.url.split('/')

  if (name) {
    try {
      const handlerModulePath = path.join(__dirname, name)
      const { help, examples, handlers } = await import(handlerModulePath)
      if (help || examples) {
        return serveHelp(req, res, name, { help, examples, handlers })
      } else {
        return serve404(req, res)
      }
    } catch (error) {
      if (error.code === 'MODULE_NOT_FOUND') {
        return serve404(req, res)
      } else {
        console.error(error)
        return serve404(req, res)
      }
    }
  }

  serve404(req, res)
}

function serveHelp (req, res, id, { help, examples, handlers }) {
  const Docs = help ? help : `# ${id}`
  const Schemes = `## Schemes\n\n${Object.keys(handlers).join('\n')}`
  const Examples = `## Examples\n\n${examples.join('\n')}`

  const md = [Docs, Schemes, Examples].join('\n\n')
  res.end(md)
}
