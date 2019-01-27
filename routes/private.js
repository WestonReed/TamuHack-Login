const express = require('express');
const router = express.Router();
const eth = require('../lib/eth')
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
    if(req.session.logged_in !== true) {
        res.redirect('/')
    }
    else {
        console.log(req.session)
        knex.select('*').from('users').then(users => {
            for(let i = 0; i < users.length; i++) {
                if(users[i]['pkey'].trim().toLowerCase() === req.session.pkey.trim().toLowerCase()) {
                    res.json({
                        username: users[i]['username'],
                        balance: users[i]['balance'],
                        pkey: users[i]['pkey']
                    })
                }
            }
        })
        //res.send('<h1>youre logged in! this page is dynamically generated to provide you with personalized information only to you, like your on-file Ethereum identity: '+req.session.pkey+'</h1>')
    }
})


module.exports = router


process.on('unhandledRejection', r => console.error('unhandledRejection: ',r.stack,'\n',r));
