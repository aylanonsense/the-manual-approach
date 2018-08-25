const { render } = require('Mustache')
const { readFileSync } = require('fs')

module.exports.loadTemplate = templateName => {
  try {
    const templateFilePath = `templates/${templateName}.tpl`
    console.log(`Loading ${templateFilePath}`)
    return readFileSync(`${templateFilePath}`, 'utf8')
  } catch (err) {
    throw new Error(`Error loading template: ${err.message}`)
  }
}

module.exports.createTemplateData = experiment => {
  console.log('Creating template data')
  const experimentName = experiment.name
  const variants = experiment.variants.map(variant => {
    return {
      variantName: variant.name,
      variantIsControl: variant.name === 'Control' || variant.name === 'ControlPrime',
      variantPercent: variant.percent
    }
  })
  const attributes = experiment.variants.reduce((acc, variant) => {
    return [
      ...acc,
      ...Object.entries(variant.attributes || {}).map(([ name, value ]) => {
        return {
          variantName: variant.name,
          attributeName: name,
          attributeValue: value
        }
      })
    ]
  }, [])
  return {
    experimentName,
    hasVariants: variants.length > 0,
    variants,
    hasAttributes: attributes.length > 0,
    attributes
  }
}

const formatAsTable = tabularData => {
  const maxColumnLengths = tabularData[0].map((x, col) => {
    return tabularData.reduce((maxLength, row) => Math.max(maxLength, `${row[col]}`.length), 0)
  })
  return tabularData.map(row => {
    return row.map((cell, col) => `${cell}`.padEnd(maxColumnLengths[col])).join('  ')
  })
}

module.exports.printTemplateData = templateData => {
  console.log('  Experiment:')
  console.log(`    ${templateData.experimentName}`)
  console.log('  Variants:')
  formatAsTable([
    [ 'VARIANT NAME', 'CONTROL', 'PERCENT' ],
    ...templateData.variants.map(variant => [ variant.variantName, variant.variantIsControl ? 'yes' : 'no', variant.variantPercent ])
  ]).map(str => console.log(`    ${str}`))
  console.log('  Attributes:')
  if (templateData.attributes.length <= 0) {
    console.log('    (none)')
  } else {
    formatAsTable([
      [ 'VARIANT NAME', 'ATTRIBUTE', 'VALUE' ],
      ...templateData.attributes.map(attr => [ attr.variantName, attr.attributeName, attr.attributeValue ])
    ]).map(str => console.log(`    ${str}`))
  }
}

module.exports.execTemplate = (templateString, templateData) => {
  console.log('Executing template')
  return render(templateString, templateData)
}
