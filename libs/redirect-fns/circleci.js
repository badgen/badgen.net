module.exports = function (platform, ...args) {
  switch (platform) {
    case 'github':
      return `https://circleci.com/gh/${args.join('/')}.svg?style=shield`
    default:
      return '/badge/circleci/unknown/grey'
  }
}
