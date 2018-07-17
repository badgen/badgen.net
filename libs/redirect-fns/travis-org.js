module.exports = function (...args) {
  console.log('travis-org', args.join('/'))
  return `https://api.travis-ci.org/${args.join('/')}.svg?branch=master`
}
