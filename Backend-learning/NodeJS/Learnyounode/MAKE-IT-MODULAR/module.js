const fs = require('fs');
const path = require('path');

function readFiles(dirPath, internalCallback) {
    fs.readdir(
        dirPath,
        { withFileTypes: true },
        function (err, files) {
            if (err) return internalCallback(err);
            internalCallback(null, files);
        }
    )
}

module.exports = function filteredFiles(dirPath, ext, callback) {
    readFiles(dirPath, function (err, data) {
        if (err) return callback(err);

        const extFiles = data.filter(
            file => file.isFile() 
            && path.extname(file.name) === `.${ext}`
        ).map(file => file.name);

        callback(null, extFiles);
    });
}