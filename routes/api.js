var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var session = require('express-session');

router.get('/', (req, res, next) => {
    //req.session.last_update = String(new Date())
    res.send(req.session.username === undefined ? "not logged in" : req.session.username)
})

router.get('/echo', (req, res) => {
    res.json(req.query)
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
