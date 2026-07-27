const fs = require('fs');
const path = process.argv[2];
const buf = fs.readFileSync(path);
const text = buf.toString().split("\n");
const count = text.length - 1;
console.log(count);