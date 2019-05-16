import { BadgenServeHandlers } from './badgen-serve'

type BadgenExample = [string, string]
type BadgenHelpParams = {
  help?: any
  examples?: BadgenExample[]
  handlers: BadgenServeHandlers
}

export default function serveHelp (req, res, id, params: BadgenHelpParams) {
  const { help, examples = [], handlers } = params
  const Docs = help ? help : `# ${id}`
  const Schemes = `## Schemes\n\n${Object.keys(handlers).join('\n')}`
  const Examples = `## Examples\n\n${examples.map(ex => ex[0]).join('\n')}`

  const md = [Docs, Schemes, Examples].join('\n\n')
  res.end(md)
}
