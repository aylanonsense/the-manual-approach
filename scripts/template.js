const { render } = require('Mustache')
const { formatAsTable } = require('./util')

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
  return render(templateString, templateData)
}
