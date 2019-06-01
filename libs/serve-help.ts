import serveMarked from 'serve-marked'

type BadgenHelpParams = {
  id: string,
  title: string,
  examples: { [url: string]: string }
  routes: string[],
  help?: any
}

function genMarkdown ({ id, help, examples, routes }: BadgenHelpParams) {
  const Docs = help ? help : `# /${id}`

  const schemeLinks = routes.map(r => `- \`${r}\``)
  const Schemes = `## Schemes\n\n${schemeLinks.join('  \n')}`

  const exampleList = Object.entries(examples)
    .map(([url, desc]) => `- ![${url}](${url}) [${url}](${url}) <i>${desc}</i>`)
  const Examples = `## Examples\n\n${exampleList.join('\n')}`

  const md = [Docs, Schemes, Examples].join('\n\n')
  return md
}

export default function serveHelp (req, res, params: BadgenHelpParams) {
  const md = genMarkdown(params)
  return serveMarked(md, {
    title: `${params.title} | Badgen`,
    inlineCSS,
  })(req, res)
}

const inlineCSS = `
  .markdown-body { max-width: 800px }
  li > img { vertical-align: middle; margin: 0.2em 0; font-size: 12px }
  li > img + a { font-family: monospace; font-size: 0.9em }
  li > img + a + i { color: #AAA }
`
