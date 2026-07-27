const express = require('express');

const app = express();

const checkAdmin = (req, res, next) => {
    if (req.query.role === 'admin') {
        next();
    } else {
        res.status(403).send('Доступ запрещен')
    }
}

app.get('/secret', checkAdmin, (req, res) =>{
    try {
        res.send('Доступ разрешен');
    } catch (error) {
        res.status(500).send(`Internal Server Error: ${error.message}`);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));