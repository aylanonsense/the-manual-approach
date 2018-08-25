const { createTablesSQLFile, insertExperimentSQLFile } = require('../config')
const { loadExperiment, validateExperiment } = require('./experiment')
const { createTemplateData, printTemplateData, execTemplate } = require('./template')
const { loadQuery, runQuery } = require('./database')

module.exports = async experimentName => {
  // Get data about the experiment
  const experiment = loadExperiment(experimentName)
  validateExperiment(experiment)

  // Create the SQL query to insert
  const insertExperimentTemplate = loadQuery(insertExperimentSQLFile)
  const templateData = createTemplateData(experiment)
  printTemplateData(templateData)
  const insertExperimentSQL = execTemplate(insertExperimentTemplate, templateData)

  // Create the database tables
  const createTablesSQL = loadQuery(createTablesSQLFile)
  await runQuery(createTablesSQL, 'create tables')

  // Test the query
  await runQuery(insertExperimentSQL, 'insert experiment')

  // Build the finalized SQL query
  const finalSQL = execTemplate(insertExperimentTemplate, { ...templateData, useProductionValues: true })

}
