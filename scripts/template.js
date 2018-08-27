const { render } = require('Mustache')
const { formatAsTable } = require('./util')

module.exports.createTemplateData = (experimentName, experiment) => {
  const variants = experiment.variants.map(variant => {
    return {
      variantName: variant.name,
      variantIsControl: variant.name === 'Control' || variant.name === 'ControlPrime',
      variantWeight: variant.weight
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

module.exports.execTemplate = (templateString, templateData) => {
  return render(templateString, templateData)
}
