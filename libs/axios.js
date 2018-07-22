const axios = require('axios')

module.exports = axios.create({
  timeout: 12000,
  headers: {
    'Accept': 'application/json'
  }
})
