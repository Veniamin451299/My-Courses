const net = require('net');

const PORT = process.argv[2];

const server = net.createServer((socket) => {
  const currentDate = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  const formattedDate = formatter.format(currentDate)
    .replace(/\./g, '-')
    .replace(',', '');
  socket.end(formattedDate + '\n');
});
server.listen(Number(PORT));

/***
 * РЕШЕНИЕ ОТ LEARNYOUNODE:
 * const net = require('net')
    
    function zeroFill (i) {
      return (i < 10 ? '0' : '') + i
    }
    
    function now () {
      const d = new Date()
      return d.getFullYear() + '-' +
        zeroFill(d.getMonth() + 1) + '-' +
        zeroFill(d.getDate()) + ' ' +
        zeroFill(d.getHours()) + ':' +
        zeroFill(d.getMinutes())
    }
    
    const server = net.createServer(function (socket) {
      socket.end(now() + '\n')
    })
    
    server.listen(Number(process.argv[2]))
 * */