require('dotenv').config()
//console.log(process.env)
var knex = require('knex')({
    client: 'mysql',
    connection: {
        host : process.env.DB_HOST,
        user : process.env.DB_USER,
        password : process.env.DB_PASS,
        database : process.env.DB_NAME
    }
});

knex.select('*').from('users').then(users => {
    for(let i = 0; i < users.length; i++) {
        console.log(users[i]['username'])
    }
})