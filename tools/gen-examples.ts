import path from 'path'
import fse from 'fs-extra'
import { loadExamples } from '../libs/examples'

const rel = (...args) => path.resolve(__dirname, ...args)

async function main () {
  const examples = await loadExamples()
  console.log(examples)

  await fse.outputJson(rel('../static/.gen/examples.json'), examples)
}

main()

process.on('unhandledRejection', console.error)
