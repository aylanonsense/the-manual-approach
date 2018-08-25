const { readFileSync } = require('fs')

module.exports.loadExperiment = experimentName => {
  try {
    const experimentFilePath = `data/experiments/${experimentName}.json`
    console.log(`Loading experiment data from ${experimentFilePath}`)
    return JSON.parse(readFileSync(`${experimentFilePath}`, 'utf8'))
  } catch (err) {
    throw new Error(`Error loading experiment data: ${err.message}`)
  }
}

module.exports.validateExperiment = experiment => {
  console.log('Validating experiment data')
  // TODO
}
