require('dotenv').config();
const url = require('url');
const env = process.env.NODE_ENV === 'production';
const {Pool} = require('pg');



const params = url.parse(process.env.DATABASE_URL)
const auth = params.auth.split(':');
const config = {
    "development":{
        user: process.env.PG_USER,      
        database: process.env.PG_DBASE, 
        password: process.env.PG_KEY,      
        host: process.env.PG_HOST,     
        port: process.env.PG_PORT,            
        max: 10, 
        idleTimeoutMillis: 30000, 
    },

    "production":{
        user: auth[0],
        password:auth[1],
        host: params.hostname,
        port: params.port,
        database: params.pathname.split('/')[1],
        ssl: true
    }
}

const pool =   env ? new Pool(config.production): new Pool(config.development) ;


module.exports = {
    pool
}