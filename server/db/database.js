const {Pool} = require('pg');
const env = process.env.NODE_ENV === 'production';

const config = {
    "development":{
        user: 'postgres',      //PGUSER
        database: 'coderlist', //PGDATABASE
        password: 'root',      //PGPASSWORD
        host: 'localhost',     //Server
        port: 5433,            //PGPORT
        max: 10, 
        idleTimeoutMillis: 30000, 
    },

    "production":{
        "use_env_variable": process.env.DATABASE_URL
    }
}

const pool =   env ? new Pool(config.production): new Pool(config.development) ;

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })

const listQuery = `SELECT * FROM "Users"`;
pool.connect()
    .then(client => {
        return client.query(listQuery)
               .then(result => {
                   client.release();
                   res.status(200).send({
                      message : "users successfully listed",
                      response: result.rows
                   })
               
               })
    })
    .catch(e => {
        res.status(400).send(e.stack)
    })



module.exports = {
    pool
}