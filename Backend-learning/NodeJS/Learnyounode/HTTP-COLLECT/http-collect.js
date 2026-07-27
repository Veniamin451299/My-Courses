const http = require('http');

const req = process.argv[2] || '';
let dataContainer = [];

http.get(req, res => {
  res.setEncoding('utf8');
  res.on('data', function(data){
    dataContainer.push(data);
  });
  res.on('end', function() {
    let result = dataContainer.join('');
    console.log(result.length);
    console.log(result.toString());
  });
  res.on('error', function(e) {
    console.error('Got error in response: ', e.message)
  });
}).on('error', function(e){
  console.error("Got error in request: ", e.message);
});



/*** РЕШЕНИЕ С ИСПОЛЬЗОВАНИЕМ БИБЛИОТЕКИ BL
 * 
    const http = require('http')
    const bl = require('bl')
    
    http.get(process.argv[2], function (response) {
      response.pipe(bl(function (err, data) {
        if (err) {
          return console.error(err)
        }
        data = data.toString()
        console.log(data.length)
        console.log(data)
      }))
    })***/