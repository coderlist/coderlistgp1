const {insertOne} = require('../../helperFunctions/query/queryHelper');



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

}