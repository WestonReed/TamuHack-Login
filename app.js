var express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')
const port = 3000

var app = express()

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

var DB = {};

// app.use(function (req, res, next) {
//     if (!req.session.views) {
//         req.session.views = {}
//     }
//     // if(!req.session.last_update) {
//     //     req.session.last_update = "none"
//     // }

//     next()
// })

app.get('/', (req, res, next) => {
    //req.session.last_update = String(new Date())
    res.send(req.session.username === undefined ? "not logged in" : req.session.username)
})

app.get('/echo', (req, res) => {
    res.json(req.query)
})

app.get('/register', (req, res) => {
    req.session.username = req.query.username;
    res.send('logged in as ' + req.session.username)
})


app.get('/update', (req, res, next) => {
    req.session.last_update = String(new Date())
    res.send("updated")
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))