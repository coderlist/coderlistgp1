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
   * on success change activated to true
   */
  verifyUser(user){
     findByUsername('users',email).then(dbUser => {
       if(user.temporary_token === dbUser.temporary_token){
        return bcrypt.hash(user.password, saltrounds)
        .then(hash => {
         return  queryHelper(
           `update users set password = ${hash},`+
           `temporary_token = null, activated = active`+
            `where email ='${dbUser.email}';
           `)
        })
       }else{
         Promise.reject();
       }
     }).catch(e => {throw e})
  },

  getUserLoginTimes(user){
   
  }

}