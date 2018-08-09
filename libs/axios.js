const axios = require('axios')

module.exports = axios.create({
  timeout: 3200,
  headers: {
    'Accept': 'application/json'
  }
})
