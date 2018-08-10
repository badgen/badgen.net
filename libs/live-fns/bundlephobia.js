const axios = require('../axios.js')
const byteSize = require('byte-size')

// https://github.com/pastelsky/bundlephobia/issues/4

module.exports = async (topic, ...args) => {
  const endpoint = `https://bundlephobia.com/api/size?package=${args.join('/')}`
  const { size, gzip } = await axios(endpoint).then(res => res.data)

  switch (topic) {
    case 'min':
      return {
        subject: 'minified size',
        status: byteSize(size, { units: 'iec' }).toString().replace(/iB\b/, 'B'),
        color: 'blue'
      }
    case 'minzip':
      return {
        subject: 'minzipped size',
        status: byteSize(gzip, { units: 'iec' }).toString().replace(/iB\b/, 'B'),
        color: 'blue'
      }
  }
}
