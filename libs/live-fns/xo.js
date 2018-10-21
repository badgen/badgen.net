const got = require('../got.js')

const getIndent = space => {
  if (space === false) return 'tab'
  if (space === true) return '2 spaces'
  if (space === 1) return '1 space'
  return `${space} spaces`
}

module.exports = async (topic, ...project) => {
  const endpoint = `https://cdn.jsdelivr.net/npm/${project.join('/')}/package.json`
  const data = await got(endpoint).then(res => res.body)

  if (!data.devDependencies || !('xo' in data.devDependencies)) {
    return {
      subject: 'xo',
      status: 'not enabled',
      color: 'grey'
    }
  }

  const {
    semicolon = true,
    space = false
  } = (data.xo || {})

  switch (topic) {
    case 'status':
      return {
        subject: 'code style',
        status: 'XO',
        color: '5ED9C7'
      }

    case 'indent':
      return {
        subject: 'indent',
        status: getIndent(space),
        color: '5ED9C7'
      }

    case 'semi':
      return {
        subject: 'semicolons',
        status: semicolon ? 'enabled' : 'disabled',
        color: '5ED9C7'
      }
  }
}
