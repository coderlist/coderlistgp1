const routes = require('express').Router();
const { query, check, body, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
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
const _ = require('lodash')



routes.get('/', (req, res) => {
  //get menu items from db maybe set this as some middleware
  const menuItems = [ 
    {href:"test me one", name:"item 1"},
    {href:"test me two", name:"item 2"}
  ]
  res.status(200).render('pages/index', {contentHomePages: "", menuItems: menuItems, messages: req.flash('info')}); //ejs example
  return;
});


routes.get('/about', (req, res) => {
  res.status(200).render('pages/about');
  return;
});

// users //
///////////////   Login    //////////////////

routes.get('/login', (req, res) => {
  // **Supply credentials to database
  // **if invalid user return "Invalid Username or Password" Flash Message
  // **if failed attempts date > 5 minutes ago. reset failed attempts to 0.
  // **if failed attempts >= 10  last failure date < 5 minutes ago. respond with "your account has been locked. It will auto unlock soon". 
  // **on successful login. set successful login to true and date to now. Reset failed login attempts to zero. 
  // **on failed attempt. if failed attempt date > successful login date, set user (if valid) failed attempts += 1.  Set failure date to now
  res.status(200).render('pages/login', { messages: req.flash('error')});
  return;
});


const loginCheck = [
  check('email').isEmail().normalizeEmail(),
];

routes.post('/login', loginCheck, logins.getNumberOfFailedLogins, passport.authenticate('local'), function (req, res){ //// if validatelogin fails. Failure is sent from within this middleware. If this succeeds then this passes to next function.
  res.status(200).json({message: "success"})
  return;
})

routes.get('/reset-password', (req, res) => { 
  res.status(200).render('pages/reset-password.ejs');
  return;
});

// Test routes for Email and Password Templates to check Design
// Can delete this after all the templates are done
// Change Password Template missing -> done at the end of this week
routes.get('/sign-up', (req, res) => { 
  res.status(200).render('pages/email/sign-up.ejs');
  return;
});

routes.get('/forgot-password', (req, res) => { 
  res.status(200).render('pages/email/forgot-password.ejs');
  return;
});

// New Password Page
routes.get('/new-password', (req, res) => {
  res.status(200).render('pages/newpassword.ejs');
  return;
});

// New Sign Up Page 
routes.get('/signup', (req, res) => {
  res.status(200).render('pages/signup.ejs');
  return;
});

// routes.get('/test-flash-start', (req, res) => {
//   req.flash('info','This is a flash message');
//   res.status(200).redirect('/test-flash-finish');
//   return;
// });
// routes.get('/test-flash-finish', (req, res) => {
//   res.status(200).render('pages/test-flash-finish', { messages: req.flash('info') });
//   return;
// });

routes.get('/users/logout', logins.isLoggedIn, logins.logUserOut, (req, res) => { //testing isLogged in function. To be implemented on all admin routes. Might be worth extracting as it's own mini express app route on /users/.
  res.status(200).redirect('/');
  return;
});

const verificationCheck = [
  query('email', 'invalid email').isEmail().normalizeEmail(),
  query('token', 'invalid token').isUUID()
]

const validationCheck = [
  check('email').isEmail().normalizeEmail(),
  // password must be at least 5 chars long
  check('password').isLength({ min: 8 })
];

routes.get('/users/verify-email', verificationCheck , (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("info","Invalid token or email", req.query.email, req.query.token, errors.array())
      res.redirect('/')
      return;
    }
    //**check date(now) minus token date is less than 1 week. If greater than a week send flash message saying "token has expired please contact administrator" and redirect to login or setup an administrator email which sends email of person trying to sign up but failing due to token expiry.
    //**if token date not expired then redirect to enter password
    req.session.token = req.query.token;
    req.session.email = req.query.email; 
    req.flash("info","Successfully verified email. Please enter a password")
  res.status(200).redirect('/enter-new-password');
  return;
});

////////////////////    Enter new Password           ////////////////////

routes.get('/enter-new-password',  (req, res) => {
  res.status(200).render('pages/users/enter-new-password', {email: req.session.email, token: req.session.token});
  return;
});

const passwordCheck = [
  check('password').isLength({min: 8}),
  // password must be at least 8 chars long
  check('confirm_password').equals(check('password'))
];

routes.post('/enter-new-password', passwordCheck, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("info","Invalid password or passwords do not match", process.env.NODE_ENV === 'development' ? errors.array() : ""); //error.array() for development only
    res.redirect('/enter-new-password')
    return;
  } 
  // use req.session.email and token to ensure correct user
  // accept the new passwords if they are the same and look up the user name. Set user to validated and modified date to now() and store hashed password.
  // destroy session and force user to login again
  res.status(200).redirect('/login');
  return;
});


/////////////       Create users           /////////////////////////

routes.get('/users/create-user', (req, res) => { //accessible by authed admin
  res.status(200).render('pages/users/create-user.ejs');
});

const createUserCheck = [
  body('email').isEmail().normalizeEmail(),
  body('firstName').trim().isAlphanumeric(),
  body('lastName').trim().isAlphanumeric()
];


routes.post('/users/create-user', createUserCheck, (req, res) => { //accessible by authed admin
  
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
    activation_token : generatedToken
  }
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

routes.post('/users/email-verification', verificationCheck, (req, res) => {
  console.log('req.query :', req.query);
  mail = new Mail();
  mail.sendVerificationLink(req.body);
  res.status(200).json({message: "email sent"});
  return;
});


routes.get('/users/admin', (req,res) => {
  res.status(200).render('pages/users/admin.ejs', {messages : req.flash("info"), ckeditorData : req.body.ckeditorHTML || ""});
});

const ckeditorHTMLValidation = [
  sanitize('ckeditorHTML').escape().trim()
];

routes.post('/users/admin', logins.isLoggedIn,  (req,res) => {
  console.log('req.body.ckeditorHTML:', req.body.ckeditorHTML);
  res.status(200).render('pages/users/admin.ejs', {messages : req.flash("info"), ckeditorData : req.body.ckeditorHTML || ""});
});


////////////           Change user ///////////////////////



routes.get('/users/edit-user', (req, res) => { //accessible by authed admin
  res.status(200).render('pages/users/edit-user.ejs', {user:req.body.userToDelete});
  // confirm page for deleting user. only accessible by authenticated admin.
});

routes.post('/users/delete-user', (req, res) => {
  // delete user.  only accessible by authenticated admin via delete user route. something in the post body perhaps. Discuss with colleagues if there is a better way to perform this confirmation
  return;
});

routes.get('/users/change-password', (req, res) => { 
  res.status(200).render('pages/users/changePassword.ejs');
});




///////////////       Register User      //////////////////

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
    res.status(200).render('pages/enter-password.ejs', {messages : req.flash('info'), user : {activation_token : req.body.token, email : req.body.email}});
    return;
  }
  res.status(200).render('pages/enter-password.ejs', {user : {activation_token : req.query.token, email : req.query.email}});
});

postEnterPasswordCheck = [
  body('activation_token').exists().isUUID(),
  body('email').exists().isEmail().normalizeEmail(),
  body("password", "invalid password")
  .isLength({ min: 8 })
  // .custom((value,{req, loc, path}) => {
  //   if (value !== req.body.confirm_password) {
  //     throw new Error("Passwords don't match");
  //   } else {
  //     return value;
  //   }
  // })
];

routes.post('/enter-password', postEnterPasswordCheck, (req, res) => {
  let errors = validationResult(req);
  console.log('req.body :', req.body);
  console.log('errors :', errors.array());
  if (!errors.isEmpty()){
    req.flash('info', 'Invalid credentials. Please try again or contact your administrator');
    res.status(200).render(`pages/enter-password.ejs`, {messages : req.flash('info'), user : {activation_token : req.body.token, email : req.body.email}});
    return;
  }
  const user = {
    email : req.body.email,
    activation_token : req.body.activation_token,
    password : req.body.password
  }
  console.log("gets here");
  // console.log(verifyUser(user)); this will throw an error
  users.verifyUser(user).then(response => {
    console.log('RESPONSE', response)
    if (response) {
      req.flash("info", "There was an error creating user. Please try again or contact your administrator");
      res.status(200).render('pages/enter-password.ejs', {user : {activation_token : req.query.token, email : req.query.email}});
      return;
    } else {
      req.flash("info", "User created");
      res.status(200).redirect('pages/users/admin');
      return
    }
  }).catch(e =>  res.status(500).send(e.stack))   //handle error here
});




 /////////////////  Forgot Password //////////////


routes.get('/forgot-password', (req, res) => {
  // **create a page with two fields to enter email addresses
  // **ensure that emails both match before being able to post
  res.status(200).render('pages/users/forgot-password');
});  

forgotPasswordCheck = [
  check('email').isLength({min: 8}),
  check('confirm_email').equals(check('email'))
]

routes.post('/forgot-password', forgotPasswordCheck, (req, res) => {
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    req.flash("info","Invalid email");
    res.status(200).render('pages/users/forgot-password', {messages : req.flash('info')});
    return;
  }
  const user = {
    activation_token : uuid(),
    email : req.body.email.trim().normalizeEmail()
  }
  if (checkIfUserExists(user.email) === false) {
    req.flash("info","Further instructions have now been sent to the email address provided");
    res.status(200).render('pages/users/forgot-password', {messages : req.flash('info')});
    return;
  } // database request
     
      // **validate and normalise email addresses
    // **enter email on this page and send to database and regardless of whether user exists or not send email stating "an email has been sent to your account with further instructions" 
    // **if the user email exists in db then send an email to the users account. Generate a passwordReset token and time created and then insert into the db and send to email for further verification in the same manner as initial sign-up. (except password reset tokens only last an hour)
    // **if the user doesn't exist don't do anything
  else {
    sendActivationTokenToDb(user);
    let mail = new Mail()
    mail.sendPasswordReset(user);
    req.flash("info","Further instructions have now been sent to your email");
    res.status(200).render('pages/users/forgot-password', {messages : req.flash('info')});
    return;
  }
});
  
 
  




// pages //


routes.get('/content/manage-page', (req, res) => {
  res.status(200).render('pages/content/create-edit-page');
  return;
});

routes.get('/content/manage-all-pages', (req, res) => { //accessible by authed admin
  res.status(200).render('pages/content/manage-all-pages.ejs');
  return;
});

// unknown //

routes.all('*', (req, res) => {
  res.status(200).render('pages/unknown.ejs', { url: req.url });
  return;
});

// Jide's test route //

routes.post('/signme', (req, res) => {
 //const user = _.pick(req.body,['email','first_name','last_name','activation_token'])
 
  createUser(user).then(val => {
    console.log('CREATED')
    res.status(200).send({message: 'USER CREATED BUT NOT ACTIVATED'})
  }).catch(e => {
    console.log(e.message)
    res.status(400).send(e.message)
  })
  
});


module.exports = routes;