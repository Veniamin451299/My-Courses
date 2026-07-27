const express = require('express');

const app = express();
app.get('/home', (req, res) => {
    try {
        res.send('Hello World!');
    } catch (err) {
        res.status(500).send(`Internal Server Error: ${err.message}`);
    }
}).listen(Number(process.argv[2]));