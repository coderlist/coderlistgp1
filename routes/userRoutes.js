const fs = require('fs');
const express = require('express');
const userRoutes = new express.Router();
const urlConfig = require ('../environmentConfig');
// const passport = require('../auth/local');
const Logins = require('../helperFunctions/Logins');
const UserLocalsNavigationStyling = require('../helperFunctions/navigation-locals');
const userLocalsNavigationStyling = new UserLocalsNavigationStyling();
const MessageTitles = require('../helperFunctions/message-titles');
const sanitizeHtml = require('sanitize-html');
const allowedCkeditorItems = { 
  allowedTags: [ 'h1', 'h2','h3', 'h4', 'h5', 'h6', 'img', 'blockquote', 'p', 'a', 'ul', 'ol',
    'nl', 'li', 'b', 'i', 'img', 'strong', 'span', 'em', 'strike', 'code', 'hr', 'br', 'div',
    'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre' ],
  allowedAttributes: false,
  // {
  //   a: [ 'href', 'name', 'target' ],
  //   img: [ 'src' ],
  //   table: ['align', 'border', 'cellpadding', 'cellspacing'],
  //   '*': ['id', "class", "lang", "title", "dir", 'style', 'margin*', 'width', 'height']
  // },
  selfClosing: [ 'img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta' ],
allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com']
}
const messageTitles = new MessageTitles();
const logins = new Logins();
const {
  query,
  check,
  param,
  body,
  validationResult
} = require('express-validator/check');
const {
  matchedData,
  sanitize,
  sanitizeBody
} = require('express-validator/filter');
const {
  updatePassword,
  updateUserEmail,
  insertOldEmailObject,
  listAllUsers,
  findEmailById,
  getUserById,
  updateUserName,
  deleteUserById,
  getIsUserAdmin,
  createUser,
  getUnverifiedUsers
} = require('../server/models/users').user;
const {
  createPage,
  getAllPages,
  getAllPagesWithTitle,
  getAllPagesWithLink,
  getPagebyID,
  getPageByLink,
  deletePageById,
  updatePageContentById,
  updatePageContentByIdNoBanner,
  updateBannerLocationById,
  updatePageLocationsById
} = require('../server/models/pages');
const {
  insertBannerImage,
  getAllImages,
  deleteImageObjectByImageId,
  getAllImagesData,
  createImageObjComplete
} = require('../server/models/images');
const {
  createNavItem,
  getParentNavIdByName,
  getAllNavs,
  getAllParentNavs,
  getAllChildNavs,
  deleteParentNavById,
  deleteParentNavByOrder,
  deleteChildNavById,
  deleteChildNavByOrder,
  getAllNavItemsWithLink,
  updateNavItemById,
  deleteNavItemById
} = require('../server/models/navigations')
const { 
  toNavJSON
} = require('../helperFunctions/query/navJson')
const { 
  insertCallToAction,
  getLatestCall
} = require('../server/models/callActions');
const uuid = require('uuid/v1');
const Mail = require('../helperFunctions/verification/MailSender');
const multer = require('multer');
const imageUploadLocation = './assets/images/';
const PDFUploadLocation = './assets/pdfs/';
const path = require('path');

//// Multer Uploads  ////

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imageUploadLocation)
    
  },
  filename: function (req, file, next) {
    const ext = file.mimetype.split('/')[1];
    req.fileLocation = 'image' + '-' + Date.now() + '.' + ext
    next(null, req.fileLocation);
  }
});

let storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imageUploadLocation)
  },
  filename: function (req, file, next) {
    const ext = file.mimetype.split('/')[1];
    req.fileLocation = 'image' + '-' + Date.now() + '.' + ext
    next(null, req.fileLocation);
  }
});

let storagePDF = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, PDFUploadLocation)
  },
  filename: function (req, file, next) {
    req.body.title = req.body.title.replace(/[^\w _]+/, "")
    if(req.body.title === ""){
      req.body.title = "No Name Given";
    }
    const ext = path.extname(file.originalname);
    if (ext !== '.pdf' || ext !== '.docx'){
    }
    const extNoDot = ext.slice(1);
    file.fieldname = `${req.body.title}-${extNoDot}`;
    console.log('ext :', ext, extNoDot);
    req.fileLocation = file.fieldname + '-' + Date.now() + ext
    next(null, req.fileLocation);
  }
});

const crypto = require('crypto');
// crypto.pseudoRandomBytes(16, function(err, raw) {
//   if (err) return callback(err);

//   callback(null, raw.toString('hex') + path.extname(file.originalname));
// });

const imageUploadSizeLimit = 500000;
const pdfUploadSizeLimit = 11000000;
const upload = multer({
  storage: storage,
  limits: {
    fileSize: imageUploadSizeLimit
  },
  fileFilter: function (req, file, next) {
    if (!file) {
      next();
    }
    const image = file.mimetype.startsWith('image/');

    if (image) {
      console.log('photo uploaded');
      next(null, true);
    } else {
      console.log("file not supported");
      //TODO:  A better message response to user on failure.
      return next();
    }
  }
});

const fileUpload = multer({
  storage: storage2,
  limits: {
    fileSize: imageUploadSizeLimit
  },
  fileFilter: function (req, file, next) {
    if (!file) {
      next();
    }
    const image = file.mimetype.startsWith('image/');
    if (image) {
      console.log('photo uploaded');
      next(null, true);
    } else {
      console.log("file not supported");
      return next(new Error('File type not supported'));
    }
  }
});

const PDFUpload = multer({
  storage: storagePDF,
  limits: {
    fileSize: pdfUploadSizeLimit
  },
  fileFilter: function (req, file, next) {
    // if (!file) {
    //   console.log('nofile :');
    //   next();
    // }
    console.log('IN FILE FILTER');
    const pdf = file.mimetype.startsWith('application/pdf');
    const docx = file.mimetype.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
console.log('pdf true:', pdf);
console.log('document :', docx);
    if (pdf) {
      console.log('PDF uploaded');
      next(null, true);
    }
    else if (docx) {
      console.log('Text document uploaded');
      next(null, true);
    } else {
      console.log("file not supported");
      //TODO:  A better message response to user on failure.
      return next(new Error('File type prohibited'));
    }
  }
});

//// End of Multer Uploads  ////

userRoutes.use(logins.isLoggedIn);

/* Please, refer to the navigation-locals.js file
*  It can be found in the helperFunctions folder
*  For more instructions in how to use this module
*/
userRoutes.use(userLocalsNavigationStyling.setLocals);
/* Please, refer to the message-titles.js file
*  It can be found in the helperFunctions folder
*  For more instructions in how to use this module
*/
userRoutes.use(messageTitles.setMessageTitles);

// userRoutes.get('/', (req, res) => {
//   res.status(200).render('pages/users/dashboard.ejs', { 
//   messages: req.flash('info')});
//   return;
// });

userRoutes.get('/dashboard', (req, res) => {
  const callToAction = getLatestCall();
  const users = listAllUsers()
  const pages = getAllPages()
  Promise.all([callToAction, users, pages]).then(function(values){
    console.log('values[0] :', values[0]);
    res.status(200).render('pages/users/dashboard.ejs', { 
      callToAction: values[0][0],
      users : values[1],
      pages : values[2],
      messages: req.flash('info'),
      messagesError : req.flash('error')
    })
  }).catch(function(err){
    console.log('err :', err);
  })
  return;
});

ckeditorPostCheck = [
  body('content').exists()  //this needs a more robust check. Script tags. SQL injection
]
userRoutes.post('/dashboard', ckeditorPostCheck, (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', 'Invalid ckeditor data');
    res.status(200).redirect('users/dashboard.ejs') 
    return;
  }
  req.body.content = sanitizeHtml(req.body.content, allowedCkeditorItems);
  insertCallToAction(req.body.content)
  .then(function(){
    req.flash('info', 'Headline text saved');
    res.status(200).redirect('/users/dashboard');
  })
})

/////////////////////// Admin page routes /////////////////////

userRoutes.get('/manage-nav', function (req, res) {
  const pageItems = getAllPagesWithLink(); // this currently gets all information about the page. We need to cut this down to what is needed
  const navigationItems = getAllNavItemsWithLink();
  Promise.all([pageItems, navigationItems])
  .then(function(values){
    values[1].map(function(navs){

    })
    // console.log('items :', values[0]);
    values[1].map(function(item){
      // console.log('navs item :', item);
    })
    res.status(200).render('pages/users/manage-nav.ejs', { 
      messages: req.flash('info'),
      messagesError : req.flash('error'),
      pageItems: values[0],
      mainMenuItems: values[1],
      subMenuItems: values[1]
    });
  }).catch(function(err){
    console.log("err", err);
    req.flash('error','There was a system error');
  })
})

const userPostNavItemsCheck = [
  body('menuItemId').matches(/\d*|/), //  the or parameter matches the empty string
  body('menuInputField').matches(/^[\w ]+$/), //aplhanumeric with spaces
  body('menuItemPageId').matches(/\d*|/),  // the or parameter matches the empty string
  body('menuItemOrderNumber').isInt(),
  body('menuParentItemSelectedOptionDataID').matches(/\d*|/)
]

userRoutes.post('/manage-nav', userPostNavItemsCheck, function(req,res){
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('errors.array() :',req.body, errors.array());
    res.status(200).send(JSON.stringify({ status: "FAILURE", message: 'Invalid nav item entry'}));
    return;
  }
  console.log('req.body :', req.body);
  let nav = {
    page_id: req.body.menuPageId || null,
    title: req.body.menuInputField,
    order_num: req.body.menuItemOrderNumber,
    parent_id: req.body.menuParentItemSelectedOptionDataID || null,
    created_by: req.session.user_id, 
    item_id : req.body.menuItemId || null
  }
  console.log('typeof nav.item_id :', isNaN(parseInt(nav.item_id)), typeof nav.item_id);
  if (isNaN(parseInt(nav.item_id))) {
    console.log('creating :');
    createNavItem(nav)
    .then(function(createdNavItem){
      res.status(200).send(JSON.stringify({ status: "SUCCESS", message: 'Nav Item Created', createdNavItem: createdNavItem }));
      return;
    }).catch(function(err){
      console.log("err", err);
      res.status(200).send(JSON.stringify({ status: "FAILURE", message: 'Nav Item not created. Does this name already exist?' }));
      return;
    })
  } else {
    console.log('updating :');
    updateNavItemById(nav)
    .then(function(updatedNavItem){
      res.status(200).send(JSON.stringify({ status: "SUCCESS", message: 'Nav Item Updated', updatedNavItem: updatedNavItem }));
      return;
    }).catch(function(err){
      console.log('err :', err);
      res.status(200).send(JSON.stringify({ status: "FAILURE", message: 'Nav Item update failed' }));
      return;
    })
  }
});

const navItemDeleteCheck = [
  param('item_id').isInt()
]

userRoutes.delete('/manage-nav/:item_id', navItemDeleteCheck, function(req,res){
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('errors.array() :',req.body, errors.array());
    req.flash('error', 'Invalid nav item');
    res.status(200).redirect('users/manage-nav') 
    return;
  }
  console.log('req.params :', req.params);
  deleteNavItemById(req.params.item_id)
  .then(function(){
    res.status(200).send(JSON.stringify({ status: "SUCCESS", message: 'Nav Item deleted' }));
  }).catch(function(err){
    console.log('err :',err)
    res.status(200).send(JSON.stringify({ status: "FAILURE", message: 'Nav Item not deleted' }));
  })
})

userRoutes.get('/page-navmenu-request', function(req, res){

  const pageItems = getAllPagesWithLink(); // this currently gets all information about the page. We need to cut this down to what is needed
  const navigationItems = getAllNavItemsWithLink();
  Promise.all([pageItems, navigationItems])
  .then(function(values){
    const data = {
      pageItems: values[0],
      mainMenuItems: values[1].filter(function(mainMenuItem){return mainMenuItem.parent_id === null}),
      subMenuItems: values[1].filter(function(subMenuItem){return subMenuItem.parent_id !== null})
    }
    res.status(200).send(JSON.stringify(data))
  }).catch(err => console.log('err :', err))
})


// userRoutes.post('/manage-nav', function(req,res){
//   if (!req.body.subMenuParentItemSelectedOption){
//     //req is for parent nav if it does not contain
//     //a parent_page value
//  nav = {
//    title:req.body.menuInputField,//name:req.body.page_name,
//    link:req.body.menuItemSelectedOption, 
//    nav_order_number:req.body.menuItemOrderNumber
//  }
 
//  createParentNavItem(nav).then(response => {
//    res.status(200).send('parent nav created')
//  }).catch(e => {
//    res.status(400).send(e.stack)
//  })
// }else{
//   console.log('CHILD REQ', req.body)
//  nav = {
//    title: req.body.subMenuInputField,//name:req.body.page_name,
//    link:req.body.subMenuChildItemSelectedOption,
//    grid_order_number:req.body.subMenuItemOrderNumber,
//    parent_title: req.body.subMenuParentItemSelectedOption
//  }
//  getParentNavIdByName(nav.parent_title).then(response => {
//    createChildNavItem(nav, response[0].navigation_id).then(response => {
//      res.status(200).send('child nav created')
//    }).catch(e => {
//     console.error(e.stack)
//    })
//  }).catch(e => {
//   console.error(e.stack)
// })
 
// }
// })


// userRoutes.delete('/manage-nav/main-nav-item/:itemId', function(req,res){
//     deleteParentNavById(req.params.itemId) 
//     .then(response => {
//       console.log('Main Menu deleted')
//     }).catch(err => {
//       console.error(err)
//     })
// })


// userRoutes.delete('/manage-nav/sub-nav-item/:itemId', function(req,res){
//   deleteChildNavById(req.params.itemId)
//   .then(response => {
//     console.log('Sub Menu deleted')
//   }).catch(err => {
//     console.error(err)
//   })
// })

//////////////////  MANAGE PDFS  //////////////////
 
userRoutes.get('/manage-pdfs', function (req, res) {
  // messages: req.flash('Are you sure you want to delete this PDF?') // This will not work. Flash messages are in the form req.flash('flashtype', 'Message') "Kristian"
  let pdfList = [];
  fs.readdir('assets/pdfs', (err, pdfs) => {
    if (err) {
      console.log('err :', err);
    }
    if (!pdfs) {
      req.flash('error','No PDFs uploaded');
      res.status(200).render('pages/users/manage-pdfs.ejs', { 
        messages: req.flash('info'),
        messagesError: req.flash('error'),
        pdfList: pdfList
      })
      return;
    }
      pdfs.map(function(pdf) {
      console.log('pdfs :', pdf);
      const shortName = pdf.match(/([\w\s]*)/)[0] + pdf.match(/.([a-zA-Z0-9]{3,4})$/)[0];  //remove the random number to make displaying prettier
      pdfList.push({name: pdf, short: shortName, location: `${urlConfig.url}/pdfs/${pdf}`})
    })
    console.log('pdfList :', pdfList);
    res.status(200).render('pages/users/manage-pdfs.ejs', { 
      messages: req.flash('info'),
      messagesError: req.flash('error'),
      pdfList: pdfList
    })
    return;
  })
})

userRoutes.post('/manage-pdfs', PDFUpload.single('pdf'), function (req, res) {
  // logic handled within PDFUpload
  req.flash('info', 'PDF Uploaded')
  res.status(200).redirect('/users/manage-pdfs')
  return;
})


PDFDeleteCheck = [
  param('pdf_name').matches('^[\\w\\s-.]+$')
]

userRoutes.delete('/manage-pdfs/:pdf_name', PDFDeleteCheck, function(req, res){
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('errors.array() :', errors.array());
    res.status(200).send(JSON.stringify({ status: "FAILURE", message: 'Invalid PDF name', location: "/users/manage-pdfs" }));
    return;
  }
  console.log('req.params :', req.params);
  fs.unlink(`assets/pdfs/${req.params.pdf_name}`, function(err){
    if (err) {
      console.log('err :', err);
      res.status(200).send(JSON.stringify({ status: "FAILURE", message: 'There was an error deleting the PDF file', location: "/users/manage-pdfs" }));
      return;
    }
    res.status(200).send(JSON.stringify({ status: "SUCCESS", message: 'PDF successfully deleted', location: "/users/manage-pdfs" }));
    return;
  })
});


////////////////  End of Manage PDFs    /////////////////////////

///////////////   Manage Images     /////////////////////////

userRoutes.get('/manage-images', function(req, res){
  getAllImagesData(req.params.image_id)
  .then(function(data){
    console.log('data :', data);
    if(!data || data.length === 0) {
      req.flash('info', 'No images');
      res.status(200).render('pages/users/manage-images', { message: req.flash('info'), messagesError: req.flash('error') } );
      return;
    }
    // req.flash('info', 'Images');
      data = data.map(function(image){ image.location = `${urlConfig.url}${image.location}`; return image}) // add domain to the beginning of the image location
      res.status(200).render('pages/users/manage-images', { images: data, message: req.flash('info'), messagesError: req.flash('error') } );
      return;
  }).catch(function(err){
    console.log('err :', err);
    req.flash('error', 'There was an error loading the images');
    res.status(200).redirect('/users/manage-images');
    return;
  })
});

userRoutes.post('/manage-images/', upload.single('image'), function(req, res){  // needs to be converted to delete route 
  let errors = validationResult(req);

  const image = {
    banner_location: `/images/${req.file.filename}`,
    filename: req.file.filename,
    banner_image: false,
    uploaded_images: true,
    page_image: true
  }
  createImageObjComplete(image)
  .then(function(data){    
    req.flash('info', 'Image added');
    res.status(200).redirect('/users/manage-images');
    return;
  }).catch(function(err){
    req.flash('error', 'There was an error adding the image');
    res.status(200).redirect('/users/manage-images');
    return;
  })
});

imageDeleteCheck = [
  param('image_id').isAlphanumeric()
]

userRoutes.delete('/manage-images/:image_id', imageDeleteCheck, function(req, res){  // needs to be converted to delete route
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('info', 'Invalid image Name');
    res.status(200).redirect('/users/manage-images');
    return;
  }
  console.log('req.params.image_id :', req.params.image_id);
  deleteImageObjectByImageId(req.params.image_id)
  .then(function(data){  
    fs.unlink(`assets/images/${data[0].image_name}`, (err) => {
      if (err) { console.log('err :', err); }
      req.flash('info', 'Image Deleted');
      res.status(200).redirect('/users/manage-images');
      return;
    })
  }).catch(function(err){
    req.flash('error', 'There was an error deleting the image');
    res.status(200).redirect('/users/manage-images');
    return;
  })
});


///////////////   End of Manage Images   /////////////////////

////////////////   End of User 


userRoutes.get('/profile', function (req, res) {
  res.status(200).render('pages/users/profile.ejs', { 
    messages: req.flash('info')
  })
})




////////////////////    Change password while authenticated ////////////////////

userRoutes.get('/change-password', (req, res) => {
  res.status(200).render('pages/users/change-password', {
    messages: req.flash('info')
  });
  return;
});

const passwordCheck = [
  body('old_password').isLength({
    min: 8
  }),
  body("new_password", "invalid password")
  .isLength({
    min: 8
  })
  .custom((value, {
    req,
    loc,
    path
  }) => {
    if (value !== req.body.confirm_password) {
      throw new Error("Passwords don't match");
    } else {
      return value;
    }
  })
];

userRoutes.post('/change-password', passwordCheck, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("info", "Invalid password or passwords do not match", process.env.NODE_ENV === 'development' ? errors.array() : ""); //error.array() for development only
    res.redirect('/users/change-password');
    return;
  }
  user = {
    user_id: req.session.user_id,
    old_password: req.body.old_password,
    new_password: req.body.new_password
  }

  updatePassword(user)
    .then(function (data) {
      if (!data) {
        console.log("failed to update password");
        req.flash('info', 'Invalid credentials');
        res.status(200).render('pages/users/change-password', {
          messages: req.flash('info'),
          messagesError : req.flash('error')
        });
        return;
      }
      findEmailById(user.user_id)
      .then(function(userEmail){
        let mail = new Mail();
        mail.sendPasswordChangeConfirmation(userEmail[0]);
        req.logOut();
        req.flash('info', 'Password updated. Please login with your new password');
        res.status(200).redirect('/login');
        return;
      })
    }).catch(function (err) {
      req.flash('info', 'There was an internal error. Please contact your administrator');
      res.status(200).redirect('./dashboard');
      console.log(err)
      return;
    });

});


/////////////       Create users           /////////////////////////
const pageIDPostCheck = [
  body('page_id').isInt()
]


userRoutes.post('/update-banner', upload.single('image'), function(req, res){
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('info', 'invalid pageID');
    res.status(200).redirect(`/users/edit-page/${req.body.page_id}`);
    return;
  }
  //send updated banner to banner_location  pages table
  console.log('req.body :', req.body);
  let image = {
    banner_location: `/images/${req.file.filename}`,
    filename: req.file.filename,
    banner_image: true,
    uploaded_images: true,
    page_image: false
  }
  const page = {
    banner_location: `/images/${req.file.filename}`,
    page_id: req.body.page_id
  }
  createImageObjComplete(image)
  .then(function(){
    console.log('page1 :', page);
    updateBannerLocationById(page)  
    .then(function(){
      console.log('page2 :', page);
      req.flash('info','Banner updated');
      res.status(200).redirect('/users/dashboard');
      return;
    })
  }).catch(function(err){
    req.flash('error','There was a system error. Please contact your administrator');
    res.status(200).redirect('/users/dashboard');
    return;
  });
})

userRoutes.get('/create-user', (req, res) => { //accessible by authed admin
  res.status(200).render('pages/users/create-user.ejs', {
    messages: req.flash('info'),
    messagesError: req.flash('error')
  });
});

const createUserCheck = [
  body('email').isEmail().normalizeEmail(),
  body('first_name').trim().matches(/^[\w -]+$/),
  body('last_name').trim().matches(/^[\w -]+$/),
  body('is_admin').matches(/on|/)
];


userRoutes.post('/create-user', createUserCheck, (req, res) => { //accessible by authed admin

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const userTemp = {
      email: req.body.email || "",
      first_name: req.body.first_name || "",
      lastName: req.body.last_name || "",
      is_admin: req.body.is_admin || ""
    }
    req.flash("info", "Invalid user data", process.env.NODE_ENV === 'development' ? errors.array() : ""); //error.array() for development only
    res.status(200).render('pages/users/create-user.ejs', {
      messagesError:  req.flash('error'),
      messages: req.flash('info'),
      userTemp
    });
    return;
  }
  getIsUserAdmin(req.session.user_id)
  .then(function(isAdmin){
    if (!isAdmin[0].is_admin) {
      req.flash('error', 'You are unable to create users');
      res.redirect('/users/dashboard');
      return;
    }
    const user = {
      email: req.body.email,
      last_failed_login: "",
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      failed_login_attempts: 0,
      is_admin: req.body.is_admin == 'on' ? true : false,
      activation_token: uuid()
    };
    console.log('user :', user);
    createUser(user).then(function (userCreated) { // returns user created true or false
      if (userCreated) {
        let mail = new Mail;
        mail.sendVerificationLink(user);
        req.flash('info', 'user created and email sent'); 
        res.render('pages/users/create-user', {
          messagesError:  req.flash('error'),
          messages: req.flash('info')
        }); // this is going to the dashboard after create user.  Why !!!!
        return;
      } else {
        console.log("There was a create user error", err)
        req.flash('info', 'There was an error creating this user. Please try again. If you already have please contact support.')
        res.status(200).render('pages/users/edit-user.ejs', {
          messages: req.flash('info'),
          messagesError : req.flash('error'),
          user
        });
        return;
      }
    }).catch(function (err) {
      const userExistsCode = "23505";
      if (err.code === userExistsCode) {
        req.flash("info", "User already exists");
      } else {
        console.log("There was a system error", err)
        req.flash('info', 'There was a system error. Please notify support.')
        res.status(200).render('pages/users/edit-user.ejs', { 
          messages: req.flash('info'),
          messagesError : req.flash('error'),
          user
        })
        return;
      }
      res.status(200).render('pages/users/edit-user.ejs', { 
        messages: req.flash('info'),
        messagesError : req.flash('error'),
        user
      });
      return;
    }).catch(function(err){
      console.log('err :', err);
      console.log("There was a system error", err)
      req.flash('info', 'There was a system error. Please notify support.')
    })
    return;
  })
});

userRoutes.get('/admin', (req, res) => {
  res.status(200).render('pages/users/admin.ejs', {
    messages: req.flash("info"),
    messagesError : req.flash('error'),
    ckeditorData: req.body.ckeditorHTML || ""
  });
});


userRoutes.post('/admin', (req, res) => {
  res.status(200).render('pages/users/admin.ejs', {
    messages: req.flash("info"),
    messagesError : req.flash('error'),
    ckeditorData: req.body.ckeditorHTML || ""
  });
});

userRoutes.get('/logout', logins.logUserOut, (req, res) => { 
  req.flash('info','You have been logged out');
  res.status(200).redirect('/login');
  return;
});


const checkUserID = [
  param('user_id').isInt()
]

userRoutes.get('/edit-user/:user_id', checkUserID, (req, res) => { //accessible by authed admin
  errors = validationResult(req);
  console.log('errors.array() :', errors.array());
  if (!errors.isEmpty()){
    req.flash('info', 'Invalid user ID');
    res.status(200).redirect('/users/dashboard');
    return;
  }

  // check if user isAdmin ? or is user_id === req.session.userId
  getUserById(req.params.user_id).then(function(user){
    if (!user.length > 0) { // handle no user by that id
      req.flash('info', 'No user by that ID');
      res.status(200).redirect('/users/dashboard');
      return;
    }
    getIsUserAdmin(req.session.user_id)
    .then(function(currentUser){
      userRow = user[0];
      console.log('userRow :', currentUser);
      if (req.session.user_id === userRow.user_id || currentUser[0].is_admin) {
        res.status(200).render('pages/users/edit-user.ejs', {
          messages: req.flash('info'), 
          messagesError : req.flash('error'),
          user : userRow
        });
        return;
      }
      req.flash('info', 'You are not authorised to modify user');
      res.status(200).redirect('/users/dashboard');
      return;
    })
  })
  // confirm page for deleting user. only accessible by authenticated admin.
});


const editUserPostCheck = [
  body('user_id').isInt(),
  body('first_name').trim().matches(/^[\w -]+$/),
  body('last_name').trim().matches(/^[\w -]+$/),
  body('is_admin').matches(/on|/) // match either "on" or nothing
]

userRoutes.post('/edit-user', editUserPostCheck , function(req, res){
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('errors.array() :', errors.array());
    req.flash('info','Invalid credentials');
    res.status(200).redirect('/users/dashboard');
    return;
  }
  const adminSelected = req.body.is_admin === 'on' ? true : false 
  const userData = getUserById(req.body.user_id)
  const isUserAdmin = getIsUserAdmin(req.session.user_id)
  Promise.all([userData, isUserAdmin])
  .then(function(values){
    user = values[0][0];
    console.log('user :', user);
    console.log('userAdmin[0].is_admin :', values[1][0].is_admin);
    if (values[1][0].is_admin != true && user.user_id != req.session.user_id){
      req.flash('error', 'You are not authorised to edit this user');
      res.status(200).redirect(`/users/edit-user/${req.body.user_id}`);
      return;
    } // if user is the same user being edited or user is super admin
    let userUpdate = {
      user_id : req.body.user_id,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      is_admin: values[0][0].is_admin
    }
    if(values[1][0].is_admin){ // Only a super admin can grant super admin rights
      userUpdate.is_admin = user.is_admin ? true : adminSelected // This stops and admin removing someone elses admin rights. Currently a non reversible process without direct access to the db. 
    }
    updateUserName(userUpdate)
    .then(function(response){
      console.log('response :', response);
      if (response){
        req.flash('info', 'User updated');
        res.status(200).redirect(`/users/edit-user/${req.body.user_id}`);
        return;
      }
    })
  }).catch(function(err){
    console.log('err :', err);
    req.flash('info','User not updated. There was an error');
    res.status(200).redirect('/users/dashboard');
    return;
  })
})

deleteUserPostCheck = [
  param('user_id').isInt().exists()
]

userRoutes.delete('/delete-user/:user_id', deleteUserPostCheck, function(req, res){
  console.log("Hello World");
  console.log(req.params.user_id);
  let errors = validationResult(req);
  if (!errors.isEmpty()){
    console.log('invalid user id')
    // req.flash('error','Invalid user id');
    // res.status(200).redirect('/users/dashboard');
    res.status(200).send(JSON.stringify({ status: "FAILURE", message: 'Invalid user id', location: "/users/dashboard"}));
    return;
  }
  console.log('req.params.user_id :', req.params.user_id, req.session.user_id);
  if (req.params.user_id == req.session.user_id){
    console.log('cannot delete yourself')
    // req.flash('error','You are not authorised to delete yourself');
    // res.status(200).redirect('/users/dashboard');
    res.status(200).send(JSON.stringify({ status: "FAILURE", message: 'You cannot delete yourself. Please ask another admin to remove your account', location: "/users/dashboard" }));
    return;
  }
  console.log('req.session.user_id :', req.session.user_id);
  const location = "/users/dashboard"
  getIsUserAdmin(req.session.user_id)
  .then(function(userAdmin){
    console.log('req.session.user_id :', req.session.user_id);
    console.log('useradmin :', userAdmin);
    console.log("Is user admin?: ", userAdmin[0].is_admin);
    if (userAdmin[0].is_admin){ //check if user is admin or if user
      deleteUserById(req.params.user_id)
      .then(function(data){
        console.log('data :', data);
        if (data) {
          console.log('Successfully deleted')
          // run sql command orphan pages owned by user
          // req.flash('info','User deleted');
          // res.status(200).redirect('/users/dashboard');
         res.status(200).send(JSON.stringify({ status: "SUCCESS", message: 'User successfully deleted', location: location }));
          return;
        }
        // else {
        //   console.log('User does not exist')
        //   // req.flash('error','There was an error. User does not exist');
        //   // res.status(200).redirect('/users/dashboard');
        //   res.status(200).send(JSON.stringify({ status: "FAILURE", message: 'There was an error. User does not exist', location: location }));
        //   return;
        // }
      })
    } else {
    // req.flash('error','You are not authorised to delete users');
    // res.status(200).redirect('/users/dashboard');
    res.status(200).send(JSON.stringify({ status: "FAILURE", message: 'You are not authorised to delete users', location: location }));
    return;
    }
  }).catch(function(err){
    console.log('err :', err);
    // req.flash('error','There was a system error');
    // res.status(200).redirect('/users/dashboard');
    res.status(200).send(JSON.stringify({ status: "FAILURE", message: 'There was a system error. Please contact your administrator', location: location }));
    return;
  })
})

userRoutes.get('/change-password', (req, res) => {
  res.status(200).render('pages/users/changePassword.ejs', {
    messages: req.flash('info')
  });
});

////////////////// Change email whilst validated  //////////////////////

userRoutes.get('/change-email-request', (req, res) => {
  res.status(200).render('pages/users/change-email-request.ejs', {
    messages: req.flash('info'),
    messagesError : req.flash('error')
  });
});

changeEmailCheck = [

  body("password", "invalid password").isLength({
    min: 8
  }),
  body('confirm_new_email').isEmail().normalizeEmail(),
  body('new_email').isEmail().normalizeEmail()
  .custom((value, {
    req,
    loc,
    path
  }) => {
    if (value !== req.body.confirm_new_email) {
      throw new Error("Emails do not match");
    } else {
      return value;
    }
  })
];

userRoutes.post('/change-email-request', changeEmailCheck, (req, res) => {
  let errors = validationResult(req);
  console.log('errors.array() :', errors.array());
  if (!errors.isEmpty()) {
    const userTemp = {
      new_email: req.body.new_email || "",
      old_email: req.body.old_email || ""
    }
    req.flash("info", "Invalid user data", process.env.NODE_ENV === 'development' ? errors.array() : ""); //error.array() for development only
    res.status(200).render('pages/users/change-email-request.ejs', {
      title: 'Profile',
      messages: req.flash('info'),
      messagesError : req.flash('error'),
      userTemp
    }); // insert variable into form data
    return;
  }

  findEmailById(req.session.user_id)
  .then(function(userEmail){
    const user = {
      password: req.body.password,
      old_email: userEmail[0].email,
      new_email: req.body.new_email,
      email_change_token: uuid()
    }
    // console.log('user :', user);
    // console.log('userEmail :', userEmail);
    const location = '/users/change-email-request';
    insertOldEmailObject(user)
    .then(function (data) {
        if (!data) {
        res.status(200).send(JSON.stringify({ status: "FAILURE", message: 'Invalid credentials', location: location }));
        return;
      }
      
      let mail = new Mail();
      mail.sendEmailChangeVerificationLink(user);
      res.status(200).send(JSON.stringify({ status: "SUCCESS", message: 'An email has been send to your new email address with further instructions', location: location }));
    });
  }).catch(function (err) {
    console.log('err :', err);
    res.redirect('/users/dashboard');
    res.status(200).send(JSON.stringify({ status: "FAILURE", message: 'An internal error has occurred. Please contact your administrator', location: location }));
    
    return;
  })
});
  
/////////////  Upload tests with multer    ///////////////////


// userRoutes.get('/upload-images', function (req, res) {
//   res.status(200).render('pages/users/upload-images.ejs', {messages: req.flash('info'), messagesError : req.flash('error')})
// })


// userRoutes.post('/upload-images', upload.single('image'), (req, res) => {

//   console.log('req.body :', req.body, path.join(imageUploadLocation + req.fileLocation));
//   if (!req.file) {
//     req.flash('info', 'No file received');
//     res.status(200).redirect('/users/upload-images');
//     return;

//   } else {
//     req.flash('info', 'File received');
//     res.status(200).redirect('/users/upload-images')
//     return;
//   }
// })






//////////////////   Edit / Create Page  //////////////////

userRoutes.get('/edit-page', function (req, res) { //  with no id number this should just create a page
  let pdfList = [];
  fs.readdir('assets/pdfs', (err, pdfs) => {
    if (err) {
      console.log('err :', err);
    }
    if (!pdfs) {
      req.flash('error', 'No PDFs uploaded');
      res.status(200).render('pages/users/edit-page.ejs', {
      messages: req.flash('info'), 
      messagesError: req.flash('error'),
      pdfs : pdfList});
    return;
    }
    pdfs.map(function(pdf) { //refactor. two of these now
      console.log('pdfs :', pdf);
      const shortName = pdf.match(/([\w\s]*)/)[0] + ".pdf";  //remove the random number to make displaying prettier
      pdfList.push({name: pdf, short: shortName, location: `/pdfs/${pdf}`})
    })
    res.status(200).render('pages/users/edit-page.ejs', {messages: req.flash('info'), messagesError : req.flash('error'), pdfs : pdfList});
    return;
  })
})

const pageIDCheck = [
  param('link').exists()
]

userRoutes.get('/edit-page/:link', pageIDCheck, function (req, res) {
  let errors = validationResult(req);
  if (!errors.isEmpty() || !(/^[\w-]+$/g).test(req.params.link)) {
    req.flash('info', 'invalid pageID');
    res.status(200).redirect('/users/dashboard');
    return;
  }
  getPageByLink(req.params.link)
  .then(function(data){
    console.log('data :', data);
    if (data.length === 0) { // Check to make sure page data exists
      req.flash('info', 'No such page exists');
      res.status(200).redirect('/users/dashboard');
      return;
    }
    // data.ckeditor.html =  unescape(data.ckeditor.html);
    getUserById(req.session.user_id) /// Would probably be better with promise.all
    .then(function(userData){
      console.log(' owner id:',userData[0].is_admin != 'true' || req.session.user_id != data[0].owner_id, req.session.user_id ,data[0].created_by , userData[0].is_admin);
      if ( userData[0].is_admin != true && req.session.user_id != data[0].created_by && data[0].created_by != null) { // Check page ownership or admin
        req.flash('info', 'This is not your page to modify');
        res.status(200).redirect('/users/dashboard');
        return;  
      }
      let pdfList = [];
      fs.readdir('assets/pdfs', (err, pdfs) => {
        if (err) {
          console.log('err :', err);
        }
        if (!pdfs) {
          req.flash('error','No PDFs uploaded')
          res.status(200).render('pages/users/edit-page.ejs', { 
            messages: req.flash('info'),
            messagesError: req.flash('error'),
            pdfList: pdfList
          })
          return;
        }
        pdfs.map(function(pdf) { //refactor two of these now
          console.log('pdfs :', pdf);
          const shortName = pdf.match(/([\w\s]*)/)[0] + ".pdf";  //remove the random number to make displaying prettier
          pdfList.push({name: pdf, short: shortName, location: `/pdfs/${pdf}`})
        })
        data[0].href = `${urlConfig.url}/pages/${data[0].link}`
        res.status(200).render('pages/users/edit-page.ejs', {
          page: data[0], 
          messages: req.flash('info'), 
          messagesError : req.flash('error'), 
          pdfs : pdfList});
        return;
      })
    })
  }).catch(function(err){
    console.log('err :', err);
    req.flash('error', 'There was a system error. Please contact your administrator');
    res.status(200).render('pages/users/edit-page.ejs', {messages: req.flash('info'), messagesError : req.flash('error')});
    return;
  });
})

postCreatePageCheck = [
  body('title').matches(/^[\w ]+$/),
  body('content').exists(), // ensure sanitised in and out of db
  body('description').exists(),
  body('publish_page').optional().isBoolean(),
  sanitizeBody('description').trim().escape()
]

userRoutes.post('/create-page',  upload.single('image'), postCreatePageCheck, function(req, res){
  let errors = validationResult(req);
  console.log('create page post req.body :', req.body);
  req.body.content = sanitizeHtml(req.body.content, allowedCkeditorItems);
  let page = {
    created_by: req.session.user_id,
    last_edited_by: req.session.user_id,
    title: req.body.title,
    ckeditor_html: req.body.content,
    page_description: req.body.description,
    order_number: 1,
    is_published: req.body.publish_page ? true : false
    
  }
  console.log('errors.isEmpty :', errors.array(), "file present", req.file);
  if (!errors.isEmpty() || !req.file) { // check that a file has been uploaded
    console.log('errors.array() :', errors.array());
    req.flash('error','Invalid page data. Only a to Z and 0 to 9 are acceptable for page names and titles. Are you missing an image?');
    res.status(200).render('pages/users/edit-page', {messagesError: req.flash('error')});
    return;
  }
  
  // console.log('req.file :', req.file);
  page.link = req.body.title.trim().toLowerCase().replace(/[ ]/g, "-");
  page.banner_location = `/images/${req.file.filename}`
  let image = {
    banner_location: `/images/${req.file.filename}`,
    filename: req.file.filename,
    banner_image: true,
    uploaded_images: true,
    page_image: false
  }
  insertBannerImage(image)
  .then(function(){
    // req.flash('info', 'Image data inserted into db')
  }).catch(function(err){
    console.log('err :', err);
    req.flash('error', 'Failure adding image to db')
  })
  // console.log('req.file :', req.file);
  console.log('page :', page);
  // i would like page id from the db please
  createPage(page).then(function(data){
    console.log('data :', data);
    req.flash('info', 'Page created successfully');
    res.status(200).redirect('/users/dashboard');
    return;
  }).catch(function(err){
    console.log('catch error :', err.code);
    if (err.code === "23505") {
    req.flash('error', 'Title name already exists. Please use a different one');
    res.status(200).render(`pages/users/edit-page`, {messages: req.flash('error'), page : page}); 
    return;
    }
    req.flash('error', 'There was an error creating the page');
    res.status(200).render(`pages/users/edit-page`, {messages: req.flash('error'), page : page}); 
    return;
  })
});
postEditPageCheck = [
  body('title').matches(/^[\w ]+$/),
  body('content').exists(), // ensure sanitised in and out of db
  body('description').exists(),
  body('page_id').isInt(),
  body('publish_page').optional().isBoolean(),
  sanitizeBody('description').trim().escape()
]

userRoutes.post('/edit-page', postEditPageCheck, function(req, res){
  let errors = validationResult(req);
  let page = {
    created_by: req.body.created_by,
    title: req.body.title,
    ckeditor_html: req.body.content,
    page_description: req.body.description,
    order_number: 1,
    page_id: req.body.page_id,
    last_edited_by: req.session.user_id,
    last_edited_date: Date.now(),
    is_published: req.body.publish_page ? true : false
  }
  console.log('page :', page);
  // console.log('req.body :', req.body);
  if (!errors.isEmpty()) {
    console.log('errors.array() :', errors.array());
    req.flash('error','Invalid page data');
    res.status(200).render('pages/users/edit-page', {page : page});
    return;
  }
  page.link = req.body.title.trim().toLowerCase().replace(/[ ]/g, "-");
  console.log('page :', page);
   // i would like page id from the db please
  updatePageContentByIdNoBanner(page).then(function(data){
    req.flash('info', 'Page updated successfully');
    res.status(200).redirect(`/users/edit-page/${page.link}`); 
  }).catch(function(err){
    console.log('err :', err);
    req.flash('error', 'There was an error updating the page');
    res.status(200).render('pages/users/edit-page.ejs', {messages: req.flash('info'), page : page});
    
  })
});


deletePageCheck = [
  param('page_id').isInt().exists()
]

userRoutes.delete('/delete-page/:page_id', deletePageCheck, function(req, res){
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('req.params.page_id :', req.params.page_id);
    // req.flash('info', 'Invalid Page ID');
    // res.status(200).redirect('/users/dashboard');
    res.status(200).send(JSON.stringify({ status: "FAILURE", message: 'Invalid page id', location: "/users/dashboard" }));
    return;
  }
  console.log(req.params.page_id)
  console.log('req.session.user :', req.session.user_id);
  console.log(req.method);
  
  console.log(req.method);
  getPagebyID(req.params.page_id)
  .then(function(pageData){
    getUserById(req.session.user_id)
    .then(function(userData){
      if (pageData.created_by === req.session.user_id || userData[0].is_admin){
        deletePageById(req.params.page_id)
        .then(function(data){
          if (data) {
            // req.flash('info', 'Page deleted');
            // req.method = "GET";
            // res.status(301).redirect('/users/dashboard');
            req.flash('info', 'Page deleted');
            res.status(200).send(JSON.stringify({ status: "SUCCESS", message: 'Page successfully deleted', location: "/users/dashboard" }));
            return;
          } else {
            // req.flash('info', 'Error. Page not deleted. Please contact your administrator');
            // req.method = "GET";
            // res.status(301).redirect('/users/dashboard');
            res.status(200).send(JSON.stringify({ status: "FAILURE", message: 'No page to delete', location: "/users/dashboard" }));
            return;
          }
        })
      } else {
        // req.flash('info', 'You are not authorised to delete this page');
        // req.method = "GET";
        // res.status(301).redirect('/users/dashboard');
        res.status(200).send(JSON.stringify({ status: "FAILURE", message: 'You are not authorised to delete this page.', location: "/users/dashboard"}));
        return;
      }
    })
  }).catch(function(err){
    console.log('err :', err);
    res.status(200).send(JSON.stringify({ status: "FAILURE", message: 'There was a system error. Please contact your administrator.', location: "/users/dashboard" }));
  })
})

userRoutes.post('/upload-file', fileUpload.single('upload'), function(req, res){
  console.log('req.file :', req.file);
  let image = {
    banner_location: `/images/${req.file.filename}`,
    filename: req.file.filename,
    banner_image: false,
    uploaded_images: true,
    page_image: true
  }
  createImageObjComplete(image)
  .then(function(){
    res.json({
      "uploaded": 1,
      "fileName": req.file.filename,
      "url": `/images/${req.file.filename}` //this is the response ckeditor requires to immediately load the image and provide a positive message
    })
  }).catch(function(err) {
    res.json({
      "uploaded": 0,
      "error": {
        "message": `There was an error uploading the file, err: ${err}`
      }
    })
  })
});


////  End of pages //////////////


userRoutes.get('/get-server-images', function(req, res){  // This supplies ckeditor with public images on the server in the form of json
  fs.readdir('assets/images', (err, images) => {
    let imagesJSON = [];
    images.map(function(image) {
      console.log('images :', image);
      imagesJSON.push({image: "/images/" + image, thumb: "/images/" + image, folder: "Large"})
    })
    imagesJSON = JSON.stringify(imagesJSON);
    console.log('imagesJSON :', imagesJSON);
    res.send(imagesJSON);
  })
})

userRoutes.post('/save-order', function(req,res){

  if (!Number.isInteger(parseInt(req.body.pageId)) || typeof req.body.isPublished != 'boolean' || typeof req.body.isHomePageGrid != 'boolean' || !Number.isInteger(parseInt(req.body.pageOrderNumber))) { // cannot get the json body to work with express validator 5
    console.log('failed :');
    req.flash('error', 'Invalid Page Data');
    res.status(200).redirect('/users/dashboard');
    return;
  }
  console.log('req.body :', req.body);
  const page = {
    page_id: parseInt(req.body.pageId),
    is_published: req.body.isPublished,
    order_number: parseInt(req.body.pageOrderNumber),
    is_homepage_grid: req.body.isHomePageGrid,
    is_nav_menu : false
  }

  updatePageLocationsById(page)
  .then(function(data){
    console.log('successfull :', data);
    req.flash('info', 'Save order updated');
    res.status(200).redirect('/users/dashboard');
    return;
  }).catch(function(err){
    console.log('err :', err);
    req.flash('error', 'There was an error');
    res.status(200).redirect('/users/dashboard');
    return;
  })
 })

userRoutes.get('/manage-users', function(req, res){
  getIsUserAdmin(req.session.user_id)
  .then(function(isAdmin){
    if (!isAdmin) {
      req.flash('error', 'You are not authorised to access the manage users page')
      res.status(200).redirect('/users/dashboard')
      return;
    }
    getUnverifiedUsers()
    .then(function(users){
      console.log(users)
      res.status(200).render('pages/users/manage-users', { unverifiedUsers: users})
    });
  });
})

userRoutes.use(function(error, req, res, next) { // this is the express default error handler being used for multer erorrs
  console.log('error :', req.url, error);
  switch (req.url) {
    case ('/manage-images'):
      req.flash('error', `image not uploaded as the file size is greater than ${imageUploadSizeLimit / 1000}KB or is the wrong type of file`);
      res.status(200).redirect('/users/manage-images');
      break;

    case ('/manage-pdfs'):
      req.flash('error', `PDF not uploaded as file size greater than ${pdfUploadSizeLimit / 1000000}MB or is the wrong type of file`);
      res.status(200).redirect('/users/manage-pdfs');
      break;

    case ('/create-page'):
      res.json({
        "uploaded": 0,
        "error": {
          "message": `image not uploaded as the file size is greater than ${imageUploadSizeLimit / 1000}KB or is the wrong type of file`
        }
      })
    break;

    case ('/edit-page'):
      res.json({
        "uploaded": 0,
        "error": {
          "message": `image not uploaded as the file size is greater than ${imageUploadSizeLimit / 1000}KB or is the wrong type of file`
        }
      })
    break;
    
    case ('/upload-file'):
      res.json({
        "uploaded": 0,
        "error": {
          "message": `image not uploaded as the file size is greater than ${imageUploadSizeLimit / 1000}KB or is the wrong type of file`
        }
      })
    break;
    
    case ('/update-banner'):
    console.log('error :', error);
      getPagebyID(req.body.page_id)
      .then(page => {
        console.log('page in error :', page);
        req.flash('error', `image not uploaded as the file size is greater than ${imageUploadSizeLimit / 1000}KB or is the wrong type of file`);
        res.status(200).redirect(`/users/edit-page/${page[0].link}`); // redirect back to the page being edited
      }).catch(err => {
        req.flash('error', 'invalid page')
        res.status(200).redirect('/users/dashboard')
      })
    break;

    default:
    console.log('error :', error);
    req.flash('error', 'something broke');
    res.status(200).redirect(`/users/edit-page/${page[0].link}`); // redirect back to the page being edited
  }
});
 userRoutes.all('*', (req, res) => {
  res.status(200).render('pages/public/unknown.ejs', {
    url: req.url
  });
  return;
});

module.exports = userRoutes;