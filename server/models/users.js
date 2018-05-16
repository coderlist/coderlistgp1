const {
  queryHelper
} = require('../../helperFunctions/queryHelper');
const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * exports all pages database query functions
 * using queryHelper function
 */

module.exports = {
  /** creates a new user */
  createUser(user) {

    return bcrypt.hash(user.password, saltRounds)
      .then(hash => {
        const query = `INSERT INTO users (email,password, \
                      first_name,last_name) VALUES ('${user.email}', \
                      '${hash}','${user.first_name}','${user.last_name}')`
        return queryHelper(query)
      }).catch(e => {
        throw e
      })

  },

  /** send a list of all users */
  getAllUsers( ) {
    const query = `SELECT * FROM "user"`;
    return queryHelper(query)
      .then((data) => data)
      .catch(e => {
        throw e
      })
  }
}