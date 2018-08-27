const { readFileSync } = require('fs')

module.exports.loadExperiment = experimentName => {
  const experimentFilePath = `experiments/${experimentName}.json`
  try {
    return JSON.parse(readFileSync(`${experimentFilePath}`, 'utf8'))
  } catch (err) {
    throw new Error(`Error loading experiment data from ${experimentFilePath}: ${err.message}`)
  }
}

module.exports.validateExperiment = experiment => {
  const totalWeight = experiment.variants.reduce((sum, variant) => sum + variant.weight, 0)
  if (totalWeight !== 1.00) {
    throw new Error(`Expected total weight of 1.00, got ${totalWeight}`)
  }
  const hasControl = experiment.variants.filter(variant => variant.name === 'Control').length > 0
  if (!hasControl) {
    throw new Error('Experiment must have a Control')
  }
}
