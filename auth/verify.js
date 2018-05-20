const bcrypt = require('bcrypt');
const {findByUsername} = require('../helperFunctions/query/queryHelper')
const saltRounds = 10;


 verifyPassword = (userPassword,user) => {
  return findByUsername('users',user.email).then(user => {
    return bcrypt.compare(userPassword, user.password)
    .then(res => {
    });
  }).catch(e =>  e)
}





module.exports = {
  verifyPassword
};
