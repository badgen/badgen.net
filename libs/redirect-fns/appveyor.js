module.exports = function (...args) {
  return `https://ci.appveyor.com/api/projects/status/${args.join('/')}?branch=master&svg=true`
}
