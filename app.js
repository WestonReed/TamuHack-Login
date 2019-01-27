var express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')
var router = require('./routes/api');
const port = 3000

var app = express()

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

app.use('/api', router);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))