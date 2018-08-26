const { readFileSync } = require('fs')
const { Client } = require('pg')
const { formatAsTable } = require('./util')

module.exports.loadQuery = queryName => {
  try {
    const templateFilePath = `queries/${queryName}.sql`
    console.log(`Loading ${templateFilePath}`)
    return readFileSync(`${templateFilePath}`, 'utf8')
  } catch (err) {
    throw new Error(`Error loading template: ${err.message}`)
  }
}

module.exports.runQuery = async sql => {
  console.log('Running query')
  const client = new Client()
  try {
    await client.connect()
    return await client.query(sql)
  } catch (err) {
    throw new Error(`Error executing query: ${err.message}`)
  } finally {
    try {
      await client.end()
    } catch (err) {}
  }
}

module.exports.printQueryResponse = response => {
  response.filter(result => result.command === 'SELECT')
    .forEach(result => {
      const fields = result.fields.map(field => field.name)
      const rows = result.rows.map(row => fields.map(field => row[field]))
      formatAsTable([ fields, ...rows ]).forEach(str => console.log(`    ${str}`))
    })
}