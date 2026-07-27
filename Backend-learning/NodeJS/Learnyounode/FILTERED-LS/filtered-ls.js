const fs = require('fs');
const path = require('path');

function filteredFiles(dirName, ext) {
    fs.readdir(
        dirName, 
        { withFileTypes: true }, 
        function callback(err, list) {
            if (err) {
                return console.error(err); // останавливаем выполнение при ошибке
            }
            const txtFiles = list.filter(
                file => file.isFile() && path.extname(file.name) === `.${ext}`
            ).map(file => file.name);
            
            for(const file of txtFiles) {
                console.log(file);
            }
        }
    );
}

filteredFiles(process.argv[2], process.argv[3]);