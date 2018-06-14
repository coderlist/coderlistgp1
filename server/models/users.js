const bcrypt = require('bcrypt');
const saltrounds = 10;
const {
  verifyPassword
} = require('../../auth/verify');
const {
  insertOne,
  findByUsername,
  queryHelper,
  insertInTable
} = require('../../helperFunctions/query/queryHelper');

/** all functions return a Promise */

const user = {

  createUser(user) {
    return insertOne(user).then(result => {
      return true
    }).catch(e => {
      throw e
    })
  },

  /**
   * @param  {int} rowsLimit
   * list all using listing first 'rowsLimit' rows
   */
  //starting with (rowStart + 1) row, 
  // list (n) rows 
  listUsers(rowStart, n) {
    return queryHelper(`SELECT email,fist_name,last_name,creation_date FROM users ORDER BY 
    creation_date  FETCH FIRST ${n} ROWS ONLY OFFSET ${rowStart};`)
      .then(response => response)
      .catch(e => {
        throw e
      })
  },

  /**
   * 
   * @param {Object} user 
   * gets token from route in a temporary user object
   * and compare with token on db where email === email 
   * on success, changes activated to true.
   * It return a Promise.
   */
  verifyUser(user) {
    return findByUsername('users', user.email).then(dbUser => {
      if (user.activation_token === dbUser.activation_token) {
        return bcrypt.hash(user.password, saltrounds)
          .then(hash => {
            return queryHelper(
              `UPDATE users SET password = '${hash}',` +
              `activation_token = null, verified = true ` + //activation token set to null
              `WHERE email ='${dbUser.email}';
           `).then(user => {
              return true
            })
          })
      } else {
        console.log('WRONG TOKEN')
        return false;
        //Promise.reject();
      }
    }).catch(e => {
      throw e
    })
  },

  /**
   * @param  {Object} user
   * this takes a user object and
   * returns an object with last_login
   * and failed login attempts. It returns
   * Promise. The response is an array of a single 
   * object [{}]
   */
  getNumberOfFailedLogins(user) {
    return queryHelper(`SELECT failed_login_attempts,` +
        `last_failed_login FROM users WHERE` +
        ` email = '${user.email}'`)
      .then(response => response)
      .catch(e => e)
  },

  /**
   * @param  {Object} user
   * This takes an object and returns a boolean
   * when the update is done or a db error message 
   * on failure
   */
  resetFailedLogins(user) {
    return queryHelper(`UPDATE users` +
        `SET failed_login_attempts = 0` +
        `WHERE email ='${user.email}';`)
      .then(result => true)
      .catch(e => {
        throw e
      })
  },


  /**
   * @param  {Object} user
   * accepts a user object and increment 
   * user failed_login_attempts by 1.
   * returns true on success and a db error
   * on failure
   * return a Promise 
   */
  addOneToFailedLogins(user) {
    return queryHelper(`UPDATE users SET failed_login_attempts =` +
        ` failed_login_attempts + 1 WHERE email =` +
        ` '${user.email}';`)
      .then(response => true)
      .catch(e => {
        throw e
      })
  },

  /**
   * @param  {Object} user
   * accepts user object and sets current_timestamp
   * for a successful login.
   * return a Promise
   */
  setSuccessfulLoginTime(user) {
    return queryHelper(`UPDATE users SET last_succesful_login = ` +
        `current_timestamp WHERE email='${user.email}';`)
      .then(response => true)
      .catch(e => {
        throw e
      })
  },

  /**
   * @param  {Object} user
   * updates the time of an unsuccessful
   * login 
   * returns a Promise
   */
  setLastFailedLoginTime(user) {
    return queryHelper(`UPDATE users SET last_failed_login = ` +
        `current_timestamp WHERE email='${user.email}';`)
      .then(response => true)
      .catch(e => {
        throw e
      })
  },

  /////////////////// CHANGE EMAIL ///////////////////////////////////////

  /**
   * @param  {Object} user
   * takes a user object with a token for email change
   * checks that the user exist and updates the old_email 
   * array with json {"email":"","token_date":now(),"token": "token"}
   * object can be retrieved after verification
   * 
   * NOTE: old_email column should be of datatype json[]
   * 
   * sample json { "email":"test@coderlist.com",
   *              "token_date": "2018-06-07 14:14:51.812341+00", 
   *               "token":"386ebca7-907d-44a0-be0c-371ed1340781" }
   */
  insertOldEmailObject(user) {
    return findByUsername('users', user.email).then(dbUser => {
      console.log('USERFOUND', user)
      if (verifyPassword(user.password, dbUser.password)) {
        return queryHelper(`update users set old_email = old_email ||` +
            ` array['{ "old_val":"${user.email}", "new_val":"${user.new_email}","token_date": ` +
            `"' || now() || '", "token":"${user.change_token}" }']` +
            `::json[] where email='${user.email}';`)
          .then(response => true)
          .catch(e => {
            throw e
          })
      } else {
        console.log('VERIFICATION FAILED')
        return false;
      }
    }).catch(e => {
      throw e
    })
  },



  /**
   * @param  {Object} body
   *  use to retrieve object from old_email array
   *  where old_email_change_token from body equals old_email json token.
   *  the response includes the email to be changed, assigned token and
   *  token-insertion-time.
   *  
   *  sample response : { email: 'test@coderlist.com',
   *               token_date: '2018-06-07 14:14:51.812341+00',
   *             token: '386ebca7-907d-44a0-be0c-371ed1340781' }
   */
  getOldEmailObject(body) {
    return queryHelper(`WITH temp_table AS (SELECT email, unnest(old_email)` +
        ` FROM users WHERE email='${body.email}') SELECT` +
        ` unnest FROM temp_table WHERE unnest ->> 'token' = '${body.change_token}' ;`)
      .then(response => response[0].unnest)
      .catch(e => {
        throw e
      })
  },


  /**
   * @param  {Object} body
   * get old and new_email from body.
   * check function to update by user_later /later/
   */
  updateUserEmail(body){
     //change action must have been verified to proceed to this step
     //1. check old_email json array if new email has been used
     //2. update users.email if 1 is false
     //3. else raise already used exception
    return queryHelper(`
    DO $$
    BEGIN
       IF NOT EXISTS (with temp_table as (select email,unnest(old_email) 
          FROM users where email='${body.email}') 
          SELECT 1 FROM temp_table WHERE unnest ->> 'email'='${body.new_email}') 
      THEN
            UPDATE users SET email = '${body.new_email}' WHERE email = '${body.email}';
      ELSE
             RAISE EXCEPTION 'email already used';
      END IF;
    END
  $$; 
    `).then(response => true)
      .catch(e => {
        throw e
      })

  },


  /**
   * @param  {Object} user
   * delete user by email
   * associated pages gets deleted due to CASCADE constraint
   */
  deleteUserByEmail(user) {
    return queryHelper(`DELETE FROM users WHERE email = '${user.email}';`)
      .then(response => true)
      .catch(e => {
        throw e
      })
  },


  //////////////////// CHANGE PASSWORD  ///////////////////////////////////

  /**
   * @param  {Object} body
   * update user password
   */
  updatePassword(body) {
    //node sends email, old_password and new_password
    return findByUsername('users', body.email).then(dbUser => {
      if (verifyPassword(body.old_password, dbUser.password)) {
        return bcrypt.hash(body.new_password, saltrounds)
          .then(hash => {
            return queryHelper(
                `UPDATE users SET password = '${hash}' WHERE email ='${dbUser.email}';`)
              .then(user => {
                return true
              }).catch(e => {
                throw e
              })
          })
      } else {
        return false;
      }
    }).catch(e => {
      throw e
    })
  },


  /**
   * @param  {Object} body
   * 
   * when user clicks on forgot password. This should be called 
   * to store generated change token and the old password as json.
   * 
   * The object can be retrieved later to compare token from user email
   * and update email if token matches
   */

  insertOldPasswordObject(body) {
    return findByUsername('users', body.email).then(dbUser => {
      return queryHelper(`update users set old_password = old_password ||` +
          ` array['{ "old_val":"${dbUser.password}", "token_date": ` +
          `"' || now() || '", "token":"${body.change_password_token}" }']` +
          `::json[] where email='${dbUser.email}';`)
        .then(response => true)
      // .catch(e => {throw e})
    }).catch(e => {
      throw e
    })
  },



  /**
   * @param  {Object} body
   * 
   * functions recieves user password_change_token.
   * confirms if such token exist in the array and true
   * 
   * changePassword should be called withing getOldPasswordObject success
   */
  getOldPasswordObject(body) {
    return queryHelper(`WITH temp_table AS (SELECT email, unnest(old_password)` +
        ` FROM users WHERE email='${body.email}') SELECT` +
        ` unnest FROM temp_table WHERE unnest ->> 'token' = '${body.change_password_token}' ;`)
      .then(response => {
       // response[0].unnest
       return true
      })
      .catch(e => {
        throw e
      })
  },

  /**
   * @param  {String} email
   * 
   * gets all old passwords ever used by a user and
   * returns an array
   */
  getOldPasswordsArray(email) {
    return queryHelper(`
   select array(select unnest(old_password) ->> 'old_val' as 
   old_values from users where email='${email}')
   `).then(response => response[0].array)
      .catch(e => {
        throw e
      })
  },

}



/**
   * @param  {Object} body
   * 
   * if getOldPasswordObject is successful. updatePassword can be called on
   * success to update the password.
   * 
   * It checkes if password have ever been used by user. updates if false.
   */
const changePassword = function(body)  {
 return  user.getOldPasswordsArray(body.email).then(array => {
    const i = 0; 
    while (i < array.length) {
      if (verifyPassword(body.new_password, array[i])) {
        return Promise.reject(new Error('password already used'));
      }
      i++;
    }
    return bcrypt.hash(body.new_password, saltrounds)
      .then(hash => {
        return queryHelper(`UPDATE users SET password = '${hash}' 
        where email = '${body.email}'`)
          .then(response =>{
               return true
            })
  
      }).catch(e => { throw e})
 }).catch(e => {throw e})  
}

module.exports = {user,changePassword}
