const withMDX = require('@zeit/next-mdx')()

module.exports = withMDX({
  pageExtensions: ['js', 'jsx', 'mdx']
})
