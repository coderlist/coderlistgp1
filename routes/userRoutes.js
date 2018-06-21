const express = require('express');
const userRoutes = new express.Router();
const passport = require('../auth/local');
const Logins = require('../helperFunctions/Logins');
const UserLocalsNavigationStyling = require('../helperFunctions/navigation-locals');
const userLocalsNavigationStyling = new UserLocalsNavigationStyling();
const MessageTitles = require('../helperFunctions/message-titles');
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
  sanitize
} = require('express-validator/filter');
const {
  updatePassword,
  updateUserEmail,
  insertOldEmailObject,
  listUsers
} = require('../server/models/users').user;
const {
  createPage,
  getPages,
  getPagebyID
} = require('../server/models/pages');
const uuid = require('uuid/v1');
const Mail = require('../helperFunctions/verification/MailSender');
const multer = require('multer');
const imageUploadLocation = './assets/images/';
const path = require('path');
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imageUploadLocation)
  },
  filename: function (req, file, next) {
    console.log(file);
    const ext = file.mimetype.split('/')[1];
    req.fileLocation = file.fieldname + '-' + Date.now() + '.' + ext
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

const crypto = require('crypto');
// crypto.pseudoRandomBytes(16, function(err, raw) {
//   if (err) return callback(err);

//   callback(null, raw.toString('hex') + path.extname(file.originalname));
// });

const upload = multer({
  storage: storage
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

userRoutes.get('/', (req, res) => {
  res.status(200).render('pages/users/dashboard.ejs', { 
  messages: req.flash('info')});
  return;
});

userRoutes.get('/dashboard', (req, res) => {
  listUsers(0, 9)
  .then(function(userData){
  getPages(9) //this need to be thought more about
  .then(function(pageData){
    res.status(200).render('pages/users/dashboard.ejs', { 
      users : userData,
      pages : pageData,
      messages: req.flash('info')
  })
}).catch(function(err){
  console.log('err :', err);
})
  
});
  return;
});


/////////////////////// Admin page routes /////////////////////

userRoutes.get('/manage-nav', function (req, res) {
  res.status(200).render('pages/users/manage-nav.ejs', { 
    messages: req.flash('info')
  })
})
userRoutes.get('/manage-pdfs', function (req, res) {
  res.status(200).render('pages/users/manage-pdfs.ejs', { 
    messages: req.flash('Are you sure you want to delete this PDF?')
  })
})
userRoutes.get('/profile', function (req, res) {
  res.status(200).render('pages/users/profile.ejs', { 
    messages: req.flash('info')
  })
})
// userRoutes.get('/:name-page', function (req, res) {
//   const url = req.url;
//   res.status(200).render('pages/users/edit-page.ejs', {
//     messages: url === "/edit-page" ? req.flash('Are you sure you want to delete this PAGE?') : ''
//   })
// })

userRoutes.get('/edit-page', function (req, res) { //  with no id number this should just create a page
  res.status(200).render('pages/users/edit-page.ejs', {messages: req.flash('info')})
})

const pageIDCheck = [
  param('page_id').isInt()
]

userRoutes.get('/edit-page/:page_id', pageIDCheck, function (req, res) {
  let errors = validationResult(req);
  let pageID = parseInt(req.params.page_id);
  console.log('page_id :', pageID);
  console.log('errors :', errors.array());
  if (!errors) {
    req.flash('info', 'invalid pageID');
    res.status(200).redirect('users/edit-page');
  }
  getPagebyID(pageID)
  .then(function(data){
    console.log('data :', data);
    if (data.length === 0) { // Check to make sure page data exists
      req.flash('info', 'No such page exists');
      res.status(200).redirect('/users/edit-page');
      return;
    }
    console.log('(!(req.session.isAdmin || req.session.email === data.created_by)) :', req.session.email, data[0].created_by,(!(req.session.isAdmin || req.session.email === data.created_by)));
    if (!(req.session.isAdmin || req.session.email === data[0].created_by)) { // Check page ownership or admin
      req.flash('info', 'This is not your page to modify');
      res.status(200).redirect('/users/edit-page');
      return;  
    }
    res.status(200).render('pages/users/edit-page.ejs', {page: data[0]});
    return;
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

userRoutes.get('/:name-user', function (req, res) {
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
    res.status(200).render('pages/users/create-user.ejs', {
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
      res.status(200).render('pages/users/create-user.ejs', {
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
    res.status(200).render('pages/users/create-user.ejs', { 
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

const ckeditorHTMLValidation = [
  sanitize('ckeditorHTML').escape().trim()
];

userRoutes.post('/admin', (req, res) => {
  console.log('req.body.ckeditorHTML:', req.body.ckeditorHTML);
  res.status(200).render('pages/users/admin.ejs', {
    messages: req.flash("info"),
    ckeditorData: req.body.ckeditorHTML || ""
  });
});

userRoutes.get('/logout', logins.isLoggedIn, logins.logUserOut, (req, res) => { //testing isLogged in function. To be implemented on all routes. Might be worth extracting as it's own mini express app route on /users/.
  res.status(200).redirect('/');
  return;
});


userRoutes.get('/edit-user', (req, res) => { //accessible by authed admin
  res.status(200).render('pages/users/edit-user.ejs', {
    user: req.body.userToDelete,
    messages: req.flash('info')
  });
  // confirm page for deleting user. only accessible by authenticated admin.
});

userRoutes.post('/delete-user', (req, res) => {
  // delete user.  only accessible by authenticated admin via delete user route. something in the post body perhaps. Discuss with colleagues if there is a better way to perform this confirmation
  return;
});

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


  user = {
    password: req.body.password,
    old_email: req.session.email,
    new_email: req.body.new_email,
    email_change_token: uuid()
  }
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
    req.flash("No file received");
    return res.status(200).redirect('/users/upload-images')

  } else {
    req.flash("File received");
    return res.status(200).redirect('/users/upload-images')
  }
})




userRoutes.get('/page-navmenu-request', function (req, res) {
  const pages = [{
      page: "Home",
      link: "Home",
      order: "1",
      children: null
    },
    {
      page: "About",
      link: "About",
      order: "2",
      children: null
    },
    {
      page: "Workshops",
      link: "no-link",
      order: "3",
      children: [{
          page: "Private Sessions",
          link: "Private sessions",
          order: "1"
        },
        {
          page: "Nursery Level",
          link: "Nursery level",
          order: "2"
        },
        {
          page: "Small Groups",
          link: "Small groups",
          order: "3"
        },
        {
          page: "Weekly Classes",
          link: "Weekly classes",
          order: "4"
        }
      ]
    },
    {
      page: "Contact",
      link: "Contact",
      order: "4",
      children: null
    },
    {
      page: "Another Page",
      link: "no-link",
      order: "3",
      children: [{
          page: "New Sessions",
          link: "New sessions",
          order: "1"
        },
        {
          page: "New Level",
          link: "New level",
          order: "2"
        },
        {
          page: "New Groups",
          link: "New groups",
          order: "3"
        },
        {
          page: "New Classes",
          link: "New classes",
          order: "4"
        }
      ]
    }
  ]
  console.log('JSON.stringify :', JSON.stringify(pages));
  res.status(200).send(JSON.stringify(pages));
})


userRoutes.post('/create-page', function(req, res){
  pageData = {
    created_by: req.session.user_id,
    title: req.body.title,
    ckeditorHTML: req.body.content,
    page_description: req.body.description,
    email: req.session.email,
    order_number: 1

  }
  
  // i would like page id from the db please
  createPage(pageData).then(function(data){
    req.flash('info', 'Page created successfully');
    res.status(200).redirect('/users/dashboard');
  }).catch(function(err){
    req.flash('info', 'There was an error creating the page');
    res.status(200).render('/pages/users/edit-page.ejs', {messages: req.flash('info'), page : pageData});
    
  })
});

//////////////         end of change email whilst validated ////////////////

userRoutes.all('*', (req, res) => {
  res.status(200).render('pages/public/unknown.ejs', {
    url: req.url
  });
  return;
});

module.exports = userRoutes;