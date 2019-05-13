const got = require('../libs/got.js')
const semColor = require('../libs/utils/sem-color.js')
const v = require('../libs/utils/version-formatter.js')
const badgenServe = require('../libs/badgen-serve.js')

const help = `# badgen/homebrew`

const examples = [
  '/homebrew/v/fish',
  '/homebrew/v/cake'
]

const handlers = {
  '/homebrew/v/:package': async (args) => {
    const { package } = args

    const endpoint = `https://formulae.brew.sh/api/formula/${package}.json`
    const { versions } = await got(endpoint).then(res => res.body)

    return {
      subject: 'homebrew',
      status: v(versions.stable),
      color: semColor(versions.stable)
    }
  }
}

module.exports = badgenServe(handlers, { help, examples })
