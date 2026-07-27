const express = require('express');
const path = require('path');

const app = express();

const publicPath = process.argv[3] || path.join(__dirname, 'public');

app.use(require('stylus').middleware(publicPath));
app.use(express.static(publicPath));

const PORT = process.argv[2] || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));