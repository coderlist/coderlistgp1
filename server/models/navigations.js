const {queryHelper} = require('../../helperFunctions/query/queryHelper')


module.exports = {

   createNavItem(data){
     return queryHelper(`
     INSERT INTO page_navigations (page_id,parent_id,title,order_num,created_by) 
     VALUES (${data.page_id},${data.parent_id},'${data.title}',${data.order_num}, ${data.created_by})
     `).then(response => response)
     .catch(e =>{throw e})
   },

   updateNavItemById(data){
     return queryHelper(`
     UPDATE 
     page_navigations 
     SET page_id = ${data.page_id},
     parent_id = ${data.parent_id} ,title = '${data.title}',
     order_num = ${data.order_num},created_by = ${data.created_by}
     WHERE 
     item_id = ${data.item_id}`)
     .then(response => response)
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
      `DELETE FROM page_navigations WHERE item_id=${id}`
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
    AS p RIGHT JOIN page_navigations AS n ON 
    p.page_id = n.page_id) SELECT link from 
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
    SELECT p.link,n.item_id,n.page_id,n.parent_id,n.title,
    n.order_num,n.updated_date,n.creation_date,n.created_by 
    FROM pages AS p RIGHT JOIN page_navigations AS n ON p.page_id = n.page_id;
    `).then(response => response)
    .catch(e =>{throw e})

   },
} 

