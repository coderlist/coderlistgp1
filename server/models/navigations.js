const {queryHelper} = require('../../helperFunctions/query/queryHelper')


module.exports = {
  
  /**
   * @param  {Object} bodyReq
   * check table for required fields to update function
   * accordingly
   */
  createNavItem(bodyReq){
      return  queryHelper(`
        INSERT INTO navigations(name,title,link,nav_order_number,
          grid_order_number,content) VALUES ('${bodyReq.name}','${bodyReq.title}',
          '${bodyReq.link}',${bodyReq.navOrderNumber},${bodyReq.gridOrderNumber},
          '${bodyReq.content}')
       `).then(response => response)
        .catch(e =>{throw e})
  },

  createChildNavItem(bodyReq){
    return queryHelper(`
        INSERT INTO navigations(name,title,link,nav_order_number,
          grid_order_number,content,parent_navigation_id) VALUES ('${bodyReq.name}','${bodyReq.title}',
          '${bodyReq.link}',${bodyReq.navOrderNumber},${bodyReq.gridOrderNumber},
          '${bodyReq.content}',${bodyReq.parentNavId})
       `).then(response => response)
        .catch(e =>{throw e})
  },

  getNavItemByNavId(id){
    return queryHelper(`
      SELECT * FROM navigations WHERE navigation_id =${id}
    `).then(response => response)
    .catch(e =>{throw e})
  },

  getNavItemByNavOrder(navOrder){
    return queryHelper(`
      SELECT * FROM navigations WHERE navigation_id =${navOrder}
    `).then(response => response)
    .catch(e =>{throw e})
  },

  getNavItemBygridOrder(gridOrder){
    return queryHelper(`
    SELECT * FROM navigations WHERE navigation_id =${gridOrder}
  `).then(response => response)
   .catch(e =>{throw e})
  }
}