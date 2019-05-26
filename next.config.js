module.exports = {
  target: 'serverless',
  exportPathMap: async function (defaultPathMap) {
    return {
      '/': { page: '/' }
    }
  }
}
