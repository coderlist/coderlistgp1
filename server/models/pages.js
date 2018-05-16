const {queryHelper} = require('../../helperFunctions/queryHelper');

/**
 * exports all pages database query functions
 * using queryHelper function 
 */

module.exports = {
  createPage(req, res) {
    const query = `INSERT INTO pages \
                      (created_by,page_title) \
                     VALUES ('${req.body.created_by}',\
                     '${req.body.page_title}')`;

    queryHelper(query)
    .then((data) => data)
    .catch(e => {throw e})
  }
}