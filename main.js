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
    store: new FileStore(),
}));

//
// app.use(session({
//     httpOnly: true, // session에 cookie를 넣어 공격하는 기법을 방지하기 위함
//     secret: 'mysecret',
//     resave: false,
//     saveUninitialized: false,
//     store: new FileStore(),
// }));



var passport = require('passport');
var LocalStrategy = require('passport-local');

passport.serializeUser(function(user, done) {
    done(null, user.username);
});

passport.deserializeUser(function(user, done) {
    console.log('deserialize');
    done(null, user);
});

var authData = {
    username: 'ian@bemyfriends.com',
    password: 'pw.1234',
    nickname: 'ian'
}

app.post('/auth/login_process', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login'
}));

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