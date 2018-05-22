const bcrypt = require('bcrypt');
const {findByUsername} = require('../helperFunctions/query/queryHelper')
const saltRounds = 10;


 /**
  * @param  {} userPassword
  * @param  {} hash
  * function used with passport strategy configuration
  * compare supplied password to db hash, retuen boolean
  * 
  */
 
 const verifyPassword = (userPassword,hash) => {
    return bcrypt.compareSync(userPassword, hash)
 }


module.exports = {
  verifyPassword
};
