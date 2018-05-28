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
const queryHelper = (query) => {
  return new Promise((resolve, reject) => {
    return pool.query(query)
      .then(res => resolve(res.rows))
      .catch(e => reject(e))
  })
}



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


const findByUsername = (table, email) => {
  return queryUnique(`select exists(select\
     1 from users where email=('${email}'))`).then(res => {
    if (!res.exists) return false
    return queryUnique(`select * from users where email = '${email}'`)
      .then(user => user)
  }).catch(e => e.message)
}



const insertOne = (user) => {
  return queryHelper(`INSERT INTO users \
                    (email, password, \
                    first_name, last_name) VALUES \
                    ('${user.email}',\
                    '${user.password}', \
                    '${user.first_name}', \
                    '${user.last_name}') RETURNING *`)
         .then(users => users)
         .catch(e => {throw e})
}



module.exports = {
  queryHelper,
  queryUnique,
  insertOne,
  findByUsername
};