const {pool} = require('../../server/db/database');



/**
 * @param  {} query
 * @param  {} values
 * @param  {} table
 *
 * 
 * functions to perform various DB operations
 * 
 * please test function for appropriate response 
 * before use
 * 
 */
/**
 * @param  {String} query
 * returns a result from query input
 */
const queryHelper = (query) => {
  return new Promise((resolve, reject) => {
    return pool.query(query)
      .then(res => resolve(res.rows))
      .catch(e => reject(e))
  })
}


/**
 * @param  {} query
 * returns a single row from query input
 */
const queryUnique = (query) => {
  return queryHelper(query)
    .then(rows => {
      if (rows.length === 0) {
        return Promise.reject(new Error('not found'));
      }
      return rows[0];
    })
    .catch(e => e.message);
}

/**
 * @param  {String} table
 * @param  {String} email
 * returns a user that matches 
 * the email
 */
const findByUsername = (table, email) => {
  return queryUnique(`SELECT EXISTS(SELECT\
     1 FROM users WHERE email=('${email}'))`).then(res => {
    if (!res.exists) return false
    return queryUnique(`SELECT * FROM users WHERE email = '${email}'`)
      .then(user => user)
  }).catch(e => e.message)
}


/**
 * @param  {Object} user
 * insert object value into users
 * returns a row
 */
const insertOne = (user) => {
  return queryHelper(`INSERT INTO users \
                    (email,first_name, \
                    last_name, activation_token) VALUES \
                    ('${user.email}',\
                    '${user.first_name}', \
                    '${user.last_name}', \
                    '${user.activation_token}') RETURNING *`)
         .then(users => users)
         .catch(e => {throw e})
}

/**
 * @param  {Object} anyObj
 * @param  {} table SQL table
 * insert object values into table 
 * returning the row
 */

const insertInTable = (anyObj,table) => {
 const concatKeys = [];
 const keysArray = Object.keys(anyObj);
 const valsArray = Object.values(anyObj);
 let i=0;
 
 while(i < Object.keys(anyObj).length){
    i++;
    concatKeys.push(keysArray.shift())
 }
 const query = `INSERT INTO ${table} (${concatKeys})` +
                ` VALUES (${valsArray.map(val => `'${val}'`)}) RETURNING *`;
    return queryHelper(query)
     .then(users => users)
     .catch(e => {throw e}) 
}


module.exports = {
  queryHelper,
  queryUnique,
  insertOne,
  findByUsername,
  insertInTable
};