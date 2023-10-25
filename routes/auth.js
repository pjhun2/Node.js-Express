var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');
const auth = require("../lib/auth");
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
const shortid = require('shortid');

// router.post('/login_process', function (request, response) {
//     var post = request.body;
//     var email = post.email;
//     var password = post.pwd;
//     if(email === authData.email && password === authData.password){
//         request.session.is_logined = true;
//         request.session.nickname = authData.nickname;
//         request.session.save(function(){
//             response.redirect(`/`);
//         });
//     } else {
//         response.send('Who?');
//     }
// });



module.exports = function (passport) {


    router.get('/login', function (request, response) {
        var fmsg = request.flash();
        var feedback = '';
        if(fmsg.error) {
            feedback = fmsg.error[0];
        }
        var title = 'WEB - login';
        var list = template.list(request.list);
        var html = template.html(title, list, `
    <h1>Sign in</h1>
    <div style="color:red">${feedback}</div>
       <form action="/auth/login_process" method="post">
           <section>
               <label for="username">Username</label>
               <input id="username" name="username" type="text" autocomplete="username" required autofocus>
           </section>
           <section>
               <label for="current-password">Password</label>
               <input id="current-password" name="password" type="password" autocomplete="current-password" required>
           </section>
           <button type="submit">Sign in</button>
    </form>
  `, '');
        response.send(html);
    });

    router.post('/login_process', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        successFlash: true,
        failureFlash: true
    }));

    router.get('/logout', function(req, res, next) {
        req.logout(function(err) {
            if (err) { return next(err); }
            res.redirect('/');
        });
    });

    router.get('/register', function (request, response) {
        var fmsg = request.flash();
        var feedback = '';
        if(fmsg.error) {
            feedback = fmsg.error[0];
        }
        var title = 'WEB - login';
        var list = template.list(request.list);
        var html = template.html(title, list, `
      <style>
        form section {
          margin-top: 10px;
        }
        form button {
          margin-top: 10px;
        }
      </style>
    <h1>Sign Up</h1>
       <form action="/auth/register_process" method="post">
           <section>
               <label for="username">Username</label>
               <input id="username" name="username" type="text" autocomplete="username" value="ian@bemyfriends.com" required autofocus>
           </section>
           <section>
               <label for="current-password">Password</label>
               <input id="current-password" name="password" type="password" autocomplete="current-password" value="pw.1234" required>
           </section>
           <section>
               <label for="confirm-password">Confirm-Password</label>
               <input id="password2" name="password2" type="password" autocomplete="password2" value="pw.1234" required>
           </section>
           <section>
               <label for="displayName">DisplayName</label>
               <input id="displayName" name="displayName" type="text" autocomplete="displayName" value="ian" required autofocus>
           </section>
           <button type="submit">Sign in</button>
    </form>
  `, '');
        response.send(html);
    });

    router.post('/register_process', (req, res) => {
        var post = req.body
        var username = post.username
        var password = post.password
        var password2 = post.password2
        var displayName = post.displayName

        const result = db.get('users').find({ username: post.username }).value();

        if(result.username === username) {
            if(password !== password2) {
                req.flash('error', 'Password must same!')
                res.redirect('/auth/register')
            }
            req.flash('error', 'Email must same!')
            res.redirect('/auth/register')
        } else {
            db.get('users').push({
                id: shortid.generate(),
                username:username,
                password:password,
                displayName:displayName
            }).write();
            res.redirect('/')
        }

        res.end()

    })

    return router
}


// router.get('/logout', function (request, response) {
//     request.session.destroy(function(err){
//         response.redirect('/');
//     });
// });

