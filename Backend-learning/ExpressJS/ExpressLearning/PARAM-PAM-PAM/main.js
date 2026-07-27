const express = require('express');

const app = express();

app.put('/message/:id', (req, res) => {
    try{
        res.send(
            require('crypto')
            .createHash('sha1')
            .update(new Date().toDateString() + req.params.id)
            .digest('hex')
        );
    } catch (err) {
        res.status(500).send(`Internal Server Error: ${err.message}`);
    }
});

const PORT = process.argv[2] || 3000; // http://localhost:54567/message/0ecb216c0e125ac0b4d8bf802c33e95c
app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));