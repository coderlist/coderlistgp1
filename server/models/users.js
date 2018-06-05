const bcrypt = require('bcrypt');
const saltrounds = 10;
const {verifyPassword} = require('../../auth/verify');
const {insertOne,
      findByUsername,
      queryHelper, insertInTable} = require('../../helperFunctions/query/queryHelper');

/** all functions return a Promise */

module.exports = {
  
  createUser(user){        
    return insertOne(user).then(result => {
       return true
     }).catch(e => {
       throw e
     })  
  },

  /**
   * 
   * @param {Object} user 
   * gets token from route in a temporary user object
   * and compare with token on db where email === email 
   * on success, changes activated to true.
   * It return a Promise
   */
  verifyUser(user){
      return findByUsername('users',user.email).then(dbUser => {
        if(user.activation_token === dbUser.temporary_token){
        return bcrypt.hash(user.password, saltrounds)
        .then(hash => {
         return  queryHelper(
           `UPDATE users SET password = '${hash}',`+
           `temporary_token = null, verified = true `+
            `WHERE email ='${dbUser.email}';
           `).then(user => {
             return true
           })
        })
       }
       else{
         console.log('WRONG TOKEN')
         return false;
         Promise.reject();
       }
     }).catch(e => {throw e})
  },

  /**
   * @param  {Object} user
   * this takes a user object and
   * returns an object with last_login
   * and failed login attempts. It returns
   * Promise. The response is an array of a single 
   * object [{}]
   */
  getNumberOfFailedLogins(user){
    return queryHelper(`SELECT failed_login_attempts,`+
                     `last_failed_login FROM users WHERE`+
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
  resetFailedLogins(user){
    return queryHelper(`UPDATE users`+ 
                       `SET failed_login_attempts = 0`+
                      `WHERE email ='${user.email}';`)
      .then(result => true)
      .catch(e => {throw e})   
  },


  /**
   * @param  {Object} user
   * accepts a user object and increment 
   * user failed_login_attempts by 1.
   * returns true on success and a db error
   * on failure
   * return a Promise 
   */
  addOneToFailedLogins(user){
    return queryHelper(`UPDATE users SET failed_login_attempts =`+ 
                      ` failed_login_attempts + 1 WHERE email =`+ 
                      ` '${user.email}';`)
      .then(response => true)
      .catch(e => {throw e})
  },

  /**
   * @param  {Object} user
   * accepts user object and sets current_timestamp
   * for a successful login.
   * return a Promise
   */
  setSuccessfulLoginTime(user){
    return queryHelper(`UPDATE users SET last_succesful_login = `+ 
                       `current_timestamp WHERE email='${user.email}';`)
                       .then(response => true)
                       .catch(e => {throw e})
  },

  /**
   * @param  {Object} user
   * updates the time of an unsuccessful
   * login 
   * returns a Promise
   */
  setLastFailedLoginTime(user){
    return queryHelper(`UPDATE users SET last_failed_login = `+ 
                       `current_timestamp WHERE email='${user.email}';`)
                       .then(response => true)
                       .catch(e => {throw e})
  },

  
  /**
   * @param  {Object} user
   * takes a user object with a token for email change
   * checks that the user exist and updates the old_email 
   * array with json {"email":"","token_date":now(),"token": "token"}.
   * 
   * NOTE: old_email column should be of datatype json[]
   */
  setOldEmailObject(user){
    return findByUsername('users',user.email).then(dbUser => {
      if(!verifyPassword(user.password,dbUser.password)){
         return queryHelper(`update users set old_email = old_email ||`+
                         ` array['{ "email":"${user.email}","token_date": `+
                         `"' || now() || '", "token":"${user.activation_token}" }']`+
                        `::json[] where email='${user.email}';`)
              .then(response => true)
              .catch(e => {throw e})
      }else{
        console.log('VERIFICATION FAILED')
        return false;
      }
    }).catch(e => {throw e})
  },

  
  
  /**
   * @param  {Object} body
   *  use to retrieve object from old_email array
   *  where activation token from body equals old_email json token.
   *  the response includes the email to be changed, assigned token and
   *  token-time.
   *  
   */
  getOldEmailObject(body){
    return queryHelper(`with temp_table as (select email, unnest(old_email)`+
                      ` from users where email='${body.email}') select`+
                      ` unnest from temp_table where unnest ->> 'token' = ''${body.token}' ;`)
        .then(response => response)
        .catch(e => {throw e})
  }
    
}


