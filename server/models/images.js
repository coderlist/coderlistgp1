const {queryHelper} = require('../../helperFunctions/query/queryHelper');

module.exports = {
  insertBannerImage(body) {
    return queryHelper(`INSERT INTO images (image_name,location,page_id,page_image,banner_image,uploaded_images)
                       VALUES ('${body.filename}','${body.banner_location}',
                       '${body.page_id}', '${body.page_image}', '${body.banner_image}', '${body.uploaded_images}')`)
        .then(response => console.log('Image Inserted'))
        .catch(e => {console.log('e :', e); throw e})
  }
}