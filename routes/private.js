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
    }
})


module.exports = router


process.on('unhandledRejection', r => console.error('unhandledRejection: ',r.stack,'\n',r));
