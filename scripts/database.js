const { readFileSync } = require('fs')
const { Client } = require('pg')

module.exports.loadQuery = queryName => {
  try {
    const templateFilePath = `queries/${queryName}.sql`
    console.log(`Loading ${templateFilePath}`)
    return readFileSync(`${templateFilePath}`, 'utf8')
  } catch (err) {
    throw new Error(`Error loading template: ${err.message}`)
  }
}

module.exports.runQuery = async (sql, reason) => {
  console.log(`Running query to ${reason}`)
  const client = new Client()
  await client.connect()
  try {
    return await client.query(sql)
  } catch (err) {
    throw new Error(`Error executing query: ${err.message}`)
  } finally {
    await client.end()
  }
}