const main = require('./scripts/main')

const runExperiment = async experimentName => {
  try {
    if (experimentName) {
      console.log(`Running for experiment: ${experimentName}\n`)
      await main(experimentName)
      console.log('\nDone!\n')
    } else {
      throw new Error('No experiment name provided, please pass an experiment name as the first argument')
    }
  } catch (err) {
    console.log(`\nFAILED!\n  ${err.message}\n`)
  }
}

runExperiment(process.argv[2])
