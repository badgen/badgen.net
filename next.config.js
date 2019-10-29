module.exports = {
  target: 'server',
  exportPathMap: async function (defaultPathMap) {
    return {
      '/': { page: '/index' },
      '/builder': { page: '/builder' }
    }
  }
}
