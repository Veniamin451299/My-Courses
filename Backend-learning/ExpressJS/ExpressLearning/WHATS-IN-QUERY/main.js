const express = require('express');

const app = express();

app.get('/search', (req, res) => {
    try {
        res.send(req.query);
    } catch (err) {
        res.status(500).send(`Internal Server Error: ${err.message}`);
    }
});

const PORT = process.argv[2] || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));