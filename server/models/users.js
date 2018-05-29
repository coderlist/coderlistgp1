const {insertOne} = require('../../helperFunctions/query/queryHelper');
const bcrypt = require('bcrypt');
const saltRounds = 10;


module.exports = {
  
  createUser(user){
  console.log('first check')
  process.env.NODE_ENV === "production" ? console.log("") : console.log(user.password) // remove in production
  return bcrypt.hash(user.password, saltRounds)
    .then(hash => {
           user = {
             email: user.email,
             password: hash,
             first_name: user.first_name,
             last_name: user.last_name
           }
     return insertOne(user)
    }).catch(e => {
      console.log(e)
      throw e
    })
},

}