const express = require('express')
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require("path");
var template = require("./lib/template")
var sanitizeHtml= require("sanitize-html")
const qs = require("qs");
const app = express()
const port = 3000
//routing
// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })

app.get('/', function (req,res){
    fs.readdir('./data', function(error, filelist){
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(filelist);
        var html = template.html(title, list, `<h2>${title}</h2>${description}`
        , `<a href="/create">create</a>`);
        res.send(html);
    })
})

app.get('/page/:pageId', (req, res) => {
    fs.readdir('./data', function(error, filelist){
       var filteredId = path.parse(req.params.pageId).base
       fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
           var title = req.params.pageId;
           var sanitizedTitle =  sanitizeHtml(title)
           var sanitizedDescription = sanitizeHtml(description, {
               allowedTags: [ 'h1' ],
               allowedAttributes: {
                   'a': [ 'href' ]
               },
               allowedIframeHostnames: ['www.youtube.com']
           });
           var list = template.list(filelist);
           var html = template.html(sanitizedTitle, list, `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
               `<a href="/create">create</a>
                       <a href="/update/${sanitizedTitle}">update</a>
                       <form action="/delete_process" method="post">
                       <input type="hidden" name="id" value="${sanitizedTitle}">
                       <input type="submit" value="delete">
                       </form>
                   `);
           res.send(html);
       });
            });

})

app.get('/create', (req, res) => {
    fs.readdir('./data', function(error, filelist){
        var title = 'WEB - Create';
        var list = template.list(filelist);
        var html = template.html(title, list, `
            <form action="/create_process" method="post">
              <p><input type="text" name="title" placeholder="title"></p>
                <p>
                    <textarea name="description" placeholder="description">

                    </textarea>
                </p>
                <p>
                    <input type="submit">
                </p>
            </form>
            `,'');
        res.send(html);
    })
})

app.post('/create_process', (req, res) => {
    var body = '';
    req.on('data', function(data){
        body += data;
    });
    req.on('end', function(){
        var post = qs.parse(body)
        var title = post.title
        var description = post.description
        fs.writeFile(`./data/${title}`,description,'utf8', function (err){
            res.writeHead(302, {Location: `/?id=${title}`});
            res.end();
        })
    })
})


app.get('/update/:pageId', (req, res) => {
    fs.readdir('./data', function(error, filelist) {
        var filteredId = path.parse(req.params.pageId).base
        fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
            var title = req.params.pageId;
            var list = template.list(filelist);
            var html = template.html(title, list, `

                <form action="/update_process" method="post">
                  <input type="hidden" name="id" value="${title}">
                  <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                    <p>
                        <textarea name="description" placeholder="description">
                        ${description}
                        </textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
                `,
                `<a href="/create">create</a> <a href="/update/${title}">update</a>`);
            res.send(html);
        });
    });
})

app.post('/update_process', (req, res) => {
    var body = '';
    req.on('data', function(data){
        body += data;
    });
    req.on('end', function(){
        var post = qs.parse(body)
        var id = post.id
        var title = post.title
        var description = post.description
        fs.rename(`./data/${id}`,`./data/${title}`,function (err){
            fs.writeFile(`./data/${title}`,description,'utf8', function (err){
                res.writeHead(302, {Location: `/?id=${title}`});
                res.end();
            })
        })
    })
})
app.post('/delete_process', (req, res) => {
    var body = '';
    req.on('data', function(data){
        body += data;
    });
    req.on('end', function(){
        var post = qs.parse(body)
        var id = post.id
        var filteredId = path.parse(id).base
        fs.unlink(`./data/${filteredId}`, function (error){
            res.writeHead(302, {Location: `/`});
            res.end();
        })
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


// var http = require('http');
// var fs = require('fs');
// var url = require('url');
// var qs = require('querystring')
// var path = require("path");
// var template = require("./lib/template")
// var sanitizeHtml= require("sanitize-html")
//
//
// var app = http.createServer(function(request,response){
//     var _url = request.url;
//     var queryData = url.parse(_url, true).query;
//     var pathname = url.parse(_url, true).pathname;
//     if(pathname === '/'){
//         if(queryData.id === undefined){
//         } else {
//         }
//     } else if(pathname === "/create") {
//
//     }
//     else if(pathname === "/create_process") {
//     }
//     else if(pathname === "/update") {
//
//         });
//     } else if(pathname === "/update_process") {
//
//         var body = '';
//         request.on('data', function(data){
//             body += data;
//         });
//         request.on('end', function(){
//             var post = qs.parse(body)
//             var id = post.id
//             var title = post.title
//             var description = post.description
//             fs.rename(`./data/${id}`,`./data/${title}`,function (err){
//                 fs.writeFile(`./data/${title}`,description,'utf8', function (err){
//                     response.writeHead(302, {Location: `/?id=${title}`});
//                     response.end();
//                 })
//             })
//         })
//     }
//     else if(pathname === "/delete_process") {
//         var body = '';
//         request.on('data', function(data){
//             body += data;
//         });
//         request.on('end', function(){
//             var post = qs.parse(body)
//             var id = post.id
//             var filteredId = path.parse(id).base
//             fs.unlink(`./data/${filteredId}`, function (error){
//                 response.writeHead(302, {Location: `/`});
//                 response.end();
//             })
//         })
//     }
//     else {
//         response.writeHead(404);
//         response.end('Not found');
//     }
// });
// app.listen(3000);