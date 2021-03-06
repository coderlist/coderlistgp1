const routes = require('express').Router();
const { query, check, body, validationResult, param } = require('express-validator/check');
const Logins = require('../helperFunctions/logins');
const logins = new Logins();
const checkEmailAndToken = require('../helperFunctions/checkEmailAndToken');
const users = require('../server/models/users').user;
// basic //
const passport = require('../auth/local');
const Mail = require('../helperFunctions/verification/MailSender');
// site //
const { createUser, updateUserEmail, findIdByEmail, insertOldEmailObject, activateUser, addOneToFailedLogins, getOldPasswordObject, insertOldPasswordObject } = require('../server/models/users').user;
const {  
  getLatestCall 
} = require('../server/models/callActions');
const changePassword = require('../server/models/users').changePassword;
const { getPagesByHomePageGrid, getPagebyID, getPageByLink } = require('../server/models/pages');
const { getAllNavItemsWithLink } = require('../server/models/navigations');
const urlConfig = require('../environmentConfig');

const uuid = require('uuid/v1');
const _ = require('lodash');
const userRoutes = require('./userRoutes')



routes.use('/users/', userRoutes);  // all routes in here require authing


routes.get('/', (req, res) => {
  //get menu items from db maybe set this as some middleware
  // const menuItems = [ 
  //   {href:"test me one", name:"item 1"},
  //   {href:"test me two", name:"item 2"}
  // ]

  let navItems = getAllNavItemsWithLink();
  const pageItems = getPagesByHomePageGrid();
  const callToAction = getLatestCall();
  Promise.all([navItems, pageItems, callToAction])
  .then(function(values){
    values[0].forEach((item, index) => {
      if (item.parent_id) {
          //If there is a parent cycle through the data, find the parent and append the item to it's children.
          values[0].forEach(parent => {
              if (item.parent_id === parent.item_id) parent.children ? parent.children.push(item) : parent.children = [item];
          })
      }
    });
    
    //Remove each item that has a parent item as they are now in a collection
    values[0] = values[0].filter(item => !item.parent_id);
    values[0] = values[0].sort((a,b) => a.order_num < b.order_num ? -1 : a.order_num === b.order_num ? 0 : 1);
    values[0].map(item => {
      if (item.children) {
          item.children = item.children.sort((a,b) => a.order_num < b.order_num ? -1 : a.order_num === b.order_num ? 0 : 1);
      }
      return item;
    });
    console.log('menuItems :',  values[0]);
    res.status(200).render('pages/public/index', {
      callToAction: values[2][0], 
      menuItems: values[0],
      pages: values[1],
      url: urlConfig,
      messages: req.flash('info'),
      messagesError: req.flash('error') 
    })
    return;

  }).catch(function(err){
    console.log('err :', err);
    req.flash('error', 'There was an error');
    res.status(200).render('pages/public/broken', {
      messages: req.flash('info'),
      messagesError: req.flash('error') 
    });
    return;
  })
});


routes.get('/about', (req, res) => {
  res.status(200).render('pages/public/about');
  return;
});


routes.get('/contact', (req, res) => {
  res.status(200).render('pages/public/contactus');
  return;
});


// users //
///////////////   Login    //////////////////

routes.get('/login', (req, res) => {
  const sess = req.session
  if (req.isAuthenticated()){
    res.redirect('./users/dashboard');
    return;
  }
  
  console.log(sess.id)
  console.log(sess.cookie)
  // messagesInfo = req.flash('info') 
  // messagesError = req.flash('error');
  // messages = messagesInfo + messagesError;
  // console.log('messages :', messages,messagesInfo,);
  res.status(200).render('pages/public/login', { 
    title: 'Login', 
    messages: req.flash('info'),
    messagesError: req.flash('error')
  });
  // sess.destroy(function(err){
  //   console.log('cannot access session here')
  // })
  return;
});


const loginCheck = [
  check('email').isEmail().normalizeEmail(),
];

routes.post('/login', 
  loginCheck, 
  logins.failedLoginsCheck, 
  passport.authenticate('local', 
    { failureRedirect: '/login',
      failureFlash: true 
    }
  ), 
  function (req, res){
    findIdByEmail(req.body.email).then(function(data){
      console.log('data :', data);
      req.session.user_id = data[0].user_id;
      req.flash('info','Succesfully logged in');
      res.status(200).redirect("/users/dashboard");
      return;
    }).catch(function(err){ 
      req.flash('error','There was an error logging in. Please try again or contact your administrator');
      res.status(200).redirect("/login");
    return;
    })

  })


///////////////       Register User      //////////////////

//  This is the page the user has to enter a new password after clicking the activation link from their email

enterPasswordCheck = [
  query('token').exists().isUUID(),
  query('email').exists().isEmail().normalizeEmail()
];

routes.get('/enter-password', enterPasswordCheck, (req, res) => {
  let errors = validationResult(req);
  //console.log('req.query :', req.query);
  //console.log('errors :', errors.array());
  if (!errors.isEmpty()){
    req.flash('info', 'Invalid credentials. Please try again or contact your administrator');
    res.status(200).render('pages/public/enter-password.ejs', {messages : req.flash('info'), messagesError : req.flash('error'), title: "Enter Password" , user : {activation_token : req.body.activation_token, email : req.body.email}});
    return;
  }
  res.status(200).render('pages/public/enter-password.ejs', {messages: req.flash('info'), messagesError : req.flash('error'), title: "Enter Password", user : {activation_token : req.query.token, email : req.query.email}});
});

postEnterPasswordCheck = [
  body('activation_token').exists().isUUID(),
  body('email').exists().isEmail().normalizeEmail(),
  body("password", "invalid password")
  .isLength({ min: 8 })
  .custom((value,{req, loc, path}) => {
    if (value !== req.body.confirm_password) {
      throw new Error("Passwords don't match");
    } else {
      return value;
    }
  })
];

routes.post('/enter-password', postEnterPasswordCheck, (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()){
    req.flash('info', 'Invalid credentials. Please try again or contact your administrator');
    res.status(200).render(`pages/public/enter-password.ejs`, {messages : req.flash('info'), messagesError : req.flash('error'), user : {activation_token : req.body.token, email : req.body.email}});
    return;
  }
  const user = {
    email : req.body.email,
    activation_token : req.body.activation_token,
    password : req.body.password
  }
  console.log('USERR',user)
  console.log("gets here");
  users.activateUser(user).then(response => {
    console.log('RESPONSE', response)
    if (!response) {
      req.flash("info", "There was an error creating user. Please try again or contact your administrator");
      res.status(200).render('pages/enter-password.ejs', {messages: req.flash("info"), user : {activation_token : req.query.token, email : req.query.email}});
      return;
    } else {
      req.flash("info", "User created. Please login using your new password");
      req.logOut();
      res.status(200).redirect('/login');
      return;
    }
  }).catch(e =>  res.status(500).send(e.stack))   //handle error here
});

 /////////////////  reset Password //////////////


/// This is the page where a user who has forgotten their password and is not logged in can ask for a reset link.

routes.get('/reset-password-request', (req, res) => {
  // **create a page with two fields to enter email addresses
  // **ensure that emails both match before being able to post
  res.status(200).render('pages/public/reset-password-request', { title: 'Reset Password', messages : req.flash('info'), messagesError : req.flash('error')});
});  


requestResetPasswordCheck = [
  body('confirm_email').isEmail().trim().normalizeEmail(),
  body("email").isLength({min: 8})
  .isEmail().trim().normalizeEmail()
  .custom((value,{req, loc, path}) => {
    if (value !== req.body.confirm_email) {
      throw new Error("Emails don't match");
    } else {
      return value;
    }
  })
]

routes.post('/reset-password-request', requestResetPasswordCheck, (req, res) => {
  errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    console.log('first req.body :', req.body, errors.array());
    req.flash("info","Invalid email");
    res.status(200).render('pages/public/reset-password-request', {messages : req.flash('info'), messagesError : req.flash('error')});
    return;
  }
  const user = {
    forgot_password_token : uuid(),
    email : req.body.email
  }
  // console.log('req.body :', req.body);
  insertOldPasswordObject(user)
  .then(data => {
    if (!data) {
      req.flash("info","Further instructions have now been sent to the email address provided");
      res.status(200).render('pages/public/index.ejs', {messages : req.flash('info'), messagesError : req.flash('error')});
      return;
    } 
    else {
      let mail = new Mail();
      mail.sendPasswordReset(user);
      req.flash("info","Further instructions have now been sent to your email");
      res.status(200).redirect('/');
      return;
    }
  });
})

/////////   Change password with reset link //////////////////////

checkQueryResetPassword = [
  query('forgot_password_token').isUUID(),
  query('email').isEmail().normalizeEmail()
];



routes.get('/reset-password', checkQueryResetPassword, (req, res) => {
  // console.log('req.query :', req.query);
  user = {
    forgot_password_token : req.query.forgot_password_token,
    email : req.query.email
  }
  insertOldPasswordObject(user).then(response =>{
    res.status(200).render('pages/public/reset-password', {title: 'Reset Password', messages : req.flash('info'), messagesError : req.flash('error'), user : user});
  }).catch(e => res.status(500).send(e.stack))
  
});  

resetPasswordCheck = [
  body('email').isLength({min: 8}),
  body('forgot_password_token').isUUID(),
  body("password", "invalid password")
  .isLength({ min: 8 })
  .custom((value,{req, loc, path}) => {
    if (value !== req.body.confirm_password) {
      throw new Error("Passwords don't match");
    } else {
      return value;
    }
  })
]

routes.post('/reset-password', resetPasswordCheck, (req, res) => {
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log('errors :', errors.array());
    req.flash("info","Invalid credentials");
    res.status(200).render('pages/public/reset-password', {messages : req.flash('info'),messagesError : req.flash('error'), user : { email : req.body.email, forgot_password_token : req.body.forgot_password_token}});
    return;
  }
  const user = {
    email : req.body.email,
    new_password: req.body.password,
    forgot_password_token : req.body.forgot_password_token
  }
  getOldPasswordObject(user)
  .then(data => {
  //  console.log('data from getoldpasswordobject :', data);
    if (data.time_diff_bool) {
      console.log('expired')
      req.flash('info', 'Link expired');
      res.status(200).redirect('/reset-password-request')
      return;
    }
    changePassword(user)
    .then(() => {
      console.log('UPDATED')
      req.flash('info', 'Your password has been changed. Please login');
        res.status(200).redirect('/login');
        return;
    }).catch(e => res.status(500).send(e.stack) )
  }).catch(e => res.status(500).send(e.stack) )
})
  
  
 /// Change email ////////////

 verifyEmailCheckQuery = [
   query('old_email').isEmail().normalizeEmail(),
  query('email_change_token').isUUID(),
  query('new_email').isEmail().normalizeEmail()
];

routes.get('/verify-change-email', verifyEmailCheckQuery, (req, res) => { 
  errors = validationResult(req)
  // console.log('req.query :', req.query);
  const user = {old_email : req.query.old_email, new_email : req.query.new_email, email_change_token : req.query.email_change_token}
  if (!errors.isEmpty()) {
    req.flash("info","Invalid credentials. Please recheck authorisation link or contact your administrator");
    res.status(200).render('pages/public/verify-change-email', {title: 'Verify Email', messages : req.flash('info'), messagesError: req.flash('error'), user : user});
    return;
  }
  res.status(200).render('pages/public/verify-change-email.ejs', {title: 'Verify Email', messages : req.flash('info'), user : {email_change_token: req.query.email_change_token, old_email: req.query.old_email, new_email : req.query.new_email || "", email_change_token : req.query.email_change_token || ""}});
});
  
verifyEmailCheckBody = [
  body('email_change_token').isUUID(), // hidden
  body('new_email').isEmail().normalizeEmail(),  // hidden
  body('old_email').isEmail().normalizeEmail(),  // hidden
  body('password').isLength({min:8})
];

routes.post('/verify-change-email', verifyEmailCheckBody, (req, res) => {
  errors = validationResult(req)
  console.log('req.body :', req.body);
  if (!errors.isEmpty()) {
    req.flash("info","Invalid data");
    res.status(200).render('pages/public/verify-change-email.ejs', { 
      messages : req.flash('info'), 
      messagesError : req.flash('error'), 
      user : { 
        old_email : req.body.old_email, 
        new_email : req.body.new_email, 
        email_change_token : req.body.email_change_token 
      }
    });
    return;
  } 
  
  let user = {
    new_email : req.body.new_email,
    old_email : req.body.old_email,
    password : req.body.password,
    change_token : req.body.email_change_token
  }
  updateUserEmail(user)
  .then(data => {
    console.log('user :', data);
    if (!data) {
      req.flash("error","Invalid credentials. Please try again.");
      res.status(200).render('pages/public/verify-change_email.ejs', { messages : req.flash('info'), messagesError : req.flash('error'), user : { old_email: req.body.old_email, new_email : req.body.new_email, email_change_token : req.body.email_change_token }});
      return;
    }
    let mail = new Mail();
    mail.sendToOldEmail(user);
    mail.sendEmailChangeConfirmation(user);
    req.logOut();
    req.flash('info', 'Please now login with your new email');
    res.status(200).redirect('./login');
  }).catch(function(err){
    console.log('err :', err);
    req.flash('error', 'There was a system error. Please contact your administrator');
    res.status(200).redirect('/users/dashboard');
  })
});


// pages // move to pages/content routes

routes.get('/content/manage-page', (req, res) => {
  res.status(200).render('pages/content/create-edit-page', {
    messages: req.flash('info'),
    messagesError : req.flash('error')});
  return;
});

routes.get('/content/manage-all-pages', (req, res) => { //accessible by authed admin
  res.status(200).render('pages/content/manage-all-pages.ejs', {
    messages: req.flash('info'), 
    messagesError : req.flash('error')});
  return;
});

// unknown //

//// for creating users for test purposes only /// remove on production 

// routes.get('/create-user', (req, res) => { //accessible by authed admin
//   res.status(200).render('pages/users/create-user.ejs', {title: 'Create User', active: 'active', username: 'Ginny Bradley', messages: req.flash('info')});
// });

// const createUserCheck = [
//   body('email').isEmail().normalizeEmail(),
//   body('first_name').trim().isAlphanumeric(),
//   body('last_name').trim().isAlphanumeric()
// ];


// routes.post('/create-user', createUserCheck, (req, res) => { //accessible by authed admin
  
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     console.log('ERROR',errors.array())
//     const userTemp = {
//       email : req.body.email || "", 
//       firstName : req.body.first_name || "", 
//       lastName: req.body.last_name || ""
//     }
//     req.flash("info","Invalid user data", process.env.NODE_ENV === 'development' ? errors.array() : ""); //error.array() for development only
//     res.status(200).render('pages/users/create-user.ejs', {
//       title: 'Create User', 
//       active: 'active', 
//       username: 'Ginny Bradley', 
//       messages : req.flash('info'),
//       messagesError : req.flash('error'), 
//       userTemp});
//     return;
//   }

//   const user = {
//     email : req.body.email,
//     last_failed_login: "",
//     first_name : req.body.first_name,
//     last_name : req.body.last_name,
//     failed_login_attempts : 0,
//     activation_token :  uuid()
//   };

//   createUser(user).then(function(userCreated){ // returns user created true or false
//     console.log('userCreated :', userCreated);
//     if (userCreated) {
//       let mail = new Mail;
//       mail.sendVerificationLink(user);
//       req.flash('info', 'user created and email sent'); 
//       res.redirect('./users/create-user'); 
//       return;
//     }
//     else {
//       console.log("There was a create user error", err)
//       req.flash('info', 'There was an error creating this user. Please try again. If you already have please contact support.')
//       res.status(200).render('pages/users/create-user.ejs', {
//         title: 'Create User', 
//         active: 'active', 
//         username: 'Ginny Bradley', 
//         messages : req.flash('info'), 
//         messagesError : req.flash('error'),
//         user});
//       return;
//     }
//   }).catch(function(err){
//     const userExistsCode = "23505";
//     if (err.code === userExistsCode) {
//       req.flash("info", "User already exists");
//     }
//     else {
//       console.log("There was a system error", err)
//       req.flash('info', 'There was an system error. Please notify support.')
//     }
//     res.status(200).render('pages/users/create-user.ejs', {
//       title: 'Create User', 
//       active: 'active', 
//       username: 'Ginny Bradley', 
//       messages : req.flash('info'), 
//       user});
//   })
//   return;
// });

getPageParamCheck = [
  param('link').exists()
]

routes.get('/pages/:link', getPageParamCheck, function(req,res){
  errors = validationResult(req)
  if (!errors.isEmpty() || !(/^[\w-]+$/g).test(req.params.page_id)) {
    req.flash('error','Invalid page id parameters');
    res.status(200).redirect('/');
    return;
  }
  let navItems = getAllNavItemsWithLink();
  const pageItems = getPageByLink(req.params.link);
  Promise.all([navItems, pageItems])
  .then(function(values){
    console.log('pageItems.is_published :', values[1][0].is_published , req.isAuthenticated());
    if (!(values[1][0].is_published) && !(req.isAuthenticated())) {
      // req.flash('error', 'This page is not currently published'); add back if flash message css is added to the homepage
      res.status(200).redirect('/');
      return;
    }
    values[0].forEach((item, index) => {   // this exists twice. Needs refactoring. Here and the index route.
      if (item.parent_id) {
          //If there is a parent cycle through the data, find the parent and append the item to it's children.
          values[0].forEach(parent => {
              if (item.parent_id === parent.item_id) parent.children ? parent.children.push(item) : parent.children = [item];
          })
      }
    });
    
    //Remove each item that has a parent item as they are now in a collection
    values[0] = values[0].filter(item => !item.parent_id);
    values[0] = values[0].sort((a,b) => a.order_num < b.order_num ? -1 : a.order_num === b.order_num ? 0 : 1);
    values[0].map(item => {
      if (item.children) {
          item.children = item.children.sort((a,b) => a.order_num < b.order_num ? -1 : a.order_num === b.order_num ? 0 : 1);
      }
      return item;
    });
    console.log('values[0] :', values[0]);
    res.status(200).render('pages/public/page', {
      page: values[1][0],
      menuItems: values[0],
      url: urlConfig,
      messages : req.flash('info'), 
      messagesError : req.flash('error')
    })
  })
})


routes.all('*', (req, res) => {
  res.status(200).render('pages/public/unknown.ejs', { 
    title: '404 Not Found',
    url: req.url 
  });
  return;
});
module.exports = routes;