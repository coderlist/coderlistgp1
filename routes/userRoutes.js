const express = require('express');
const userRoutes = new express.Router();
const passport = require('../auth/local');
const Logins = require('../helperFunctions/Logins');
const logins = new Logins();
const { query, check, body, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const { updatePassword, updateUserEmail } = require('../server/models/users');

userRoutes.use(logins.isLoggedIn);

userRoutes.get('/dashboard', (req, res) => {
  res.status(200).render('pages/users/dashboard.ejs');
  return;
});

////////////////////    Enter new Password           ////////////////////

userRoutes.get('/change-password',  (req, res) => {
  res.status(200).render('pages/users/change-password', {messages : req.flash('info')});
  return;
});

const passwordCheck = [
  body('old_password').isLength({min: 8}),
  body("new_password", "invalid password")
  .isLength({ min: 8 })
  .custom((value,{req, loc, path}) => {
    if (value !== req.body.confirm_password) {
      throw new Error("Passwords don't match");
    } else {
      return value;
    }
  })
];

userRoutes.post('/change-password', passwordCheck, (req, res) => {
  const errors = validationResult(req);
  console.log('getshere :', req.body);
  if (!errors.isEmpty()) {
    req.flash("info","Invalid password or passwords do not match", process.env.NODE_ENV === 'development' ? errors.array() : ""); //error.array() for development only
    res.redirect('/users/change-password');
    return;
  } 
  console.log('req.session.email :', req.session.email);
  user = {
    email : req.session.email,
    old_password : req.body.old_password,
    new_password : req.body.new_password
  }

  updatePassword(user)
  .then(function (data){
    if (!data) {
      req.flash('info', 'Invalid credentials');
      res.status(200).render('pages/users/change-password', {messages : req.flash('info')});
      return;
    }
    req.logOut();
    req.flash('info', 'Password updated. Please login with your new password');
    res.status(200).redirect('/login');
    return;
  }).catch(function (err) {
    req.flash('info', 'There was an internal error. Please contact your administrator');
    res.status(200).redirect('/users/dashboard');
    console.log(err)
    return;    
  });  
  
});


/////////////       Create users           /////////////////////////

userRoutes.get('/create-user', (req, res) => { //accessible by authed admin
  res.status(200).render('pages/users/create-user.ejs');
});

const createUserCheck = [
  body('email').isEmail().normalizeEmail(),
  body('first_name').trim().isAlphanumeric(),
  body('last_name').trim().isAlphanumeric()
];


userRoutes.post('/create-user', createUserCheck, (req, res) => { //accessible by authed admin
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('ERROR',error)
    const userTemp = {email : req.body.email || "", first_name : req.body.first_name || "", lastName: req.body.last_name || ""}
    req.flash("info","Invalid user data", process.env.NODE_ENV === 'development' ? errors.array() : ""); //error.array() for development only
    res.status(200).render('pages/users/create-user.ejs', {messages : req.flash('info'), userTemp});
    return;
  }

  const user = {
    email : req.body.email,
    last_failed_login: "",
    first_name : req.body.first_name,
    last_name : req.body.last_name,
    failed_login_attempts : 0,
    activation_token : uuid()
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



// userRoutes.get('/new-password', (req, res) => {
//   res.status(200).render('pages/users/new-password.ejs');
//   return;
// });


// newPasswordCheck = [
//   body('old_password').isLength({min:8}),
//   body('password').isLength({min:8}),
//   body('confirm_password').isLength({min:8})
// ];

// userRoutes.post('/new-password', (req, res) => {

// });

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

////////////////// Change email whilst validated  //////////////////////

userRoutes.get('/change-email', (req, res) => { 
  res.status(200).render('pages/users/change-email.ejs');
});

changeEmailCheck = [
  
  body("password", "invalid password").isLength({min:8}),
  body('new_email').isEmail().normalizeEmail()
  .custom((value,{req, loc, path}) => {
    if (value !== req.body.confirm_new_email.normalizeEmail()) {
      throw new Error("Passwords don't match");
    } else {
      return value;
    }
  })
];

userRoutes.post('/change-email', changeEmailCheck, (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    const userTemp = {new_email : req.body.new_email || "", old_email : req.body.old_email || ""}
    req.flash("info","Invalid user data", process.env.NODE_ENV === 'development' ? errors.array() : ""); //error.array() for development only
    res.status(200).render('pages/users/change-email.ejs', {messages : req.flash('info'), userTemp});// insert variable into form data
    return;
  }


  user = {
    old_email : req.session.email,
    new_email : req.body.new_email,
    email_change_token : uuid()
  }
  updateUserEmail(user)
  .then(function (data){
    if (!data){
      req.flash('info','Invalid credentials')
      res.status(200).redirect('users/change-email.ejs',); 
      return;
    }
    sendEmailChangeVerificationLink(user);
    req.flash('info', "An email has been sent to your new email with further instructions");
    res.redirect('users/dashboard');
  }).catch(function(err){
    console.log('err :', err);
    req.flash('info', "An internal error has occurred. Please contact your administrator");
    res.redirect('users/dashboard');
    return;
  })
});


//////////////         end of change email whilst validated ////////////////

userRoutes.all('*', (req, res) => {
  res.status(200).render('pages/public/unknown.ejs', { url: req.url });
  return;
});

module.exports = userRoutes;