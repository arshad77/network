const https = require('https');

https.get('https://dev97972.service-now.com/api/x_572191_itreq/sampleapi/test/2', (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
        data += chunk;
    });

    resp.on('end', () => {
        console.log(JSON.parse(data));
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});