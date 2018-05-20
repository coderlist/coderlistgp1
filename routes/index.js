const routes = require('express').Router();
const passport = require('../auth/local');
const {findByUsername} = require('../helperFunctions/query/queryHelper')


const validateLogin = require('../helperFunctions/login/validateLogin');
const Mail = require('../helperFunctions/verification/MailSender');
// site //

routes.get('/', (req, res) => {
  res.status(200).render('pages/index.ejs');
  return;
});


routes.get('/about', (req, res) => {
    res.status(200).render('pages/about.ejs');
    return;
});

// users //
routes.post('/getin', passport.authenticate('local',{
  successRedirect : '/', 
  failureRedirect : '/login', 
  failureFlash : true 
}));

routes.get('/admin', (req, res) => {
  res.status(200).render('pages/admin.ejs');
  return;
});

routes.get('/login', (req, res) => {
  res.status(200).render('pages/login.ejs');
  return;
});

routes.post('/login', validateLogin, function (req, res){ //// if validatelogin fails. Failure is sent from within this middleware. If this succeeds then this passes to next function.
  res.status(200).json({message: "success"})
  return;
})


routes.get('/users/create-user', (req, res) => { //accessible by authed admin
  let mail = new mail();
  
  res.status(200).render('pages/users/createUser.ejs');
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
  res.status(200).render('pages/users/editUser.ejs', {user:req.body.userToDelete});
  // confirm page for deleting user. only accessible by authenticated admin.
});

routes.post('/users/delete-user', (req, res) => {
  // delete user.  only accessible by authenticated admin via delete user route. something in the post body perhaps. Discuss with colleagues if there is a better way to perform this confirmation
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

routes.get('/content/manage-all-pages', (req, res) => { //accessible by authed admin
  res.status(200).render('pages/content/manageAllPages.ejs');
  return;
});

// unknown //

routes.all('*', (req, res) => {
  res.status(200).render('pages/unknown.ejs', { url: req.url });
  return;
});

module.exports = routes;