const { execSync } = require('child_process')
const dayjs = require('dayjs')

const now = dayjs().format('YYYY-MM-DD HH:mm:ss')

try {
  const [, , commitTitle] = process.argv
  execSync(`git pull && git add . && git commit -m "${commitTitle || 'commit ' + now}" && git push`, {
    stdio: 'inherit'
  })
} catch (error) {
  console.log('error: ', error)
}
