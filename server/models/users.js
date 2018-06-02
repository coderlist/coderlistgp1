const {insertOne} = require('../../helperFunctions/query/queryHelper');
// const bcrypt = require('bcrypt');
// const saltRounds = 10;


module.exports = {
  
  createUser(user){        
    return insertOne(user).then(result => {
       return true
     }).catch(e => {
       throw e
     })  
  }

}