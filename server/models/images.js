const {queryHelper} = require('../../helperFunctions/query/queryHelper');

module.exports = {
  insertBannerImage(body) {
    return queryHelper(`INSERT INTO images (image_name,location,page_image,banner_image,uploaded_images)
                       VALUES ('${body.filename}','${body.banner_location}',
                       '${body.page_image}', '${body.banner_image}', '${body.uploaded_images}')`)
        .then(response => console.log('Image Inserted'))
        .catch(e => {console.log('e :', e); throw e})
  },
  /**
   * @param  {Object} bodyReq
   * This assumes that the body req comes with a page_id
   * which is a foreign const on images table
   */
  createImageObj(bodyReq){
     if (bodyReq.pageImage){
        return queryHelper(`INSERT into images (image_name,location,page_image)
         VALUES ('${bodyReq.filename}','${bodyReq.banner_location}',true)`)
         .then(response => response)
        .catch(e =>{throw e})
     }
     if(bodyReq.bannerImage){
        return queryHelper(`INSERT into images (image_name,location,banner_image)
        VALUES ('$${bodyReq.filename}','${bodyReq.banner_location}',true)`)
        .then(response => response)
       .catch(e =>{throw e})
     }
     if(bodyReq.uploadedImages){
      return queryHelper(`INSERT into images (image_name,location,uploaded_images)
      VALUES ('${bodyReq.filename}','${bodyReq.banner_location}',true)`)
      .then(response => response)
      .catch(e =>{throw e})
    }
  },
  
  createImageObjComplete(bodyReq){
       return queryHelper(`INSERT into images (image_name,location,page_image, uploaded_images, banner_image)
        VALUES ('${bodyReq.filename}','${bodyReq.banner_location}','${bodyReq.page_image}','${bodyReq.uploaded_images}','${bodyReq.banner_image}')`)
        .then(response => response)
       .catch(e =>{throw e})
  },

  getAllImages(){
       return queryHelper(`
         SELECT image_name FROM images`)
      .then(response => response)
       .catch(e =>{throw e})
  },

  getAllImagesData(){ // for users/manage-images page
       return queryHelper(`
         SELECT * FROM images`)
      .then(response => response)
       .catch(e =>{throw e})
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
    DELETE FROM images where image_id=${id} RETURNING *
  `).then(response => response)
  .catch(e =>{throw e})
  },

  updateImageObjectByImageId(bodyReq){
    return queryHelper(`
    UPDATE images set image_name='${bodyReq.imageName}',location='${bodyReq.location}' WHERE image_id=${bodyReq.Id}
  `).then(response => response)
  .catch(e =>{throw e})
  }
}