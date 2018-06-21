const {queryHelper} = require('../../helperFunctions/query/queryHelper');

/**
 * exports all pages database query functions
 * using queryHelper function 
 * 
 * functions take argument of type Object
 */

module.exports = {
  createPage(body) {
    return queryHelper(`INSERT INTO pages (created_by,title,page_description,order_number,ckeditor_html)`+
                       ` VALUES ('${body.email}', '${body.title}','${body.page_description}','${body.order_number}', '${body.ckeditorHTML}')`)
        .then(response => console.log('PAGE CREATED'))
        .catch(e => {throw e})
  },

  getPagebyID(id){
    return queryHelper(`SELECT * FROM pages WHERE page_id = ${id};`)
      .then(response => response)
      .catch(e => {throw e})
  },

  getPages(rowsLimit){
    return queryHelper(`SELECT * FROM pages ORDER BY creation_date  FETCH FIRST ${rowsLimit} ROW ONLY`)
    .then(response => response)
      .catch(e => {throw e})
  },

  getUserPages(rowsLimit,email){
    return queryHelper(`SELECT title,creation_date,last_edited_date,ckeditor_html`+
                     ` FROM pages WHERE email='${email}' ORDER BY creation_date FETCH FIRST ${rowsLimit} ROW ONLY;`)
    .then(response => response)
      .catch(e => {throw e})
  },

  updatePageContentById(id,data){
     return queryHelper(`UPDATE pages SET ckeditor_html = '${data}' where page_id = ${id};`)
     .then(response => response)
     .catch(e => {throw e})
  },

  deletePageById(id){
    return queryHelper(`DELETE FROM pages WHERE page_id= ${id};`)
    .then(response => true)
    .catch(e => {throw e})
  }

}