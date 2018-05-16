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
  createUser(email, password, first_name, last_name) {

    return bcrypt.hash(password, saltRounds)
      .then(hash => {
        const query = `INSERT INTO users (email,password, \
                      first_name,last_name) VALUES ('${email}', \
                      '${hash}','${first_name}','${last_name}')`
        return queryHelper(query)
      }).catch(e => {
        throw e
      })

  },

  /** send a list of all users */
  getAllUsers(req, res) {
    const query = `SELECT * FROM "user"`;
    return queryHelper(query)
      .then((data) => data)
      .catch(e => {
        throw e
      })
  }
}