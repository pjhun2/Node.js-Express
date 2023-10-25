const express = require('express')
var fs = require('fs');
var bodyParser = require('body-parser')
var template = require("./lib/template")
const compression = require('compression')
const helmet = require('helmet')
const app = express()
const port = 3000
const path = require("path");
var session = require('express-session')
var flash = require('connect-flash');

//routing
// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })

app.use(helmet())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(compression())

var FileStore = require('session-file-store')(session);

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie : { secure : false, maxAge : (4 * 60 * 60 * 1000) },
    store: new FileStore(),
}));

// app.get('/flash', function(req, res){
//     // Set a flash message by passing the key, followed by the value, to req.flash().
//     req.flash('msg', 'Flash is back!!')
//     res.send('flash');
// });
//
// app.get('/flash-display', function(req, res){
//     // Get an array of flash messages by passing the key to req.flash()
//     var fmsg = req.flash()
//     console.log(fmsg)
//     res.send(fmsg);
// });


var passport = require('passport');
var LocalStrategy = require('passport-local');
app.use(passport.initialize());
app.use(passport.session())
app.use(flash());
passport.serializeUser(function(user, done) {
    done(null, user.username);
});

passport.deserializeUser(function(id, done) {
    done(null, authData);
});

var authData = {
    username: 'ian@bemyfriends.com',
    password: 'pw.1234',
    nickname: 'ian'
}



passport.use(new LocalStrategy(function verify(username, password, done) {
    if(username === authData.username){
        if(password === authData.password) {
            return done(null, authData)
        } else {
            return done(null, false, {
                message: 'Incorrect password.'
            })
        }
    } else {
        return done(null, false, {
            message: 'Incorrect username.'
        })
    }
}));


app.post('/auth/login_process', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    successFlash: true,
    failureFlash: true
}));

//get 방식으로 오는 요청에 대해서만 파일 리스트를 가져오는거고 , POST는 처리되지않음
app.get('*',function (req,res,next){
    fs.readdir('./data', function(error, filelist) {
        req.list = filelist
        next()
    })
})


const topicRouter = require('./routes/topic')
const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth')

app.use('/', indexRouter)
app.use('/topic', topicRouter)
app.use('/auth', authRouter)

app.use(function (req, res, next){
    res.status(404).send('sorry')
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
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