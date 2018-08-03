const axios = require('axios')

module.exports = axios.create({
  timeout: 6000,
  headers: {
    'Accept': 'application/json'
  }
})
