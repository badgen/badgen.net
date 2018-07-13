module.exports = function (...args) {
  return `https://api.travis-ci.org/${args.join('/')}.svg?branch=master`
}
