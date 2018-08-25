const { sqlTemplateName } = require('../config')
const { loadExperiment, validateExperiment } = require('./experiment')
const { loadTemplate, createTemplateData, printTemplateData, execTemplate } = require('./template')

module.exports = async experimentName => {
  // Get data about the experiment
  const experiment = loadExperiment(experimentName)
  validateExperiment(experiment)

  // Create the SQL query
  const template = loadTemplate(sqlTemplateName)
  const templateData = createTemplateData(experiment)
  printTemplateData(templateData)
  const sql = execTemplate(template, templateData)
}
