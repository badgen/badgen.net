module.exports = function (...args) {
  return `https://api.travis-ci.com/${args.join('/')}.svg?branch=master`
}
