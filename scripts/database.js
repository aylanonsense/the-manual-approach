const { readFileSync } = require('fs')
const { Client } = require('pg')
const { formatAsTable } = require('./util')

module.exports.loadQuery = queryName => {
  const templateFilePath = `queries/${queryName}.sql`
  try {
    return readFileSync(`${templateFilePath}`, 'utf8')
  } catch (err) {
    throw new Error(`Error loading template from ${templateFilePath}: ${err.message}`)
  }
}

module.exports.runQuery = async sql => {
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

module.exports.printQueryResponse = (response, indent='') => {
  response.filter(result => result.command === 'SELECT')
    .forEach(result => {
      if (result.rows.length > 0) {
        const fields = result.fields.map(field => field.name)
        const rows = result.rows.map(row => fields.map(field => row[field]))
        formatAsTable([ fields.map(field => field.toUpperCase()), ...rows ])
          .forEach(str => console.log(`${indent}${str}`))
        console.log()
      }
    })
}
