import path from 'path'
import fse from 'fs-extra'

const rel = (...args) => path.resolve(__dirname, ...args)

async function main () {
  const staticExamples = (await import(rel('../endpoints/badge'))).examples

  // sort badges manually
  const liveBadgeList = {
    github: 'github',
    // npm: 'npm',
    // david: 'david-dm',
    // packagephobia: 'packagephobia',
    // bundlephobia: 'bundlephobia',
    // xo: 'xo',
    // crates: 'crates',
    // docker: 'docker',
    homebrew: 'homebrew'
  }

  // @ts-ignore
  const liveExamples = await Promise.all(Object.entries(liveBadgeList).map(async ([name, title]) => {
    const { examples, handlers } = await import(rel('../endpoints', name))
    return {
      title,
      examples,
      handlers: Object.keys(handlers)
    }
  }))


  const examples = {
    live: liveExamples,
    static: staticExamples
  }

  await fse.outputJson(rel('../static/.gen/examples.json'), examples)

  console.log(examples)
}

main()

process.on('unhandledRejection', console.error)
