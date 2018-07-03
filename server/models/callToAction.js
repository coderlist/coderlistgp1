const {queryHelper} = require('../../helperFunctions/query/queryHelper');

module.exports = { 
  getCallToAction(){
    return queryHelper(`SELECT * FROM call_to_actions ORDER BY action_id LIMIT 1;`)
      .then(response => response)
      .catch(e => {throw e})
  }
}