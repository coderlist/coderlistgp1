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
        queryHelper(`
         UPDATE users SET active = true WHERE email = '${dbUser.email}';
         UPDATE users SET activation_token = NULL WHERE email = '${dbUser.email}';
         `)
       }
     })
  }

}