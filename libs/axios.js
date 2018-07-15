const axios = require('axios')

module.exports = axios.create({
  timeout: 20000,
  headers: {
    'Accept': 'application/json'
  }
})
