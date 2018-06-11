const express = require('express');
const userRoutes = new express.Router();
const passport = require('../auth/local');
const Logins = require('../helperFunctions/Logins');
const logins = new Logins();
const { query, check, body, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

userRoutes.use(logins.isLoggedIn);

userRoutes.get('/dashboard', (req, res) => {
  res.status(200).render('pages/users/dashboard.ejs');
  return;
});

////////////////////    Enter new Password           ////////////////////

userRoutes.get('/enter-new-password',  (req, res) => {
  res.status(200).render('pages/public/enter-password', {email: req.session.email, token: req.session.token});
  return;
});

const passwordCheck = [
  check('password').isLength({min: 8}),
  // password must be at least 8 chars long
  check('confirm_password').equals(check('password'))
];

userRoutes.post('/enter-new-password', passwordCheck, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("info","Invalid password or passwords do not match", process.env.NODE_ENV === 'development' ? errors.array() : ""); //error.array() for development only
    res.redirect('/enter-new-password');
    return;
  } 
  // use req.session.email and token to ensure correct user
  // accept the new passwords if they are the same and look up the user name. Set user to validated and modified date to now() and store hashed password.
  // destroy session and force user to login again
  res.status(200).redirect('/login');
  return;
});


/////////////       Create users           /////////////////////////

userRoutes.get('/create-user', (req, res) => { //accessible by authed admin
  res.status(200).render('pages/users/create-user.ejs');
});

const createUserCheck = [
  body('email').isEmail().normalizeEmail(),
  body('firstName').trim().isAlphanumeric(),
  body('lastName').trim().isAlphanumeric()
];


userRoutes.post('/create-user', createUserCheck, (req, res) => { //accessible by authed admin
  
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

// userRoutes.post('/users/email-verification', verificationCheck, (req, res) => {
//   console.log('req.query :', req.query);
//   mail = new Mail();
//   mail.sendVerificationLink(req.body);
//   res.status(200).json({message: "email sent"});
//   return;
// });


userRoutes.get('/admin', (req,res) => {
  res.status(200).render('pages/users/admin.ejs', {messages : req.flash("info"), ckeditorData : req.body.ckeditorHTML || ""});
});

const ckeditorHTMLValidation = [
  sanitize('ckeditorHTML').escape().trim()
];

userRoutes.post('/admin', (req,res) => {
  console.log('req.body.ckeditorHTML:', req.body.ckeditorHTML);
  res.status(200).render('pages/users/admin.ejs', {messages : req.flash("info"), ckeditorData : req.body.ckeditorHTML || ""});
});



userRoutes.get('/new-password', (req, res) => {
  res.status(200).render('pages/users/new-password.ejs');
  return;
});


userRoutes.post('/new-password', (req, res) => {
  
});

// New Sign Up Page 


userRoutes.get('/logout', logins.isLoggedIn, logins.logUserOut, (req, res) => { //testing isLogged in function. To be implemented on all routes. Might be worth extracting as it's own mini express app route on /users/.
  res.status(200).redirect('/');
  return;
});


userRoutes.get('/edit-user', (req, res) => { //accessible by authed admin
  res.status(200).render('pages/users/edit-user.ejs', {user:req.body.userToDelete});
  // confirm page for deleting user. only accessible by authenticated admin.
});

userRoutes.post('/delete-user', (req, res) => {
  // delete user.  only accessible by authenticated admin via delete user route. something in the post body perhaps. Discuss with colleagues if there is a better way to perform this confirmation
  return;
});

userRoutes.get('/change-password', (req, res) => { 
  res.status(200).render('pages/users/changePassword.ejs');
});

userRoutes.all('*', (req, res) => {
  res.status(200).render('pages/public/unknown.ejs', { url: req.url });
  return;
});

module.exports = userRoutes;