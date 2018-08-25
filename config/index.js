let config

try {
  config = require('./config.json')
} catch (err) {
  console.log('Please create a /config/config.json file based on /config/config.template.json')
  config = {}
}

module.exports = config