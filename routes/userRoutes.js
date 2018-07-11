const fs = require('fs');
const express = require('express');
const userRoutes = new express.Router();
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
  getPagebyID,
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
  createParentNavItem,
  createChildNavItem,
  getParentNavIdByName,
  getAllNavs
} = require('../server/models/navigations')
const {toNavJSON} = require('../helperFunctions/query/navJson')
const { 
  insertCallToAction
} = require('../server/models/callActions');
const uuid = require('uuid/v1');
const Mail = require('../helperFunctions/verification/MailSender');
const multer = require('multer');
const imageUploadLocation = './assets/images/';
const PDFUploadLocation = './assets/pdfs/';
const path = require('path');
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imageUploadLocation)
  },
  filename: function (req, file, next) {
    const ext = file.mimetype.split('/')[1];
    req.fileLocation = 'image' + '-' + Date.now() + '.' + ext
    next(null, req.fileLocation);
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

let storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imageUploadLocation)
  },
  filename: function (req, file, next) {
    const ext = file.mimetype.split('/')[1];
    req.fileLocation = 'image' + '-' + Date.now() + '.' + ext
    next(null, req.fileLocation);
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

let storagePDF = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, PDFUploadLocation)
  },
  filename: function (req, file, next) {
    const ext = file.mimetype.split('/')[1];
    file.fieldname = `${req.body.title}-${file.fieldname}`;
    req.fileLocation = file.fieldname + '-' + Date.now() + '.' + ext
    next(null, req.fileLocation);
  },
  fileFilter: function (req, file, next) {
    if (!file) {
      console.log('nofile :');
      next();
    }
    // const pdf = file.mimetype.startsWith('application/pdf')

    if (pdf) {
      console.log('PDF uploaded');
      next(null, true);
    } else {
      console.log("file not supported");
      //TODO:  A better message response to user on failure.
      return next();
    }
  }
});

const crypto = require('crypto');
// crypto.pseudoRandomBytes(16, function(err, raw) {
//   if (err) return callback(err);

//   callback(null, raw.toString('hex') + path.extname(file.originalname));
// });

const upload = multer({
  storage: storage
});

const fileUpload = multer({
  storage: storage2
});

const PDFUpload = multer({
  storage: storagePDF
});

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
  listAllUsers()
  .then(function(userData){
    getAllPages() 
    .then(function(pageData){
      res.status(200).render('pages/users/dashboard.ejs', { 
        users : userData,
        pages : pageData,
        messages: req.flash('info')
      })
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
    req.flash('info', 'Invalid ckeditor data');
    res.status(200).redirect('users/dashboard.ejs') 
    return;
  }
  req.body.content = sanitizeHtml(req.body.content, allowedCkeditorItems);
  insertCallToAction(req.body.content)
  .then(function(){
    req.flash('info', 'Call to action text saved');
    res.status(200).redirect('/users/dashboard');
  })
})

/////////////////////// Admin page routes /////////////////////

userRoutes.get('/manage-nav', function (req, res) {
  getAllPages()
  .then(function(items){
    console.log('items :', items);
    res.status(200).render('pages/users/manage-nav.ejs', { 
      messages: req.flash('info'),
      subMenuList: items
    })
  })
})

userRoutes.post('/manage-nav', function(req,res){
  if (!req.body.parent_page){
    //req is for parent nav if it does not contain
    //a parent_page value
 nav = {
   name:req.body.page_name,
   link:req.body.menu_page,
   nav_order_number:req.body.page_order
 }
 
 createParentNavItem(nav).then(response => {
   res.status(200).send('parent nav created')
 }).catch(e => {
   res.status(400).send(e.stack)
 })
}else{
 nav = {
   name:req.body.page_name,
   link:req.body.menu_page,
   grid_order_number:req.body.page_order,
   parent_name: req.body.parent_page
 }
 getParentNavIdByName(nav.parent_name).then(response => {
   createChildNavItem(nav, response[0].navigation_id).then(response => {
     res.status(200).send('child nav created')
   }).catch(e => {
     res.status(400).send(e.stack)
   })
 })
 
}
})

userRoutes.get('/manage-pdfs', function (req, res) {
  // messages: req.flash('Are you sure you want to delete this PDF?') // This will not work. Flash messages are in the form req.flash('flashtype', 'Message') "Kristian"
  let pdfList = [];
  fs.readdir('assets/pdfs', (err, pdfs) => {
    if (err) {
      console.log('err :', err);
    }
      pdfs.map(function(pdf) {
      console.log('pdfs :', pdf);
      const shortName = pdf.match(/([\w\s]*)/)[0] + ".pdf";  //remove the random number to make displaying prettier
      pdfList.push({name: pdf, short: shortName, location: `/pdfs/${pdf}`})
    })
    console.log('pdfList :', pdfList);
    res.status(200).render('pages/users/manage-pdfs.ejs', { 
      messages: req.flash('info'),
      messagesError: req.flash('error'),
      pdfList: pdfList
    })
  })
})

PDFPostTitleCheck = [
  body('title').isAlphanumeric()
]

userRoutes.post('/manage-pdfs', PDFPostTitleCheck, PDFUpload.single('pdf'), function (req, res) {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('info', 'Invalid Title');
    res.status(200).redirect('/users/manage-pdfs');
    return;
  }
  // console.log('req.file :', req.file);
  req.flash('info', 'PDF Uploaded')
  res.status(200).redirect('users/manage-pdfs.ejs', { 
  })
  .catch(function(err){
    req.flash('error', 'There was an error uploading this pdf. Please try again or contact your administrator')
    res.status(200).redirect('/users/manage-pdfs');
  })
})

PDFDeleteCheck = [
  param('pdf_name').matches('^[\\w\\s-.]+$')
]

userRoutes.delete('/manage-pdfs/:pdf_name', PDFDeleteCheck, function(req, res){
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('errors.array() :', errors.array());
    res.status(200).json({ status: "FAILURE", message: 'Invalid PDF name', location: "/users/manage-pdfs" });
    return;
  }
  console.log('req.params :', req.params);
  fs.unlink(`assets/pdfs/${req.params.pdf_name}`, function(err){
    if (err) {
      console.log('err :', err);
      res.status(200).json({ status: "FAILURE", message: 'There was an error deleting the PDF file', location: "/users/manage-pdfs" });
      return;
    }
    res.status(200).json({ status: "SUCCESS", message: 'PDF successfully deleted', location: "/users/manage-pdfs" });
    return;
  })
});


userRoutes.get('/manage-images', function(req, res){
  getAllImagesData(req.params.image_id)
  .then(function(data){
    console.log('data :', data);
    if(!data || data.length === 0) {
      req.flash('info', 'No images');
      res.status(200).render('pages/users/manage-images', { message: req.flash('info'), messagesError: req.flash('error') } );
      return;
    }
    req.flash('info', 'No images');
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


userRoutes.get('/profile', function (req, res) {
  res.status(200).render('pages/users/profile.ejs', { 
    messages: req.flash('info')
  })
})

userRoutes.get('/edit-page', function (req, res) { //  with no id number this should just create a page
  let pdfList = [];
  fs.readdir('assets/pdfs', (err, pdfs) => {
    if (err) {
      console.log('err :', err);
    }
    pdfs.map(function(pdf) { //refactor two of these now
      console.log('pdfs :', pdf);
      const shortName = pdf.match(/([\w\s]*)/)[0] + ".pdf";  //remove the random number to make displaying prettier
      pdfList.push({name: pdf, short: shortName, location: `/pdfs/${pdf}`})
    })
    req.flash('info', 'Page ready for editing');
    res.status(200).render('pages/users/edit-page.ejs', {messages: req.flash('info'), pdfs : pdfList});
    return;
  })
})

const pageIDCheck = [
  param('page_id').isInt()
]

userRoutes.get('/edit-page/:page_id', pageIDCheck, function (req, res) {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('info', 'invalid pageID');
    res.status(200).redirect('/users/dashboard');
    return;
  }

  let pageID = parseInt(req.params.page_id);
  getPagebyID(pageID)
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
      if (!(userData[0].is_admin || req.session.user_id === data[0].owner_id)) { // Check page ownership or admin
        req.flash('info', 'This is not your page to modify');
        res.status(200).redirect('/users/dashboard');
        return;  
      }
      let pdfList = [];
      fs.readdir('assets/pdfs', (err, pdfs) => {
        if (err) {
          console.log('err :', err);
        }
        pdfs.map(function(pdf) { //refactor two of these now
          console.log('pdfs :', pdf);
          const shortName = pdf.match(/([\w\s]*)/)[0] + ".pdf";  //remove the random number to make displaying prettier
          pdfList.push({name: pdf, short: shortName, location: `/pdfs/${pdf}`})
        })
        req.flash('info', 'Page ready for editing');
        res.status(200).render('pages/users/edit-page.ejs', {page: data[0], messages: req.flash('info'), pdfs : pdfList});
        return;
      })
    })
  }).catch(function(err){
    console.log('err :', err);
    req.flash('error', 'There was a system error. Please contact your administrator');
    res.status(200).render('pages/users/edit-page.ejs', {messages: req.flash('info')});
    return;
  });
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
    email: req.session.email,
    old_password: req.body.old_password,
    new_password: req.body.new_password
  }

  updatePassword(user)
    .then(function (data) {
      if (!data) {
        console.log("failed to update password");
        req.flash('info', 'Invalid credentials');
        res.status(200).render('pages/users/change-password', {
          messages: req.flash('info')
        });
        return;
      }
      let mail = new Mail();
      mail.sendPasswordChangeConfirmation(user);
      req.logOut();
      req.flash('info', 'Password updated. Please login with your new password');
      res.status(200).redirect('/login');
      return;
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


userRoutes.get('/:name-user', function (req, res) {  /// this user parameter is not sanitised...?
  const url = req.url;
  res.status(200).render('pages/users/edit-user.ejs', { 
    messages: url === "/edit-user" ? req.flash('Are you sure you want to delete this USER?') : ''
  })
})

const createUserCheck = [
  body('email').isEmail().normalizeEmail(),
  body('first_name').trim().isAlphanumeric(),
  body('last_name').trim().isAlphanumeric()
];


userRoutes.post('/create-user', createUserCheck, (req, res) => { //accessible by authed admin

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('ERROR', error)
    const userTemp = {
      email: req.body.email || "",
      first_name: req.body.first_name || "",
      lastName: req.body.last_name || ""
    }
    req.flash("info", "Invalid user data", process.env.NODE_ENV === 'development' ? errors.array() : ""); //error.array() for development only
    res.status(200).render('pages/users/edit-user.ejs', {
      messages: req.flash('info'),
      userTemp
    });
    return;
  }

  const user = {
    email: req.body.email,
    last_failed_login: "",
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    failed_login_attempts: 0,
    activation_token: uuid()
  };
  createUser(user).then(function (userCreated) { // returns user created true or false
    if (userCreated) {
      let mail = new Mail;
      mail.sendVerificationLink(user);
      req.flash('info', 'user created and email sent'); // email not currently being sent
      res.redirect('/users/dashboard');
      return;
    } else {
      console.log("There was a create user error", err)
      req.flash('info', 'There was an error creating this user. Please try again. If you already have please contact support.')
      res.status(200).render('pages/users/edit-user.ejs', {
        messages: req.flash('info'),
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
      req.flash('info', 'There was an system error. Please notify support.')
    }
    res.status(200).render('pages/users/edit-user.ejs', { 
      messages: req.flash('info'),
      user
    });
  })
  return;
});

userRoutes.get('/admin', (req, res) => {
  res.status(200).render('pages/users/admin.ejs', {
    messages: req.flash("info"),
    ckeditorData: req.body.ckeditorHTML || ""
  });
});


userRoutes.post('/admin', (req, res) => {
  res.status(200).render('pages/users/admin.ejs', {
    messages: req.flash("info"),
    ckeditorData: req.body.ckeditorHTML || ""
  });
});

userRoutes.get('/logout', logins.logUserOut, (req, res) => { 
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
    userRow = user[0];
    console.log('userRow :', userRow);
    if (userRow.is_admin || req.session.user_id === userRow.user_id) {
      console.log('userRow.first_name :', userRow.first_name, userRow.is_admin || req.session.user_id === userRow.user_id);
      req.flash('info', 'Modifying user(Flash test)');
      res.status(200).render('pages/users/edit-user.ejs', {
        messages: req.flash('info'), 
        user : userRow
      });
      return;
    }
    req.flash('info', 'You are not authorised to modify user');
    res.status(200).redirect('/users/dashboard');
    return;
  })
  // confirm page for deleting user. only accessible by authenticated admin.
});


editUserPostCheck = [
  body('user_id').isInt(),
  body('first_name').trim().isAlphanumeric(),
  body('last_name').trim().isAlphanumeric()
]

userRoutes.post('/edit-user', editUserPostCheck , function(req, res){
  let errors = validationResult(req);
  if (!errors.isEmpty()){
    req.flash('info','Invalid credentials');
    res.status(200).redirect('/users/dashboard');
  }
  getUserById(req.body.user_id)
  
  .then(function(user){
    user = user[0];
    console.log('user :', user);
    getIsUserAdmin(req.session.user_id)
    .then(function(userAdmin){
      if (userAdmin.is_admin || user.user_id === req.session.user_id){ // if user is the same user being edited or user is super admin
        updateUserName(req.body)
        .then(function(response){
          console.log('response :', response);
          if (response){
            req.flash('info', 'User updated');
            res.status(200).redirect('/users/dashboard');
            return;
          }
        }).catch(function(err){
          console.log('err :', err);
          req.flash('info','User not updated. There was an error');
          res.status(200).redirect('/users/dashboard');
          return;
        })
      }
    })
  })
})

deleteUserPostCheck = [
  param('user_id').isInt().exists()
]

userRoutes.delete('/delete-user/:user_id', deleteUserPostCheck, function(req, res){
  console.log("Hello World");
  let errors = validationResult(req);
  if (!errors.isEmpty()){
    console.log('invalis :');
    // req.flash('error','Invalid user id');
    // res.status(200).redirect('/users/dashboard');
    res.json({ status: "FAILURE", message: 'Invalid user id', location: "/users/dashboard"});
    return;
  }
  if (req.params.user_id === req.session.user_id){
    // req.flash('error','You are not authorised to delete yourself');
    // res.status(200).redirect('/users/dashboard');
    res.json({ status: "FAILURE", message: 'You are not authorised to delete yourself', location: "/users/dashboard" });
    return;
  }
  console.log('req.session.user_id :', req.session.user_id);
  getIsUserAdmin(req.session.user_id)
  .then(function(userAdmin){
    console.log('req.session.user_id :', req.session.user_id);
    console.log('useradmin :', userAdmin);
    if (userAdmin.is_admin){ //check if user is admin or if user
      deleteUserById(req.body.user_id)
      .then(function(data){
        console.log('data :', data);
        if (data) {
          // run sql command orphan pages owned by user
          // req.flash('info','User deleted');
          // res.status(200).redirect('/users/dashboard');
          res.json({ status: "SUCCESS", message: 'User successfully deleted', location: "/users/dashboard" });
          return;
        }
        // req.flash('error','There was an error. User does not exist');
        // res.status(200).redirect('/users/dashboard');
        res.json({ status: "FAILURE", message: 'There was an error. User does not exist', location: "/users/dashboard" });
        return;
      })
      // req.flash('error','You are not authorised to delete users');
      // res.status(200).redirect('/users/dashboard');
      res.json({ status: "FAILURE", message: 'You are not authorised to delete users', location: "/users/dashboard" });
      return;
    }
  }).catch(function(err){
    console.log('err :', err);
      // req.flash('error','There was a system error');
      // res.status(200).redirect('/users/dashboard');
      res.json({ status: "FAILURE", message: 'There was a system error. Please contact your administrator', location: "/users/dashboard" });
      return
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
    messages: req.flash('info')
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
      throw new Error("Passwords don't match");
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
      userTemp
    }); // insert variable into form data
    return;
  }

  findEmailById(req.session.user_id)
  .then(function(user){
    user = {
      password: req.body.password,
      old_email: req.session.email,
      new_email: req.body.new_email,
      email_change_token: uuid()
    }
  })
  .then(function(){
    insertOldEmailObject(user)
    .then(function (data) {
        if (!data) {
        req.flash('info', 'Invalid credentials')
        res.status(200).redirect('/users/change-email-request.ejs');
        return;
      }
      let mail = new Mail();
      mail.sendEmailChangeVerificationLink(user);
      req.flash('info', "An email has been sent to your new email with further instructions");
      res.redirect('/users/dashboard');
    });
  }).catch(function (err) {
    req.flash('info', "An internal error has occurred. Please contact your administrator");
    res.redirect('/users/dashboard');
    return;
  })
});
  
/////////////  Uploads with multer    ///////////////////


userRoutes.get('/upload-images', function (req, res) {
  res.status(200).render('pages/users/upload-images.ejs', {messages: req.flash('info')})
})


userRoutes.post('/upload-images', upload.single('image'), (req, res) => {
  console.log('req.body :', req.body, path.join(imageUploadLocation + req.fileLocation));
  if (!req.file) {
    req.flash('info', 'No file received');
    res.status(200).redirect('/users/upload-images');
    return;

  } else {
    req.flash('info', 'File received');
    res.status(200).redirect('/users/upload-images')
    return;
  }
})




userRoutes.get('/page-navmenu-request', function (req, res) {
 
  // const pages = [{
  //     page: "Home",
  //     link: "Home",
  //     order: "1",
  //     children: null
  //   },
  //   {
  //     page: "About",
  //     link: "About",
  //     order: "2",
  //     children: null
  //   },
  //   {
  //     page: "Workshops",
  //     link: "no-link",
  //     order: "3",
  //     children: [{
  //         page: "Private Sessions",
  //         link: "Private sessions",
  //         order: "1"
  //       },
  //       {
  //         page: "Nursery Level",
  //         link: "Nursery level",
  //         order: "2"
  //       },
  //       {
  //         page: "Small Groups",
  //         link: "Small groups",
  //         order: "3"
  //       },
  //       {
  //         page: "Weekly Classes",
  //         link: "Weekly classes",
  //         order: "4"
  //       }
  //     ]
  //   },
  //   {
  //     page: "Contact",
  //     link: "Contact",
  //     order: "4",
  //     children: null
  //   },
  //   {
  //     page: "Another Page",
  //     link: "no-link",
  //     order: "3",
  //     children: [{
  //         page: "New Sessions",
  //         link: "New sessions",
  //         order: "1"
  //       },
  //       {
  //         page: "New Level",
  //         link: "New level",
  //         order: "2"
  //       },
  //       {
  //         page: "New Groups",
  //         link: "New groups",
  //         order: "3"
  //       },
  //       {
  //         page: "New Classes",
  //         link: "New classes",
  //         order: "4"
  //       }
  //     ]
  //   }
  // ]
  // console.log('JSON.stringify :', JSON.stringify(pages));
  // res.status(200).send(JSON.stringify(pages));

//work on getAllNavs to return page as above

  getAllNavs().then(response => {
    const pages = toNavJSON(response)
    res.status(200).send(pages)
  }).catch(e => {
   res.status(400).send(e.stack)
 })
})

userRoutes.post('/page-navmenu-request', function(req,res){
    
})

postCreatePageCheck = [
  body('title').isAlphanumeric(),
  body('content').exists(), // ensure sanitised in and out of db
  body('description').isAlphanumeric(),
  body('publish_page').isBoolean()
]

userRoutes.post('/create-page', postCreatePageCheck, upload.single('image'), function(req, res){
  let errors = validationResult(req);
  req.body.content = sanitizeHtml(req.body.content, allowedCkeditorItems);
  let page = {
    created_by: req.session.user_id,
    last_edited_by: req.session.user_id,
    title: req.body.title,
    ckeditor_html: req.body.content,
    page_description: req.body.description,
    order_number: 1,
    is_published: req.body.publish_page
    
  }
  if (!errors.isEmpty || !req.file) { // check that a file has been uploaded
    req.flash('info','Invalid page data. Are you missing an image?');
    res.status(200).redirect('/users/edit-page', {page : page});
    return;
  }
  
  // console.log('req.file :', req.file);
  
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
    req.flash('info', 'Image data inserted into db')
  }).catch(function(err){
    console.log('err :', err);
    req.flash('info', 'Failure adding image to db')
  })
  // console.log('req.file :', req.file);
  console.log('page :', page);
  // i would like page id from the db please
  createPage(page).then(function(data){
    console.log('data :', data);
    req.flash('info', 'Page created successfully');
    res.status(200).redirect('/users/dashboard');
  }).catch(function(err){
    req.flash('info', 'There was an error creating the page');
    res.status(200).render('pages/users/edit-page.ejs', {messages: req.flash('info'), page : page});
    
  })
});
postEditPageCheck = [
  body('title').isAlphanumeric(),
  body('content').exists(), // ensure sanitised in and out of db
  body('description').isAlphanumeric(),
  body('user_id').isInt(),
  body('page_id').isInt()
]

userRoutes.post('/edit-page', postEditPageCheck, function(req, res){
  let errors = validationResult(req);
  page = {
    created_by: req.body.created_by,
    title: req.body.title,
    ckeditor_html: req.body.content,
    page_description: req.body.description,
    order_number: 1,
    page_id: req.body.page_id,
    last_edited_by: req.session.user_id,
    last_edited_date: Date.now()
  }
  console.log('page :', page);
  // console.log('req.body :', req.body);
  if (!errors.isEmpty) {
    req.flash('info','Invalid page data');
    res.status(200).redirect('/users/edit-page', {page : page});
    return;
  }
 
   // i would like page id from the db please
  updatePageContentByIdNoBanner(page).then(function(data){
    req.flash('info', 'Page updated successfully');
    res.status(200).redirect('/users/dashboard');
  }).catch(function(err){
    console.log('err :', err);
    req.flash('info', 'There was an error updating the page');
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
    res.json({ status: "FAILURE", message: 'Invalid page id', location: "/users/dashboard" });
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
            res.status(200).json({ status: "SUCCESS", message: 'Page successfully deleted', location: "/users/dashboard" });
            return;
          } else {
            // req.flash('info', 'Error. Page not deleted. Please contact your administrator');
            // req.method = "GET";
            // res.status(301).redirect('/users/dashboard');
            res.json({ message: 'Not deleted' });
            return;
          }
        })
      } else {
        // req.flash('info', 'You are not authorised to delete this page');
        // req.method = "GET";
        // res.status(301).redirect('/users/dashboard');
        res.status(400).json({ status: "FAILURE", message: 'You are not authorised to delete this page.', location: "/users/dashboard"});
        return;
      }
    })
  }).catch(function(err){
    console.log('err :', err);
    res.json({ status: "FAILURE", message: 'There was a system error. Please contact your administrator.', location: "/users/dashboard" });
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

const pageSavePostCheck = [
  check('pageId').isInt().exists,
  check('isPublished').isBoolean(),
  check('isNavMenuItem').isBoolean(),
  check('isHomePageGrid').isBoolean(),
  check('pageOrderNumber').isInt()
]

userRoutes.post('/save-order', function(req,res){

  if (!Number.isInteger(parseInt(req.body.pageId)) || typeof req.body.isPublished != 'boolean' || typeof req.body.isNavMenuItem != 'boolean' || typeof req.body.isHomePageGrid != 'boolean' || !Number.isInteger(parseInt(req.body.pageOrderNumber))) { // cannot get the json body to work with express validator 5
    console.log('failed :');
    req.flash('error', 'Invalid Page Data');
    res.status(200).redirect('/users/dashboard');
    return;
  }
  const page = {
    page_id: parseInt(req.body.pageId),
    is_published: req.body.isPublished,
    is_nav_menu: req.body.isNavMenuItem,
    order_number: parseInt(req.body.pageOrderNumber),
    is_homepage_grid: req.body.isHomePageGrid
  }

  updatePageLocationsById(page)
  .then(function(data){
    res.status(200).redirect('/users/dashboard');
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


 userRoutes.all('*', (req, res) => {
  res.status(200).render('pages/public/unknown.ejs', {
    url: req.url
  });
  return;
});

module.exports = userRoutes;