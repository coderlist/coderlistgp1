require('dotenv').config();
const {Pool} = require('pg');
const env = process.env.NODE_ENV === 'production';


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
        "use_env_variable": process.env.DATABASE_URL
    }
}

const pool =   env ? new Pool(config.production): new Pool(config.development) ;


module.exports = {
    pool
}