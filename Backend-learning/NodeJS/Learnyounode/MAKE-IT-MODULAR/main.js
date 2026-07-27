const fileFilter = require('./module');

fileFilter(process.argv[2], 
    process.argv[3],
    function (err, extFiles) {
        if (err) {
            console.error(err);
        } else {
            for (const file of extFiles) {
                console.log(file);
            }
        }
    }
)