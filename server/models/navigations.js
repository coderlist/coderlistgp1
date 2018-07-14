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
   }




} 


