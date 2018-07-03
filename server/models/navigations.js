const {queryHelper} = require('../../helperFunctions/query/queryHelper')


module.exports = {

   /**
   * @param  {Object} bodyReq
   * parent_nav will be ordered by nav_order_number
   */
  createParentNavItem(bodyReq){
    return  queryHelper(`
      INSERT INTO navigations(name,link,nav_order_number
        ) VALUES ('${bodyReq.name}',
        '${bodyReq.link}',${bodyReq.nav_order_number}) RETURNING *
     `).then(response => response)
      .catch(e =>{throw e})
},

/**
 * @param  {Object} bodyReq
 * child_nav will be ordered by grid_order_number
 */
createChildNavItem(bodyReq, parentId){
  return queryHelper(`
      INSERT INTO sub_navigations(name,link,
        grid_order_number,parent_navigation_id) VALUES ('${bodyReq.name}',
        '${bodyReq.link}',${bodyReq.grid_order_number},${parentId})
     `).then(response => response)
      .catch(e =>{throw e})
},

 getParentNavIdByName(name){
  return queryHelper(`
  SELECT navigation_id FROM navigations WHERE name ='${name}' 
`).then(response => response)
.catch(e =>{throw e})
 },



 /**
  * gets all nav items and return as JSON object
  */
 getAllNavs(){
   return queryHelper(
     `
      WITH page AS (SELECT n.navigation_id,n.name,n.link,
        n.nav_order_number,s.name AS child_name,s.link AS child_link,
        s.grid_order_number FROM navigations AS n 
        FULL JOIN sub_navigations AS s ON n.navigation_id = s.parent_navigation_id) 
        SELECT navigation_id,name,link,nav_order_number AS order, 
        json_build_object('name', child_name, 'link', child_link, 'order', grid_order_number) AS 
        children FROM page;
     `
   ).then(response => response)
   .catch(e =>{throw e})
 }
}