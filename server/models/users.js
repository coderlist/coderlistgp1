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

//get token from route in a user object
  //compare with token on db where email === email
  //on success change activated to true
  verifyUser(user){
     findByUsername('users',email).then(dbUser => {
       if(user.activation_token === dbUser.activation_token){
        queryHelper(`
         UPDATE users SET active = true WHERE email = '${dbUser.email}';
         UPDATE users SET activation_token = NULL WHERE email = '${dbUser.email}';
         `)
       }
     })
  }

}