const template = require("../lib/template");
const express = require('express')
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

module.exports = router