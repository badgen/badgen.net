const got = require('../libs/got.js')
const semColor = require('../libs/utils/sem-color.js')
const badgenServe = require('../libs/badgen-serve.js')
const v = require('../libs/utils/version-formatter.js')

const help = `# badgen/homebrew`

const examples = [
  '/homebrew/v/fish',
  '/homebrew/v/cake'
]

const schemes = [
  '/homebrew/v/:package'
]

const handler = async (args) => {
  const { package } = args

  const endpoint = `https://formulae.brew.sh/api/formula/${package}.json`
  const { versions } = await got(endpoint).then(res => res.body)

  return {
    subject: 'homebrew',
    status: v(versions.stable),
    color: semColor(versions.stable)
  }
}

module.exports = badgenServe(schemes, handler, { help, examples })
