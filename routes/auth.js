var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');

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

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

// router.get('/logout', function (request, response) {
//     request.session.destroy(function(err){
//         response.redirect('/');
//     });
// });

module.exports = router;