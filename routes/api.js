const otplib = require('otplib')

var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var session = require('express-session');
const sha256 = require('simple-sha256')
require('dotenv').config()
var knex = require('knex')({
    client: 'mysql',
    connection: {
        host : process.env.DB_HOST,
        user : process.env.DB_USER,
        password : process.env.DB_PASS,
        database : process.env.DB_NAME
    }
});

router.get('/', (req, res, next) => {
    //req.session.last_update = String(new Date())
    res.send(req.session.username === undefined ? "not logged in" : req.session.username)
})

router.get('/echo', (req, res) => {
    res.json(req.session)
})

router.post('/login', (req, res) => {
    console.log(req.body)
    if(req.body.username && typeof req.body.username === 'string' && req.body.password && typeof req.body.password === 'string') {
        knex.select('*').from('users').then(users => {
            for(let i = 0; i < users.length; i++) {
                if(req.body.username.trim() === users[i]['username'].trim()) {
                    if(sha256.sync(req.body.password) === users[i]['password']) {
                        console.log('login good')
                        req.session.username = users[i]['username']
                        req.session.logged_in = true
                        res.json('login good')
                    }
                }
            }
        })
    }
    else {
        res.json("login bad")
    }
})

router.get('/register', (req, res) => {
    req.session.username = req.query.username;
    res.send('logged in as ' + req.session.username)
})

router.get('/update', (req, res, next) => {
    req.session.last_update = String(new Date())
    res.send("updated")
})

module.exports = router


process.on('unhandledRejection', r => console.error('unhandledRejection: ',r.stack,'\n',r));
