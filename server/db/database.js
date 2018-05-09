const {Pool} = require('pg');
const env = process.env.NODE_ENV === 'production';

const config = {
    "development":{
        user: 'PGUSER',      
        database: 'PGDATABASE', 
        password: '',      
        host: 'localhost',     
        port: 5432,            
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