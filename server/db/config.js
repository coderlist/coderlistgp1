require('dotenv').config();
const env = process.env.NODE_ENV;
const {Pool} = require('pg');

/**
 * For Development uses only: 
 * PG_USER = Your database username;
 * PG_KEY = Your database key;
 * PG_DATABASE = Your database name. // lowercase only
 */
PG_USER = "renkinjutsushi";
PG_KEY = "mrparker";
PG_DATABASE = "ginny_bradley_development";
/**
 * dotenv gets necessary variable names
 * 
 */
const config = {
  "test": {
    user: process.env.PG_USER,
    database: `GINNY_BRADLEY_TEST`,
    password: process.env.PG_KEY,
    host: process.env.PG_HOST||"localhost",
    port: process.env.PG_PORT||5432,
    idleTimeoutMillis: 30000,
  },
  "development": {
    user: process.env.PG_USER || PG_USER,
    database: process.env.PG_DBASE || PG_DATABASE,
    password: process.env.PG_KEY || PG_KEY,
    host: process.env.PG_HOST||"localhost",
    port: process.env.PG_PORT||5432,
    max: 10,
    idleTimeoutMillis: 30000,
  },

  "production": {
    user: process.env.PG_USER,
    database: `GINNY_BRADLEY_PRODUCTION`,
    password: process.env.PG_KEY,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT||5432,
    max: 10,
    idleTimeoutMillis: 30000,
  },
}


const getEnvConfig = () => {
  if (!config[env].user){
      console.error(new Error
        ('check that postgres user set').message);
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