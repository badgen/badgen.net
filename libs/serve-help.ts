export default function serveHelp (req, res, id, { help, examples, handlers }) {
  const Docs = help ? help : `# ${id}`
  const Schemes = `## Schemes\n\n${Object.keys(handlers).join('\n')}`
  const Examples = `## Examples\n\n${examples.join('\n')}`

  const md = [Docs, Schemes, Examples].join('\n\n')
  res.end(md)
}
