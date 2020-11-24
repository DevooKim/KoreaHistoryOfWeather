const http = require('http')

let timer = setInterval(async () => {
    http.get('http:localhost:8001/test//36.354687/127.420997', () => {
    })
    console.log("test");

}, 10000)

