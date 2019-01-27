var express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')
var bodyParser = require('body-parser')
var router = require('./routes/api');
const port = 3000

var app = express()

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use('/api', router);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))