// const template = require("../lib/template");
// const express = require('express')
// const fs = require("fs");
// const cookie = require("cookie");
// const router = express.Router()
// var auth = require('../lib/auth');
//
// // function authIsOwner(req,res) {
// //     var isOwner = false;
// //     var cookies = {}
// //     if(req.headers.cookie){
// //         cookies = cookie.parse(req.headers.cookie)
// //     }
// //     if ( cookies.email === "ian@bemyfriends.com" && cookies.password === "pw.1234") {
// //         isOwner = true;
// //     }
// //     return isOwner
// // }
// // function authIsOwner(req,res) {
// //     if(req.session.is_logined) {
// //         return true
// //     } else {
// //         return false
// //     }
// // }
// //
// //
// // function authStatusUI(req,res) {
// //     var authStatusUI = '<a href="/login">login</a>'
// //     if(authIsOwner(req,res)) {
// //         authStatusUI = `${req.session.nickname} | <a href="/logout_process">logout</a>`
// //     }
// //     return authStatusUI
// // }
//
// router.get('/', function (request, response) {
//     var title = 'Welcome';
//     var description = 'Hello, Node.js';
//     var list = template.list(request.list);
//     var html = template.HTML(title, list,
//         `
//       <h2>${title}</h2>${description}
//       <img src="/images/hello.jpg" style="width:300px; display:block; margin-top:10px;">
//       `,
//         `<a href="/topic/create">create</a>`,
//         auth.statusUI(request, response)
//     );
//     response.send(html);
// });
//
// // router.get('/login', function (req,res){
// //     var title = 'Login';
// //     var list = template.list(req.list);
// //     var html = template.html(title, list, `
// //         <form action="/login_process" method="post">
// //         <p><input type="text" name="email" placeholder="email"></p>
// //         <p><input type="password" name="password" placeholder="password"></p>
// //         <p><input type="submit"></p>
// //         </form>
// //         `
// //         ,`<a href="/topic/create">create</a>`);
// //     res.send(html);
// // })
// //
// // router.post('/login_process', function (req,res){
// //     var post = req.body
// //     var email = post.email
// //     var password = post.password
// //     const username = email.split('@')[0]
// //     if ( email === "ian@bemyfriends.com" && password === "pw.1234") {
// //         res.writeHead(302, {
// //             'Set-Cookie' : [
// //                 `email=${email}`,
// //                 `password=${password}`,
// //                 `nickname=${username}`
// //             ],
// //             location: '/'
// //         })
// //         res.end();
// //     } else {
// //         res.end('Who ?');
// //     }
// //     res.end();
// // })
// //
// // router.get('/logout_process', function (req,res){
// //     var post = req.body
// //         res.writeHead(302, {
// //             'Set-Cookie' : [
// //                 `email=; Max-Age=0`,
// //                 `password=; Max-Age=0`,
// //                 `nickname=; Max-Age=0`
// //             ],
// //             location: '/'
// //         })
// //         res.end();
// // })
//
// module.exports = router;


var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
var auth = require('../lib/auth');

router.get('/', function (request, response) {
    var fmsg = request.flash();
    var feedback = '';
    if(fmsg.success) {
        feedback = fmsg.success[0];
    }
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(request.list);
    var html = template.html(title, list,
        `
      <div style="color:green">${feedback}</div>
      <h2>${title}</h2>${description}
      <img src="/images/hello.jpg" style="width:300px; display:block; margin-top:10px;">
      `,
        `<a href="/topic/create">create</a>`,
        auth.statusUI(request, response)
    );
    response.send(html);
});

module.exports = router;