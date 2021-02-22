function run() {
    var requestBody = "{\"errorindex\":\"0\",\"errorstatus\":\"fail\",\"id\":\"2133861152\",\"variablebindings\":\"[1.3.6.1.2.1.1.3.0 = 0:00:00.10, 1.3.6.1.6.3.1.1.4.1.0 = 1.3.6.1.4.1.12028.4.15.0.25, 1.3.6.1.4.1.12028.4.15.1.101 = 2, 1.3.6.1.4.1.12028.4.15.1.102 = 4, 1.3.6.1.4.1.12028.4.104 = 221.135.104.20, 1.3.6.1.4.1.12028.4.15.1.103 = Device: b4:5d:50:ca:65:a2 (221-135-104-20.sify.net) - https://172.29.22.130/ap_monitoring?id=280:Percent Memory Utilization >= 80% for 5 minutes. Notes: MEMORY UTILIZATION THRESHOLD ALERT.; 1.3.6.1.4.1.12028.4.104 = 221.135.104.20; 1.3.6.1.4.1.12028.4.117 = Top > TEST]\"}";

    var client = new XMLHttpRequest();
    client.open("post", "https://dev97972.service-now.com/api/now/table/x_572191_itreq_trap");

    client.setRequestHeader('Accept', 'application/json');
    client.setRequestHeader('Content-Type', 'application/json');

    //Eg. UserName="admin", Password="admin" for this code sample.
    client.setRequestHeader('Authorization', 'Basic ' + btoa('admin' + ':' + 'jt3HVxgdZHZ8'));

    client.send(requestBody);
}
// const https = require('https')

// const data = "{\"errorindex\":\"0\",\"errorstatus\":\"Success\",\"id\":\"2133861152\",\"variablebindings\":\"[1.3.6.1.2.1.1.3.0 = 0:00:00.10, 1.3.6.1.6.3.1.1.4.1.0 = 1.3.6.1.4.1.12028.4.15.0.25, 1.3.6.1.4.1.12028.4.15.1.101 = 2, 1.3.6.1.4.1.12028.4.15.1.102 = 4, 1.3.6.1.4.1.12028.4.104 = 221.135.104.20, 1.3.6.1.4.1.12028.4.15.1.103 = Device: b4:5d:50:ca:65:a2 (221-135-104-20.sify.net) - https://172.29.22.130/ap_monitoring?id=280:Percent Memory Utilization >= 80% for 5 minutes. Notes: MEMORY UTILIZATION THRESHOLD ALERT.; 1.3.6.1.4.1.12028.4.104 = 221.135.104.20; 1.3.6.1.4.1.12028.4.117 = Top > TEST]\"}";


// const options = {
//     hostname: 'https://dev97972.service-now.com',
//     port: 443,
//     path: '//api/now/table/x_572191_itreq_trap',
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//         'Authorization': 'Basic ' + btoa('admin' + ':' + 'NSGoal@123')
//     }
// }

// const req = https.request(options, res => {
//     console.log(`statusCode: ${res.statusCode}`)

//     res.on('data', d => {
//         process.stdout.write(d)
//     })
// })

// req.on('error', error => {
//     console.error(error)
// })

// req.write(data)
// req.end()