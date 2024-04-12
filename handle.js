const path = require('path')
const fs = require('fs')

fs.readdir(
  path.resolve(__dirname, './src/data/songzi/json/'),
  'utf8',
  (err, names) => {
    console.log('err: ', err)
    console.log('names: ', names)
    const ret = []
    names.forEach(name => {
      const data = fs.readFileSync(
        path.resolve(__dirname, './src/data/songzi/json/' + name),
        'utf8'
      )
      ret.push({
        name,
        coordinates: JSON.parse(data)
      })
    })
    fs.writeFile(
      path.resolve(__dirname, './src/data/songzi/data.json'),
      JSON.stringify(ret, null, 2),
      error => {
        console.log('error', error)
      }
    )
  }
)
