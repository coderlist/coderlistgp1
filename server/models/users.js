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
<<<<<<< HEAD
     findByUsername('users',email).then(dbUser => {
       if(user.temporary_token === dbUser.temporary_token){
=======
     findByUsername('users',user.email).then(dbUser => {
       if(user.activation_token === dbUser.activation_token){
>>>>>>> e3f4858482b0f06f92eb38ded2c1a91a79ff5d02
        queryHelper(`
         UPDATE users SET active = true WHERE email = '${dbUser.email}';
         UPDATE users SET activation_token = NULL WHERE email = '${dbUser.email}';
         `)
         return true;
       }
       return false;
     })
  }

}