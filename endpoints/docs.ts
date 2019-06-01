import serveMarked from 'serve-marked'
import serve404 from '../libs/serve-404'
import genHelp from '../libs/gen-help'

// Handles `/docs/:name`
export default async function (req, res) {
  const [ , topic, name ] = req.url.split('/')
  const helpMarkdown = genHelp(name)

  if (helpMarkdown) {
    console.info(100, `${name}: ${req.url}`)
    return serveMarked(helpMarkdown, {
      title: `${name} | Badgen`,
      inlineCSS,
    })(req, res)
  }

  serve404(req, res)
}

const inlineCSS = `
  .markdown-body { max-width: 800px }
  li > img { vertical-align: middle; margin: 0.2em 0; font-size: 12px }
  li > img + a { font-family: monospace; font-size: 0.9em }
  li > img + a + i { color: #AAA }
`
