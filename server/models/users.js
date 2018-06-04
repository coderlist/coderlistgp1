const bcrypt = require('bcrypt');
const saltrounds = 10;
const {verifyPassword} = require('../../auth/verify');
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

  // checkUserForEmailChange(user){
  //   //bcrypt.compareSync(userPassword, hash)
  //   return findByUsername('users',user.email).then(dbUser => {
  //     if(verifyPassword(user.password,dbUser.password)){
  //        return queryHelper(`INSERT INTO user (old_email) `+
  //                      `VALUES ('{"old_email": "${dbUser.email}"}')`)
  //     }
  //   })
  // }
    
}


