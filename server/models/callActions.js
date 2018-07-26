
const {queryHelper} = require('../../helperFunctions/query/queryHelper')
module.exports = {
  
  insertCallToAction(actionText){
    return queryHelper(
      `INSERT INTO call_to_actions (description) VALUES ('${actionText}');`
    ).then(response => response)
     .catch(e =>{throw e})
  },

  getLatestCall(){
    return queryHelper(`
    SELECT description FROM call_to_actions ORDER BY created DESC LIMIT 1;
    `).then(response => response)
      .catch(e =>{throw e})
  }
}