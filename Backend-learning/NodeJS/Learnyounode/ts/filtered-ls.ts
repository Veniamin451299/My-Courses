import * as fs from 'fs';
import * as path from 'path';

const dirPath = process.argv[2];
const ext = '.' + process.argv[3];

const files = await fs.promises.readdir(dirPath, { withFileTypes: true });

const filteredFiles = files
    .filter(file => file.isFile() && path.extname(file.name) === ext)
    .map(file => file.name);

for(let file of filteredFiles) {
    console.log(file);
}