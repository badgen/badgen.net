import { BadgenServeHandlers } from './badgen-serve'

type BadgenExample = [string, string]
type BadgenHelpParams = {
  id: string,
  title: string,
  examples: BadgenExample[]
  routes: string[],
  help?: any
}

export default function serveHelp (req, res, id, params: BadgenHelpParams) {
  const { help, examples, routes } = params
  const Docs = help ? help : `# ${id}`
  const Schemes = `## Schemes\n\n${routes.join('\n')}`
  const Examples = `## Examples\n\n${Object.entries(examples).map(ex => ex[0]).join('\n')}`

  const md = [Docs, Schemes, Examples].join('\n\n')
  res.end(md)
}
