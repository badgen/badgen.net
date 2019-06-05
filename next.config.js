module.exports = {
  target: 'serverless',
  exportPathMap: async function (defaultPathMap) {
    return {
      '/': { page: '/index' },
      '/builder': { page: '/builder' }
    }
  }
}
