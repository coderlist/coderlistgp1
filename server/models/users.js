const {insertOne, queryHelper} = require('../../helperFunctions/query/queryHelper');
const bcrypt = require('bcrypt');
const saltRounds = 10;


module.exports = {
  
  createUser(user){
  return bcrypt.hash(user.password, saltRounds)
    .then(hash => {
           user = {
             email: user.email,
             password: hash
           }
       return  insertOne('users',user);
    }).catch(e => {
      throw e
    })
},

}