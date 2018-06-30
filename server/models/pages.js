const {queryHelper} = require('../../helperFunctions/query/queryHelper');

/**
 * exports all pages database query functions
 * using queryHelper function 
 * 
 * functions take argument of type Object
 */

module.exports = {
  createPage(body) {
    return queryHelper(`INSERT INTO pages (created_by,title,page_description,order_number,ckeditor_html)
                       VALUES (${body.user_id},'${body.title}',
                       '${body.page_description}','${body.order_number}', '${body.ckeditor_html}')`)
        .then(response => console.log('PAGE CREATED'))
        .catch(e => {console.log('e :', e); throw e})
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

  getUserPages(rowsLimit,id){
    return queryHelper(`SELECT title,creation_date,last_edited_date,ckeditor_html
                       FROM pages WHERE owner_id='${id}' ORDER BY creation_date 
                       FETCH FIRST ${rowsLimit} ROW ONLY;`)
    .then(response => response)
      .catch(e => {throw e})
  },

  updatePageContentById(body){
     return queryHelper(`UPDATE pages SET title='${body.title}',
      page_description ='${body.page_description}',banner_location='${body.banner_location}', last_edited_by='${body.last_edited_by}', ckeditor_html = '${body.ckeditor_html}' where page_id = ${body.page_id};`)
     .then(response => response)
     .catch(e => {throw e})
  },

  deletePageById(id){
    return queryHelper(`DELETE FROM pages WHERE page_id= ${id};`)
    .then(response => true)
    .catch(e => {throw e})
  }
}