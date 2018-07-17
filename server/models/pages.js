const {queryHelper} = require('../../helperFunctions/query/queryHelper');

/**
 * exports all pages database query functions
 * using queryHelper function 
 * 
 * functions take argument of type Object
 */

module.exports = {
  createPage(body) {
    return queryHelper(`INSERT INTO pages (created_by,banner_location,title,page_description,order_number,ckeditor_html, is_published, link)
                       VALUES (${body.created_by},'${body.banner_location}','${body.title}',
                       '${body.page_description}','${body.order_number}', '${body.ckeditor_html}', '${body.is_published}', '${body.link}')`)
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

  getAllPages(){
    return queryHelper(`SELECT * FROM pages ORDER BY creation_date`)
    .then(response => response)
      .catch(e => {throw e})
  },

  getPageByLink(link){
    return queryHelper(`SELECT * FROM pages WHERE link = '${link}'`)
    .then(response => response)
      .catch(e => {throw e})
  },

  getAllPagesWithTitle(){
    return queryHelper(`SELECT page_id,title FROM pages ORDER BY creation_date`)
    .then(response => response)
      .catch(e => {throw e})
  },

  getAllPagesWithLink(){
    return queryHelper(`SELECT page_id,link FROM pages ORDER BY creation_date`)
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
     return queryHelper(`UPDATE pages SET title='${body.title}', link='${body.link}'
      page_description ='${body.page_description}',banner_location='${body.banner_location}', last_edited_by='${body.last_edited_by}', ckeditor_html = '${body.ckeditor_html}' where page_id = ${body.page_id};`)
     .then(response => response)
     .catch(e => {throw e})
  },

  updateBannerLocationById(body){
     return queryHelper(`UPDATE pages SET banner_location='${body.banner_location}' WHERE page_id = ${body.page_id};`)
     .then(response => response)
     .catch(e => {throw e})
  },

  updatePageContentByIdNoBanner(body){
     return queryHelper(`UPDATE pages SET title='${body.title}', link='${body.link}',
      page_description ='${body.page_description}', last_edited_by='${body.last_edited_by}', ckeditor_html = '${body.ckeditor_html}' where page_id = ${body.page_id};`)
     .then(response => response)
     .catch(e => {throw e})
  },

  updatePageLocationsById(body){
     return queryHelper(`UPDATE pages SET is_homepage_grid='${body.is_homepage_grid}',
      is_published ='${body.is_published}', is_nav_menu='${body.is_nav_menu}', order_number = ${body.order_number} where page_id = ${body.page_id};`)
     .then(response => response)
     .catch(e => {throw e})
  },

  deletePageById(id){
    return queryHelper(`DELETE FROM pages WHERE page_id= ${id};`)
    .then(response => true)
    .catch(e => {throw e})
  },

  getPagesByHomePageGrid(){
    return queryHelper(`SELECT * FROM pages WHERE is_homepage_grid = true AND is_published = true order by order_number;`)
      .then(response => response)
      .catch(e => {throw e})
  }

}