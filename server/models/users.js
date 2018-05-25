const {insertOne} = require('../../helperFunctions/query/queryHelper');
const bcrypt = require('bcrypt');
const saltRounds = 10;


module.exports = {
  
  createUser(user){
  console.log('first check')
  console.log(user.password)
  return bcrypt.hash(user.password, saltRounds)
    .then(hash => {
           user = {
             email: user.email,
             password: hash
           }
     return insertOne(user)
    }).catch(e => {
      console.log(e)
      throw e
    })
},

}