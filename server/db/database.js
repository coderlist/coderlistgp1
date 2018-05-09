const {Pool} = require('pg');
const env = process.env.NODE_ENV === 'production';

const config = {
    "development":{
        user: 'phemite', //'PGUSER',      
        database: 'Test',//'PGDATABASE', 
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

// pool.on('error', (err, client) => {
//     console.error('Unexpected error on idle client', err)
//     process.exit(-1)
//   })

// const listQuery = `SELECT * FROM "User"`;
// pool.connect()
//     .then(client => {
//         return client.query(listQuery)
//                .then(res => {
//                    client.release();
//                    console.log(JSON.stringify(res.rows[0],undefined,2));
//                })
//     })
//     .catch(e => {
//        // client.release();
//         console.log(e.stack);
//     })



module.exports = {
    pool
}