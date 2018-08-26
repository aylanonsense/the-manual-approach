module.exports.formatAsTable = tabularData => {
  const maxColumnLengths = tabularData[0].map((x, col) => {
    return tabularData.reduce((maxLength, row) => Math.max(maxLength, `${row[col]}`.length), 0)
  })
  return tabularData.map(row => {
    return row.map((cell, col) => `${cell}`.padEnd(maxColumnLengths[col])).join('  ')
  })
}
