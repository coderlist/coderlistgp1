require('dotenv').config();
const env = process.env.NODE_ENV;
const {Pool} = require('pg');

/** get env to set Pool configuration */
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


const getEnvConfig = () => {
  if (!config[env].user
    || !config[env].database){
      console.error(new Error
        ('check that postgres user or name is set').message);
      process.exit();
    }

  if(!process.env.COOKIE_SECRET){
    console.error(new Error
      ('check that session secret is set').message);
  }

  switch (env) {
    case 'test':
      return new Pool(config.test);
    case 'development':
      return new Pool(config.development);
    case 'production':
      return new Pool(config.production);

  }
}


module.exports = {getEnvConfig}