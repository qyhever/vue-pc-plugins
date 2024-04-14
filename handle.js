const path = require('path')
const fs = require('fs')

const jsonData = fs.readFileSync(
  path.resolve(__dirname, './src/data/gongan/geo.json'),
  'utf8'
)
const obj = JSON.parse(jsonData)
const ret = []
obj.features.forEach(item => {
  const name = item.properties.name
  const coordinates = item.geometry.coordinates
  ret.push({
    name,
    coordinates
  })
})
fs.writeFile(
  path.resolve(__dirname, './src/data/gongan/data.json'),
  JSON.stringify(ret, null, 2),
  error => {
    console.log('error', error)
  }
)

// fs.readdir(
//   path.resolve(__dirname, './src/data/gongan/json/'),
//   'utf8',
//   (err, names) => {
//     console.log('err: ', err)
//     console.log('names: ', names)
//     const ret = []
//     names.forEach(name => {
//       const data = fs.readFileSync(
//         path.resolve(__dirname, './src/data/gongan/json/' + name),
//         'utf8'
//       )
//       ret.push({
//         name,
//         coordinates: JSON.parse(data)
//       })
//     })
//     fs.writeFile(
//       path.resolve(__dirname, './src/data/gongan/data.json'),
//       JSON.stringify(ret, null, 2),
//       error => {
//         console.log('error', error)
//       }
//     )
//   }
// )
