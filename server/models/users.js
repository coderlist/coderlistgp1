const {insertOne,
      findByUsername,
      queryHelper} = require('../../helperFunctions/query/queryHelper');



module.exports = {
  
  /**
   * @param  {Object} user
   * object contains first_name,last_name,
   * email & activation token
   */
  createUser(user){        
  return insertOne(user).then(result => {
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