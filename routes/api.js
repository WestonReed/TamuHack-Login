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
    //req.session.last_update = String(new Date())
    res.send(req.session.username === undefined ? "not logged in" : req.session.username)
})

// Arguments: public_address
router.post('/nonce', (req, res) => {
    // Query for all users
    knex.select('*').from('users').then(users => {
        let found = false;
        for(let i = 0; i < users.length; i++) {
            // If user matches
            if(users[i]['pkey'].trim().toLowerCase() === req.body.public_address.trim().toLowerCase()) {
                // Set a flag
                found = true;
                // Update the database entry with a fresh nonce
                let my_nonce = eth.nonce() 
                knex('users').where('pkey', users[i]['pkey']).update('nonce', my_nonce).then(status => {
                    // Return the nonce
                    res.json({
                        status: 'success',
                        reason: 'public_key updated with a new nonce',
                        payload: {
                            nonce: my_nonce
                        }
                    })
                })
                break;
            }
        }
        if(!found) {
            // No record of public key, just make a new entry with the public key and a new nonce ¯\_(ツ)_/¯
            if(eth.isAddress(req.body.public_address)) {
                let my_nonce = eth.nonce()
                knex('users').insert({
                    pkey: req.body.public_address.trim(),
                    nonce: my_nonce
                }).then(status => {
                    res.json({
                        status: 'success',
                        reason: 'public_key updated with a new nonce',
                        payload: {
                            nonce: my_nonce
                        }
                    })
                })
            }
            else {
                res.status(400).json({
                    status: 'error',
                    reason: 'POST payload public_address is not a valid Ethereum address'
                });
            } 
        }
    })
})

// Arguments: public_address,signature
router.post('/verify', (req, res) => {
    // Query for all users
    knex.select('*').from('users').then(users => {
        let found = false;
        for(let i = 0; i < users.length; i++) {
            if(users[i]['pkey'].trim().toLowerCase() === req.body.public_address.trim().toLowerCase()) {
                found = true;
                // "estimated" because incorrect verifications just give the wrong address
                let estimated_address = eth.verify(users[i]['nonce'], req.body.signature)
                // Compare esimated and provided
                if(req.body.public_address.trim().toLowerCase() === estimated_address.trim().toLocaleLowerCase()) {
                    // Generate new nonce in database to prevent replay attacks
                    knex('users').where('pkey', users[i]['pkey']).update('nonce', eth.nonce()).then(status => {
                        // Signature was valid, mark session as logged_in
                        req.session.pkey = users[i]['pkey'];
                        req.session.logged_in = true;
                        res.json({
                            status: 'success',
                            reason: 'signature validated with serverside nonce'
                        })
                    })
                }
                else {
                    // Address mismatch
                    res.json({
                        status: 'failure',
                        reason: 'signature did not validate with serverside nonce'
                    })
                }
            }
        }
        if(!found) {
            res.status(400).json({
                status: 'error',
                reason: 'public_address has no serverside nonce, POST /nonce first'
            });
        }
    })
})

module.exports = router


process.on('unhandledRejection', r => console.error('unhandledRejection: ',r.stack,'\n',r));
