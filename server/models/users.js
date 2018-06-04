const bcrypt = require('bcrypt');
const saltrounds = 10;
const {insertOne,
      findByUsername,
      queryHelper, insertInTable} = require('../../helperFunctions/query/queryHelper');



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
           `temporary_token = null, activated = true `+
            `WHERE email ='${dbUser.email}';
           `).then(user => {
             return true
           })
        })
       }else{
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
  }

}