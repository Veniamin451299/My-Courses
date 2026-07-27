
const fs = require('fs')
    const file = process.argv[2]
    
    fs.readFile(file, 'utf-8', function (err, contents) {
      if (err) {
        return console.log(err)
      }
      // также можно использовать fs.readFile(file, 'utf8', callback)
      const lines = contents.split('\n').length - 1
      console.log(lines)
    })