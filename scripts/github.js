const path = require('path')
const { writeFileSync } = require('fs')
const git = require('simple-git/promise')

module.exports.createReviewBranch = async (repoPath, filePath, fileContents, branch, message) => {
  console.log('Creating a review branch')
  const repo = await git(repoPath)
  await repo.checkout('master')
  try {
    await repo.branch([ '-D', branch ])
  } catch (err) {}
  await repo.pull()
  await repo.checkoutLocalBranch(branch)
  writeFileSync(path.join(repoPath, filePath), fileContents, { encoding: 'utf8' }); 
  await repo.add(filePath)
  await repo.commit(message)
  // TODO push to origin
}