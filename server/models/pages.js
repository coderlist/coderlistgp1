const {queryHelper} = require('../../helperFunctions/queryHelper');

/**
 * exports all pages database query functions
 * using queryHelper function 
 * 
 * functions take argument of type Object
 */

module.exports = {
  createPage(user) {
    return queryHelper(`INSERT INTO pages (created_by, title)`+
                       ` VALUES ('${user.email}', '${user.title}')`)
        .then(response => concole.log('PAGE CREATED'))
        .catch(e => {throw e})
  },


  getPagebyID(id){
    return queryHelper(`SELECT * FROM pages WHERE page_id = ${id};`)
      .then(response => response)
      .catch(e => {throw e})
  },

  getPages(rowsLimit){
    return queryHelper(`SELECT * FROM pages ORDER BY creation_date ${order} FETCH FIRST ${rowsLimit} ONLY;`)
    .then(response => response)
      .catch(e => {throw e})
  },

  getUserPages(rowsLimit,email){
    return queryHelper(`SELECT title,creation_date,last_edited_date,ckeditor_html`+
                     ` FROM pages WHERE email='${email}' ORDER BY creation_date FETCH FIRST ${rowsLimit} ROW ONLY;`)
    .then(response => response)
      .catch(e => {throw e})
  },


}