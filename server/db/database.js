require('dotenv').config();
const env = process.env.NODE_ENV;
const fs = require('fs');
const {Pool} = require('pg');


const config = {
    "test": {
        user: process.env.PG_USER,
        database: process.env.PG_TEST_DBASE,
        password: process.env.PG_KEY,
        host: process.env.PG_HOST,
        port: process.env.PG_PORT,
        max: 10,
        idleTimeoutMillis: 30000,
    },
    "development": {
        user: process.env.PG_USER,
        database: process.env.PG_DBASE,
        password: process.env.PG_KEY,
        host: process.env.PG_HOST,
        port: process.env.PG_PORT,
        max: 10,
        idleTimeoutMillis: 30000,
    },

    "production": {
        user: process.env.PG_USER,
        database: process.env.PG_DBASE,
        password: process.env.PG_KEY,
        host: process.env.PG_HOST,
        port: process.env.PG_PORT,
        max: 10,
        idleTimeoutMillis: 30000,
    },
}

/** get env to set Pool configuration */

const getEnvConfig = () => {
    switch (env) {
        case 'test':
            return new Pool(config.test);
        case 'development':
            return new Pool(config.development);
        case 'production':
            return new Pool(config.production);

    }
}

const pool = getEnvConfig();

/**
 * create database tables with the sql init script
 * if it does not exist.
 */

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
})


fs.readFile('init.sql', 'utf-8', (err, data) => {
    if (err) {
        console.log('error reading sql file', err)
    }

    pool.connect()
        .then(client => {
            client.query(data)
                .then(res => {
                    client.release()
                    console.log('Database created or already exist')
                })
                .catch(e => {
                    client.release()
                    console.error(e.stack)
                })

        })

})

module.exports = {
    pool
}