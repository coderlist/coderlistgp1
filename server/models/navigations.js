const {queryHelper} = require('../../helperFunctions/query/queryHelper')


module.exports = {

   createNavItem(data){
     return queryHelper(`
     INSERT INTO page_navigations (page_id,parent_id,title,order_num) 
     VALUES (${data.page_id},${parent_id},'${data.title}',${data.order_num})
     `).then(response => response)
     .catch(e =>{throw e})
   },

   getNavItemByNavId(id){
     return queryHelper(
       `SELECT * FROM page_navigations WHERE item_id=${id}`
     ).then(response => response)
     .catch(e =>{throw e})
   },

   getNavItemsByPageId(id){
    return queryHelper(
      `SELECT * FROM page_navigations WHERE page_id=${id}`
    ).then(response => response)
    .catch(e =>{throw e})
   },

   getNavItemByOrderNum(num){
    return queryHelper(
      `SELECT * FROM page_navigations WHERE order_num=${num}`
    ).then(response => response)
    .catch(e =>{throw e})
   },

   getAllNavItems(){
    return queryHelper(
      `SELECT * FROM page_navigations`
    ).then(response => response)
    .catch(e =>{throw e})
   },

   deleteNavItemById(id){
    return queryHelper(
      `DELTE FROM page_navigations WHERE item_id=${id}`
    ).then(response => response)
    .catch(e =>{throw e})
   },

   deleteNavItemByOrderNum(num){
    return queryHelper(
      `DELTE FROM page_navigations WHERE order_num=${num}`
    ).then(response => response)
    .catch(e =>{throw e})
   },

   
   /**
    * @param  {Int} id
    * gets nav link information by page_id
    */
   getNavLinkByPageId(id){
    return queryHelper(`
   WITH temp_table AS(SELECT p.link,n.page_id FROM pages 
    AS p FULL JOIN page_navigations AS n ON 
    p.page_id = n.page_id;) SELECT link from 
    temp_table where page_id=${id};
    `).then(response => response)
    .catch(e =>{throw e})
   },

   /**
    * 
    * gets all nav item information with link
    */
   getAllNavItemsWithLink(){
     return queryHelper(`
     SELECT p.link,n.item_id,n.title,n.page_id,n.parent_id,
     n.order_num FROM pages as p FULL JOIN page_navigations 
     AS n ON p.page_id = n.page_id;
     `).then(response => response)
     .catch(e =>{throw e})
   },

   




} 

