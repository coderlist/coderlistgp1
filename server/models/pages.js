const {queryHelper} = require('../../helperFunctions/queryHelper');

/**
 * exports all pages database query functions
 * using queryHelper function 
 * 
 * functions take argument of type Object
 */

module.exports = {
  createPage(page) {
    const query = `INSERT INTO pages \
                      (created_by,page_title) \
                     VALUES ('${page.created_by}',\
                     '${page.page_title}')`;

    queryHelper(query)
    .then((data) => data)
    .catch(e => {throw e})
  }
}