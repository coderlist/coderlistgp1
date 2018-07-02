const {queryHelper} = require('../../helperFunctions/query/queryHelper')


module.exports = {
  
 
  /**
   * @param  {Object} bodyReq
   * parent_nav will be ordered by nav_order_number
   */
  createParentNavItem(bodyReq){
      return  queryHelper(`
        INSERT INTO navigations(name,title,link,nav_order_number
          ) VALUES ('${bodyReq.name}','${bodyReq.title}',
          '${bodyReq.link}',${bodyReq.nav_order_number}
          )
       `).then(response => response)
        .catch(e =>{throw e})
  },

  /**
   * @param  {Object} bodyReq
   * child_nav will be ordered by grid_order_number
   */
  createChildNavItem(bodyReq){
    return queryHelper(`
        INSERT INTO navigations(name,link,
          grid_order_number,parent_navigation_id) VALUES ('${bodyReq.name}',
          '${bodyReq.link}',${bodyReq.grid_order_number},(SELECT navigation_id FROM 
            navigations WHERE name='${bodyReq.parent_name}'))
       `).then(response => response)
        .catch(e =>{throw e})
  },

  getParentNavByNavId(id){
    return queryHelper(`
      SELECT * FROM navigations WHERE navigation_id =${id} AND 
      parent_navigation_id IS NULL
    `).then(response => response)
    .catch(e =>{throw e})
  },

  getParentNavByTitle(title){
    return queryHelper(`
      SELECT * FROM navigations WHERE title =${title} AND 
      parent_navigation_id IS NULL
    `).then(response => response)
    .catch(e =>{throw e})
  },

  getParentNavByNavOrder(navOrder){
    return queryHelper(`
      SELECT * FROM navigations WHERE nav_order_number =${navOrder}
    `).then(response => response)
    .catch(e =>{throw e})
  },

  getNavItemBygridOrder(gridOrder){
    return queryHelper(`
    SELECT * FROM navigations WHERE grid_order_number =${gridOrder}
  `).then(response => response)
   .catch(e =>{throw e})
  }
}