const template = require("../lib/template");
const fs = require("fs");
const path = require("path");
const sanitizeHtml = require("sanitize-html");
const express = require('express')
const cookie = require("cookie");
const {response} = require("express");
var auth = require('../lib/auth')
const router = express.Router()
var db = require('../lib/db')
var shortid = require('shortid')

// function authIsOwner(req,res) {
//     var isOwner = false;
//     var cookies = {}
//     if(req.headers.cookie){
//         cookies = cookie.parse(req.headers.cookie)
//     }
//     if ( cookies.email === "ian@bemyfriends.com" && cookies.password === "pw.1234") {
//         isOwner = true;
//     }
//     return isOwner
// }
//
// function authStatusUI(req,res) {
//     var authStatusUI = '<a href="/login">login</a>'
//     if(authIsOwner(req,res)) {
//         authStatusUI = '<a href="/logout_process">logout</a>'
//     }
//     return authStatusUI
// }
router.get('/create', (req, res) => {
    if (!auth.isOwner(req, res)) {
        res.redirect('/')
        return false
    }
    var title = 'WEB - Create';
    var list = template.list(req.list);
    var html = template.html(title, list, `
            <form action="/topic/create_process" method="post">
              <p><input type="text" name="title" placeholder="title"></p>
                <p>
                    <textarea name="description" placeholder="description">

                    </textarea>
                </p>
                <p>
                    <input type="submit">
                </p>
            </form>
            `, '', auth.statusUI(req, res));
    res.send(html);
})

router.post('/create_process', (req, res) => {
    if (!auth.isOwner(req, res)) {
        res.redirect('/')
        return false
    }
    var post = req.body
    var title = post.title
    var description = post.description
    var id = shortid.generate()
    db.get('topics').push({
        id: id,
        title: title,
        description: description,
        user_id: req.user.id
    }).write();
    res.redirect(`/topic/${id}`)
    // fs.writeFile(`./data/${title}`,description,'utf8', function (err) {
    //     res.writeHead(302, {Location: `/topic/${title}`});
    //     res.end();
    // });
})

router.get('/update/:pageId', (req, res) => {
    if (!auth.isOwner(req, res)) {
        res.redirect('/')
        return false
    }
    var topic = db.get('topics').find({id: req.params.pageId}).value();
    if(topic.user_id !== req.user.id) {
        req.flash('error', '수정 권한이 없습니다.');
        return res.redirect('/')
    }
    var title = topic.title
    var description = topic.description
    var list = template.list(req.list);
    var html = template.html(title, list, `

                <form action="/topic/update_process" method="post">
                  <input type="hidden" name="id" value="${topic.id}">
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
        `<a href="/topic/create">create</a> <a href="/topic/update/${topic.id}">update</a>`, auth.statusUI(req, res));
    res.send(html);
})

router.post('/update_process', (req, res) => {
    if (!auth.isOwner(req, res)) {
        res.redirect('/')
        return false
    }

    var post = req.body
    var id = post.id
    var title = post.title
    var description = post.description
    var topic = db.get('topics').find({id:id}).value()
    if(topic.user_id !== req.user.id) {
        req.flash('error', '수정 권한이 없습니다.');
        return res.redirect('/')
    }

    db.get('topics').find({id:id}).assign({
        title:title,
        description:description
    }).write()
    res.redirect(`/topic/${topic.id}`);
    // fs.rename(`./data/${id}`, `./data/${title}`, function (err) {
    //     fs.writeFile(`./data/${title}`, description, 'utf8', function (err) {
    //         res.writeHead(302, {Location: `/topic/${title}`});
    //         res.end();
    //     })
    // })
})

router.post('/delete_process', (req, res) => {
    if (!auth.isOwner(req, res)) {
        res.redirect('/')
        return false
    }
    var post = req.body
    var id = post.id
    var topic = db.get('topics').find({id:id}).value();
    if(topic.user_id !== req.user.id) {
        req.flash('error', '삭제 권한이 없습니다.');
        return res.redirect('/')
    }

    db.get('topics').remove({id:id}).write()
    res.redirect('/')

    // fs.unlink(`./data/${filteredId}`, function (error) {
    //     res.writeHead(302, {Location: `/`});
    //     res.end();
    // })
})
router.get('/:pageId', (req, res, next) => {

    var topic = db.get('topics').find({id: req.params.pageId}).value()
    var title = topic.title;
    var description = topic.description
    var user = db.get('users').find({id: topic.user_id}).value()
    var sanitizedTitle = sanitizeHtml(title)
    var sanitizedDescription = sanitizeHtml(description, {
        allowedTags: ['h1'],
        allowedAttributes: {
            'a': ['href']
        },
        allowedIframeHostnames: ['www.youtube.com']
    });
    var list = template.list(req.list);
    var html = template.html(sanitizedTitle, list, `

        <h2>${sanitizedTitle}</h2>${sanitizedDescription}
        <p>by ${user.displayName}</p>
        `,
        `<a href="/topic/create">create</a>
               <a href="/topic/update/${topic.id}">update</a>
               <form action="/topic/delete_process" method="post">
               <input type="hidden" name="id" value="${topic.id}">
               <input type="submit" value="delete">
               </form>
           `, auth.statusUI(req, res));
    res.send(html);

})

module.exports = router