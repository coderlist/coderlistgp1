const routes = require('express').Router();
const { query, check, body, validationResult } = require('express-validator/check');

const Logins = require('../helperFunctions/Logins');
const logins = new Logins();
const checkEmailAndToken = require('../helperFunctions/checkEmailAndToken');
const users = require('../server/models/users');
// basic //
const passport = require('../auth/local');
const Mail = require('../helperFunctions/verification/MailSender');
// site //
const { createUser, verifyUser } = require('../server/models/users');
const uuid = require('uuid/v1');
const _ = require('lodash');
const userRoutes = require('./userRoutes')


routes.use('/users/', userRoutes);  // all routes in here require authing

routes.get('/', (req, res) => {
  //get menu items from db maybe set this as some middleware
  const menuItems = [ 
    {href:"test me one", name:"item 1"},
    {href:"test me two", name:"item 2"}
  ]
  res.status(200).render('pages/public/index', {contentHomePages: "", menuItems: menuItems, messages: req.flash('info')}); //ejs example
});




routes.get('/about', (req, res) => {
  res.status(200).render('pages/public/about');
  return;
});

// users //
///////////////   Login    //////////////////

routes.get('/login', (req, res) => {
  res.status(200).render('pages/public/login', { messages: req.flash('error')});
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
    res.status(200).redirect("/users/dashboard")
  return;
})


routes.get('/reset-password', (req, res) => { 
  res.status(200).render('pages/public/reset-password.ejs');
});

// Test routes for Email and Password Templates to check Design
// Can delete this after all the templates are done
// Change Password Template missing -> done at the end of this week
// routes.get('/sign-up', (req, res) => { 
//   res.status(200).render('pages/email/sign-up.ejs');
//   return;
// });


// New Password Page


// const verificationCheck = [
//   query('email', 'invalid email').isEmail().normalizeEmail(),
//   query('token', 'invalid token').isUUID()
// ];

// const validationCheck = [
//   check('email').isEmail().normalizeEmail(),
//   // password must be at least 5 chars long
//   check('password').isLength({ min: 8 })
// ];

// // routes.get('/verify-email', verificationCheck , (req, res) => {
// //     const errors = validationResult(req);
// //     if (!errors.isEmpty()) {
// //       req.flash("info","Invalid token or email", req.query.email, req.query.token, errors.array());
// //       res.redirect('/');
// //       return;
// //     }
// //     verifyUser(user).then()
// //     req.session.token = req.query.token;
// //     req.session.email = req.query.email; 
// //     req.flash("info","Successfully verified email. Please enter a password")
// //   res.status(200).redirect('enter-new-password');
// //   return;
// // }); //// needs to be changed should load hidden fields with email and verification token



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
    res.status(200).render('pages/public/enter-password.ejs', {messages : req.flash('info'), user : {activation_token : req.body.activation_token, email : req.body.email}});
    return;
  }
  res.status(200).render('pages/public/enter-password.ejs', {user : {activation_token : req.query.token, email : req.query.email}});
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
  console.log('req.body :', req.body);
  console.log('errors :', errors.array());
  if (!errors.isEmpty()){
    req.flash('info', 'Invalid credentials. Please try again or contact your administrator');
    res.status(200).render(`pages/public/enter-password.ejs`, {messages : req.flash('info'), user : {activation_token : req.body.token, email : req.body.email}});
    return;
  }
  const user = {
    email : req.body.email,
    activation_token : req.body.activation_token,
    password : req.body.password
  }
  console.log("gets here");
  users.verifyUser(user).then(response => {
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

 /////////////////  Forgot Password //////////////


/// This is the page where a user who has forgotten their password and is not logged in can ask for a reset link.

routes.get('/reset-password', (req, res) => {
  // **create a page with two fields to enter email addresses
  // **ensure that emails both match before being able to post
  res.status(200).render('pages/public/forgot-password');
});  

forgotPasswordCheck = [
  check('email').isLength({min: 8}),
  check('confirm_email').equals(check('email'))
]

routes.post('/reset-password', forgotPasswordCheck, (req, res) => {
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    req.flash("info","Invalid email");
    res.status(200).render('pages/public/reset-password', {messages : req.flash('info')});
    return;
  }
  const user = {
    activation_token : uuid(),
    email : req.body.email.trim().normalizeEmail()
  }
  if (checkIfUserExists(user.email) === false) {
    req.flash("info","Further instructions have now been sent to the email address provided");
    res.status(200).render('pages/public/reset-password', {messages : req.flash('info')});
    return;
  } 
  else {
    sendActivationTokenToDb(user);
    let mail = new Mail();
    mail.sendPasswordReset(user);
    req.flash("info","Further instructions have now been sent to your email");
    res.status(200).render('pages/users/forgot-password', {messages : req.flash('info')});
    return;
  }
});
  
 /// Change email ////////////

 verifyEmailCheckQuery = [
  query('email_change_token').isUUID(),
  query('new_email').isEmail().normalizeEmail()
];

userRoutes.get('/verify-change-email', verifyEmailCheckQuery, (req, res) => { 
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    req.flash("info","Invalid credentials. Please recheck authorisation link or contact your administrator");
    res.status(200).render('pages/public/verify-email-change', {messages : req.flash('info')});
    return;
  }
  res.status(200).render('pages/users/verify-change_email.ejs', { user : { new_email : req.query.new_email, email_change_token : req.query.email_change_token }});
});
  
verifyEmailCheckBody = [
  body('email_change_token').isUUID(),
  body('new_email').isEmail().normalizeEmail(),
  body('password').isLength({min:8})
];

userRoutes.get('/verify-change-email', verifyEmailCheckBody, (req, res) => {
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    req.flash("info","Invalid email");
    res.status(200).render('pages/public/reset-password', {messages : req.flash('info')});
    return;
  } 
  res.status(200).render('pages/users/verify-change_email.ejs', { user : { new_email : req.query.new_email, email_change_token : req.query.email_change_token }});
});


// pages // move to pages/content routes

routes.get('/content/manage-page', (req, res) => {
  res.status(200).render('pages/content/create-edit-page');
  return;
});

routes.get('/content/manage-all-pages', (req, res) => { //accessible by authed admin
  res.status(200).render('pages/content/manage-all-pages.ejs');
  return;
});

// unknown //




//// for creating users for test purposes only /// remove on production 

routes.get('/create-user', (req, res) => { //accessible by authed admin
  res.status(200).render('pages/users/create-user.ejs', messages);
});

const createUserCheck = [
  body('email').isEmail().normalizeEmail(),
  body('firstName').trim().isAlphanumeric(),
  body('lastName').trim().isAlphanumeric()
];


routes.post('/create-user', createUserCheck, (req, res) => { //accessible by authed admin
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('ERROR',error)
    const userTemp = {email : req.body.email || "", firstName : req.body.firstName || "", lastName: req.body.lastName || ""}
    req.flash("info","Invalid user data", process.env.NODE_ENV === 'development' ? errors.array() : ""); //error.array() for development only
    res.status(200).render('pages/users/create-user.ejs', {messages : req.flash('info'), userTemp});
    return;
  }

  const generatedToken = uuid();
  const user = {
    email : req.body.email,
    last_failed_login: "",
    first_name : req.body.firstName,
    last_name : req.body.lastName,
    failed_login_attempts : 0,
    activation_token : generatedToken,
    creation_date : Date.now(),
    temporary_token_date : Date.now(),
    last_succesful_login : Date.now(),
    last_failed_login : ""


  };
  createUser(user).then(function(userCreated){ // returns user created true or false
    if (userCreated) {
      let mail = new Mail;
      mail.sendVerificationLink(user);
      req.flash('info', 'user created and email sent');  // email not currently being sent
      res.redirect('/users/admin'); 
      return;
    }
    else {
      console.log("There was a create user error", err)
      req.flash('info', 'There was an error creating this user. Please try again. If you already have please contact support.')
      res.status(200).render('pages/users/create-user.ejs', {messages : req.flash('info'), user});
      return;
    }
  }).catch(function(err){
    const userExistsCode = "23505";
    if (err.code === userExistsCode) {
      req.flash("info", "User already exists");
    }
    else {
      console.log("There was a system error", err)
      req.flash('info', 'There was an system error. Please notify support.')
    }
    res.status(200).render('pages/users/create-user.ejs', {messages : req.flash('info'), user});
  })
  return;
});



routes.all('*', (req, res) => {
  res.status(200).render('pages/public/unknown.ejs', { url: req.url });
  return;
});


module.exports = routes;