try {
  module.exports = require('./config.json')
} catch (err) {
  throw new Error('Please create a /config/config.json file based on /config/config.template.json')
}
