var http= require('http');
var cookie = require('cookie');

http.createServer(function(request,response) {
    console.log(request.headers.cookie)
    var cookies = {};
    if(request.headers.cookie !== undefined) {
        cookies = cookie.parse(request.headers.cookie)
    }
    console.log(cookies.yummy)
    response.writeHead(200, {
        "Set-Cookie" : [
            "yummy=choco",
            "tasty=good"
        ]
    })
    response.end('cookie')
}).listen(3000);