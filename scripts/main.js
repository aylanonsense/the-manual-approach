const config = require('../config')
const { loadExperiment, validateExperiment } = require('./experiment')
const { createTemplateData, execTemplate } = require('./template')
const { loadQuery, runQuery, printQueryResponse } = require('./database')
const { createReviewBranch } = require('./github')

module.exports = async experimentName => {
  console.log('Loading experiment data')
  const experiment = loadExperiment(experimentName)

  console.log('Validating experiment data')
  validateExperiment(experiment)

  console.log('Building SQL file')
  const insertTemplate = loadQuery(config.insertSQLFile)
  const templateData = createTemplateData(experimentName, experiment)
  const insertSQL = execTemplate(insertTemplate, templateData)

  console.log('Resetting database')
  await runQuery(loadQuery(config.resetSQLFile))

  console.log('Running SQL query')
  await runQuery(insertSQL)
  const response = await runQuery(loadQuery(config.selectSQLFile))
  printQueryResponse(response, '  ')

  console.log('Creating review branch')
  const finalSQL = execTemplate(insertTemplate, { ...templateData, useProductionValues: true })
  const commitFilePath = execTemplate(config.commitFilePath, { experimentName })
  const commitBranch = execTemplate(config.commitBranch, { experimentName })
  const commitMessage = execTemplate(config.commitMessage, { experimentName })
  await createReviewBranch(commitFilePath, finalSQL, config.commitRepoPath, commitBranch, commitMessage, config.allowPush)

  console.log('Recommended pull request description:\n')

  console.log(`SQL to insert new experiment for ${ experiment.ticket }`)
  console.log('\nOutput from running locally:\n')
  printQueryResponse(response, '')
}
