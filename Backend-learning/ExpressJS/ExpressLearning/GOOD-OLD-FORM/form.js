const express = require('express');

const app = express();

app.use(express.urlencoded({extended: false}));
app.post('/form', (req, res) => {
    try {
        res.send(`${req.body.str.split('').reverse().join('')}`);
    } catch(e) {
        res.status(500).send(`Internal Server Error: ${e.message}`);
    }
});

app.listen(process.argv[2]);