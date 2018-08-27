const path = require('path')
const { writeFileSync } = require('fs')
const git = require('simple-git/promise')

module.exports.createReviewBranch = async (filePath, fileContents, repoPath, branch, message, shouldPush) => {
  try {
    const repo = await git(repoPath)
    await repo.checkout('master')
    await repo.pull()
    try {
      await repo.branch([ '-D', branch ])
    } catch (err) {}
    await repo.checkoutLocalBranch(branch)
    writeFileSync(path.join(repoPath, filePath), fileContents, { encoding: 'utf8' });
    await repo.add(filePath)
    await repo.commit(message)
    if (shouldPush) {
      await repo.push('origin', branch)
    }
  } catch (err) {
    throw new Error(`Could not creat review branch: ${err.message}`)
  }
}
