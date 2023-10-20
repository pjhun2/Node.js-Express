const template = require("../lib/template");
const express = require('express')
const fs = require("fs");
const router = express.Router()
router.get('/', function (req,res){
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(req.list);
    var html = template.html(title, list, `
        <h2>${title}</h2>${description}
        <img src="/images/hello.jpg" style="width:400px; display:block; margin-top:10px;">
        `
        , `<a href="/topic/create">create</a>`);
    res.send(html);
})

router.get('/login', function (req,res){
    var title = 'Login';
    var list = template.list(req.list);
    var html = template.html(title, list, `
        <form action="/login_process" method="post">
        <p><input type="text" name="email" placeholder="email"></p>
        <p><input type="password" name="password" placeholder="password"></p>
        <p><input type="submit"></p>
        </form>
        `
        ,`<a href="/topic/create">create</a>`);
    res.send(html);
})

router.post('/login_process', function (req,res){
    var post = req.body
    var email = post.email
    var password = post.password
    if ( email === "ian@bemyfriends.com" && password === "pw.1234") {
        res.writeHead(302, {
            'Set-Cookie' : [
                `email=${email}`,
                `password=${password}`,
                `nickname=ian`
            ],
            location: '/'
        })
        res.end();
    } else {
        res.end('Who ?');
    }
    res.end();
})

module.exports = router