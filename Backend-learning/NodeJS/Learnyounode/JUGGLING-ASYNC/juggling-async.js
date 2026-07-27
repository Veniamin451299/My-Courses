const http = require('http');

function httpGet(url) {
    return new Promise ((resolve, reject) => {
        http.get(url, res => {
            const chunks = [];

            res.on('data', chunk => {
                chunks.push(chunk);
            });

            res.on('end', () => {
                const data = Buffer.concat(chunks).toString();
                resolve(data);
            });

            res.on('error', (e) => {
                reject(e);
            });
        
        }).on('error', (e) => {
            reject(e);
        });
    });
}

async function main() {
    const req = [process.argv[2], process.argv[3], process.argv[4]];

    try{
        for(let url of req) {
           const result = await httpGet(url);
           console.log(result);
        } 
    } catch (error) {
        console.error('Error: ', error.message);
    }
}

main();