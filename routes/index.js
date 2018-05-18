const routes = require('express').Router();
const { query, check, validationResult } = require('express-validator/check');
const isLoggedIn = require('../helperFunctions/isLoggedIn');
const logUserOut = require('../helperFunctions/logUserOut');
// const validateVerification = require('../helperFunctions/validateVerification');
const checkEmailAndToken = require('../helperFunctions/checkEmailAndToken');
// basic //


const menuItems = [ 
  {href:"test me one", name:"item 1"},
  {href:"test me two", name:"item 2"}
]

routes.get('/', (req, res) => {

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
  // Supply credentials to database
  // if invalid user return "Invalid Username or Password" Flash Message
  // if failed attempts date > 5 minutes ago. reset failed attempts to 0.
  // if failed attempts >= 10  last failure date < 5 minutes ago. respond with "your account has been locked. It will auto unlock soon". 
  // on successful login. set successful login to true and date to now. Reset failed login attempts to zero. 
  // on failed attempt. if failed attempt date > successful login date, set user (if valid) failed attempts += 1.  Set failure date to now
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


routes.get('/users/enter-password', [
  check(['email', "Invalid Email."]).isEmail().normalizeEmail(),
  check(['token', "invalid token."]).isLength({min: 35, max: 35}) ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("info","Invalid token or email", errors.array())
      res.redirect('/')
      return;
    }
    //pass add password to database with the correct token. Set user to validated and set creation date if required
    req.flash("info","Successfully verified email. Please now login")
  res.status(200).redirect('/login');
  return;
});

routes.get('/users/manage-users', (req, res) => {
  res.status(200).render('pages/users/createEditUser');
  return;
});

routes.get('/forgot-password', (req, res) => {
  res.status(200).render('pages/users/forgotPassword');
  return;

});
routes.post('/forgot-password', (req, res) => {
  res.status(200).render('pages/users/forgotPassword');
  return;
});


// pages //


routes.get('/content/manage-page', (req, res) => {
  res.status(200).render('pages/content/createEditPage');
  return;
});

routes.get('/content/manage-all-pages', (req, res) => {
  res.status(200).render('pages/content/manageAllPages');
  return;
});

// unknown //

routes.all('*', (req, res) => {
  res.status(200).render('pages/unknown.ejs', { url: req.url });
  return;
});

module.exports = routes;
