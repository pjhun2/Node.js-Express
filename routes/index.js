const template = require("../lib/template");
const express = require('express')
const fs = require("fs");
const cookie = require("cookie");
const router = express.Router()

function authIsOwner(req,res) {
    var isOwner = false;
    var cookies = {}
    if(req.headers.cookie){
        cookies = cookie.parse(req.headers.cookie)
    }
    if ( cookies.email === "ian@bemyfriends.com" && cookies.password === "pw.1234") {
        isOwner = true;
    }
    return isOwner
}

function authStatusUI(req,res) {
    var authStatusUI = '<a href="/login">login</a>'
    if(authIsOwner(req,res)) {
        authStatusUI = '<a href="/logout_process">logout</a>'
    }
    return authStatusUI
}

router.get('/', function (req,res){
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(req.list);
    var html = template.html(title, list, `
        <h2>${title}</h2>${description}
        <img src="/images/hello.jpg" style="width:400px; display:block; margin-top:10px;">
        `
        , `<a href="/topic/create">create</a>`,authStatusUI(req,res));
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
    const username = email.split('@')[0]
    if ( email === "ian@bemyfriends.com" && password === "pw.1234") {
        res.writeHead(302, {
            'Set-Cookie' : [
                `email=${email}`,
                `password=${password}`,
                `nickname=${username}`
            ],
            location: '/'
        })
        res.end();
    } else {
        res.end('Who ?');
    }
    res.end();
})

router.get('/logout_process', function (req,res){
    var post = req.body
        res.writeHead(302, {
            'Set-Cookie' : [
                `email=; Max-Age=0`,
                `password=; Max-Age=0`,
                `nickname=; Max-Age=0`
            ],
            location: '/'
        })
        res.end();
})

module.exports = router
exports = {
    authStatusUI
}