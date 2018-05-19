const {insertOne, queryHelper} = require('../../helperFunctions/queryHelper');
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


  getAllUsers( ) {
    const query = `SELECT * FROM "user"`;
    return queryHelper(query)
      .then((data) => data)
      .catch(e => {
        throw e
      })
  }
}