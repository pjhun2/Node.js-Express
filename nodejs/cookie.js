// var http= require('http');
// var cookie = require('cookie');
//
// http.createServer(function(request,response) {
//     console.log(request.headers.cookie)
//     var cookies = {};
//     if(request.headers.cookie !== undefined) {
//         cookies = cookie.parse(request.headers.cookie)
//     }
//     console.log(cookies.yummy)
//     response.writeHead(200, {
//         "Set-Cookie" : [
//             "yummy=choco",
//             "tasty=good",
//             `Permanent=cookie; Max-Age=${60*60*24*30}`,
//             'Secure=Secure; Secure',
//             'HttpOnly=HttpOnly; HttpOnly',
//             'Path=Path; Path=/cookie',
//             'Domain=Domain; Domain=o2.org'
//         ]
//     })
//     response.end('cookie')
// }).listen(3000);