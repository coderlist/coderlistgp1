const {getEnvConfig}  = require('./config')
const fs = require('fs');



const pool = getEnvConfig();



/**
 * create database tables with the sql init script
 * if it does not exist.
 */

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(0);
});


fs.readFile('init.sql', 'utf-8', (err, data) => {
  if (err) {
    console.error('error reading sql file', err);
  }

  pool.connect()
    .then(client => {
      return client.query(data)
        .then(res => {
          client.release();
          console.log('DATABASE CONNECTED');
        });
    }).catch(e => {
      console.error('ERROR: ', e.stack)
      process.exit();
    });

});


module.exports = {
  pool
};