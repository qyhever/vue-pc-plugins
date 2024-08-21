const { execSync } = require('child_process')

try {
  const [, , commitTitle] = process.argv
  execSync(`git pull && git add . && git commit -m "${commitTitle || 'update'}" && git push`, {
    stdio: 'inherit'
  })
} catch (error) {
  console.log('error: ', error)
}
