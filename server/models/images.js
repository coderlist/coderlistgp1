const {queryHelper} = require('../../helperFunctions/query/queryHelper')
module.exports = {
  
  /**
   * @param  {Object} bodyReq
   * This assumes that the body req comes with a page_id
   * which is a foreign const on images table
   */
  createImageObj(bodyReq){
     if (bodyReq.pageImage){
        return queryHelper(`INSERT into images (image_name,page_id,location,page_image)
         VALUES ('${bodyReq.imageName}',${bodyReq.pageId},'${bodyReq.location}',true)`)
         .then(response => response)
        .catch(e =>{throw e})
     }
     if(bodyReq.bannerImage){
        return queryHelper(`INSERT into images (image_name,page_id,location,banner_image)
        VALUES ('${bodyReq.imageName}',${bodyReq.pageId},'${bodyReq.location}',true)`)
        .then(response => response)
       .catch(e =>{throw e})
     }
     if(bodyReq.uploadedImages){
      return queryHelper(`INSERT into images (image_name,page_id,location,uploaded_images)
      VALUES ('${bodyReq.imageName}',${bodyReq.pageId},'${bodyReq.location}',true)`)
      .then(response => response)
      .catch(e =>{throw e})
    }
  },
  
  getImageObjectByImageId(id){
       return queryHelper(`
         SELECT * FROM images where image_id=${id}
       `).then(response => response)
       .catch(e =>{throw e})
  },

  getImageObjectsByPageId(id){
    return queryHelper(`
    SELECT * FROM images where page_id=${id}
  `).then(response => response)
  .catch(e =>{throw e})
  },

  deleteImageObjectByImageId(id){
    return queryHelper(`
    DELETE FROM images where image_id=${id}
  `).then(response => response)
  .catch(e =>{throw e})
  }
}