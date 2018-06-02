const {insertOne,
      findByUsername,
      queryHelper, insertInTable} = require('../../helperFunctions/query/queryHelper');



module.exports = {
  
  /**
   * @param  {Object} user
   * returns true on success
   * and error storing temporary token
   * for email verification
   */
  createUser(user, table){      
  return insertInTable(user,table).then(result => {
     return true
   }).catch(e => {
     throw e
   })
  
},

//get token from route in a user object
  //compare with token on db where email === email
  //on success change activated to true
  verifyUser(user){
     findByUsername('users',email).then(dbUser => {
       if(user.activation_token === dbUser.activation_token){
        queryHelper(`
         UPDATE users SET active = true WHERE email = '${dbUser.email}';
         UPDATE users SET actuivation_token = NULL WHERE email = '${dbUser.email}';
         `)
       }
     })
  }

}