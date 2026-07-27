const express = require('express');
const fs = require('fs');

const app = express();

app.get('/books', (req, res) => {
    try {
        fs.readFile(process.argv[3], (err, data) => {
            if (err) return res.sendStatus(500);
            res.json(JSON.parse(data));
        });
    } catch (err) {
        res.status(500).send(`Internal Server Error: ${err.message}`);
    }
});

const PORT = process.argv[2] || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));