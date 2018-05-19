const routes = require('express').Router();
const { query, check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const isLoggedIn = require('../helperFunctions/isLoggedIn');
const logUserOut = require('../helperFunctions/logUserOut');
const checkEmailAndToken = require('../helperFunctions/checkEmailAndToken');
// basic //
const validateLogin = require('../helperFunctions/login/validateLogin');
const Mail = require('../helperFunctions/verification/MailSender');
// site //




routes.get('/', (req, res) => {
  //get menu items from db maybe set this as some middleware
  const menuItems = [ 
    {href:"test me one", name:"item 1"},
    {href:"test me two", name:"item 2"}
  ]
  res.status(200).render('pages/index', {menuItems: menuItems, messages: req.flash('info')}); //ejs example
  return;
});

routes.get('/about', (req, res) => {
  res.status(200).render('pages/about');
  return;
});

// users //
routes.get('/admin', (req, res) => {
  res.status(200).render('pages/admin');
  return;
});

routes.get('/login', (req, res) => {
  // **Supply credentials to database
  // **if invalid user return "Invalid Username or Password" Flash Message
  // **if failed attempts date > 5 minutes ago. reset failed attempts to 0.
  // **if failed attempts >= 10  last failure date < 5 minutes ago. respond with "your account has been locked. It will auto unlock soon". 
  // **on successful login. set successful login to true and date to now. Reset failed login attempts to zero. 
  // **on failed attempt. if failed attempt date > successful login date, set user (if valid) failed attempts += 1.  Set failure date to now
  res.status(200).render('pages/login', { messages: req.flash('info')});
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

routes.get('/users/logout', (req, res) => { //testing isLogged in function. To be implemented on all admin routes. Might be worth extracting as it's mini express app route on /users/.
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

const passwordCheck = [
  check('password').isLength({min: 8}),
  // password must be at least 5 chars long
  check('confirm_password').equals(check('password'))
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


routes.get('/enter-new-password',  (req, res) => {
  res.status(200).render('pages/users/enter-new-password', {email: req.session.email, token: req.session.token});
  return;
});

routes.post('/enter-new-password', passwordCheck, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("info","Invalid password or passwords do not match", errors.array());
    res.redirect('/enter-new-password')
    return;
  } 
  // use req.session.email and token to ensure correct user
  // accept the new passwords if they are the same and look up the user name. Set user to validated and modified date to now() and store hashed password.
  // destroy session and force user to login again
  res.status(200).redirect('/login');
  return;
});

routes.get('/users/create-user', (req, res) => { //accessible by authed admin
  let mail = new mail();
  
  res.status(200).render('pages/users/create-user.ejs');
  return;
});

routes.post('/users/email-verification', (req, res) => {
  console.log('req.query :', req.query);
  //send verification email after sanitising and normalising email with express-session
  mail = new Mail();
  mail.sendVerificationLink(req.body);
  res.status(200).json({message: "email sent"});
  return;
});

routes.get('/users/edit-user', (req, res) => { //accessible by authed admin
  res.status(200).render('pages/users/edit-user.ejs', {user:req.body.userToDelete});
  // confirm page for deleting user. only accessible by authenticated admin.
});

routes.post('/users/delete-user', (req, res) => {
  // delete user.  only accessible by authenticated admin via delete user route. something in the post body perhaps. Discuss with colleagues if there is a better way to perform this confirmation
  return;
});

routes.get('/forgot-password', (req, res) => {
  // **create a page with two fields to enter email addresses
  // **ensure that emails both match before being able to post
  res.status(200).render('pages/users/forgot-password');
routes.post('/login', validateLogin, function (req, res){ //// if validatelogin fails. Failure is sent from within this middleware. If this succeeds then this passes to next function.
  res.status(200).json({message: "success"})
  return;
})

});
routes.post('/forgot-password', (req, res) => {
  // **validate and normalise email addresses
  // **enter email on this page and send to database and regardless of whether user exists or not send email stating "an email has been sent to your account with further instructions" 
  // **if the user email exists in db then send an email to the users account. Generate a passwordReset token and time created and then insert into the db and send to email for further verification in the same manner as initial sign-up. (except password reset tokens only last an hour)
  // **if the user doesn't exist don't do anything
  res.status(200).redirect('login');
  return;
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

module.exports = routes;
