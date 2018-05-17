const routes = require('express').Router();
const { query } = require('express-validator/check');
const isLoggedIn = require('../helperFunctions/isLoggedIn');
const logUserOut = require('../helperFunctions/logUserOut');
// const validateVerification = require('../helperFunctions/validateVerification');
const checkEmailAndToken = require('../helperFunctions/checkEmailAndToken');
// basic //

menuItems = [
  {href:"test me one", name:"item 1"},
  {href:"test me two", name:"item 2"}
]

routes.get('/', (req, res) => {
  res.status(200).render('pages/index.ejs', {menuItems: menuItems});
    return;
});

routes.get('/about', (req, res) => {
    res.status(200).render('pages/about.ejs');
    return;
});

// users //

routes.get('/admin', (req, res) => {
  res.status(200).render('pages/admin.ejs');
  return;
});

routes.get('/login', (req, res) => {
  res.status(200).render('pages/login.ejs');
  return;
});

routes.get('/users/logout', (req, res) => { //testing isLogged in function. To be implemented on all admin routes. Might be worth extracting as it's mini express app route on /users/.
  res.status(200).redirect('/');
  return;
});


routes.get('/users/enter-password', [
  query(['email', "Invalid Email."]).isEmail().normalizeEmail(),
  query(['token', "invalid token."]).isLength({min: 35, max: 35}) ], (req, res) => {
    const error = req.validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("info","Invalid token or email")
      res.redirect('/')
    }
  res.status(200).render('pages/users/enter-password.ejs');
  return;
});

routes.get('/users/manage-users', (req, res) => {
  res.status(200).render('pages/users/createEditUser.ejs');
  return;
});

routes.get('/users/forgot-password', (req, res) => {
  res.status(200).render('pages/users/forgotPassword.ejs');
  return;
});

// pages //

routes.get('/content/manage-page', (req, res) => {
  res.status(200).render('pages/content/createEditPage.ejs');
  return;
});

routes.get('/content/manage-all-pages', (req, res) => {
  res.status(200).render('pages/content/manageAllPages.ejs');
  return;
});

// unknown //

routes.all('*', (req, res) => {
  res.status(200).render('pages/unknown.ejs', { url: req.url });
  return;
});

module.exports = routes;