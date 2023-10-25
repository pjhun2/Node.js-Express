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
var db = require('./lib/db')

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

var passport = require('./lib/passport')(app)

//get 방식으로 오는 요청에 대해서만 파일 리스트를 가져오는거고 , POST는 처리되지않음
app.get('*',function (req,res,next){

    req.list = db.get('topics').value()
    next()
})


const topicRouter = require('./routes/topic')
const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth')(passport)

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