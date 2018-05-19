const bcrypt = require('bcrypt');
const {createUser} = require('../../server/models/users')
const {insertOne, findOne, findBy} = require('../../helperFunctions/queryHelper')
const saltRounds = 10;


 verifyPassword = (userPassword,user) => {
  condition = `email = '${user.email}'`
  return findOne('users',condition).then(user => {
    return bcrypt.compare(userPassword, user.password)
    .then(res => {
    });
  }).catch(e =>  e)
}





module.exports = {
  verifyPassword,
  createUser
};
