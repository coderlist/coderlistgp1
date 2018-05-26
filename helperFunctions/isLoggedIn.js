// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

   
// if user is authenticated in the session, carry on
  //  Uncomment the below if statement when Passportjs is installed *************
  if (req.isAuthenticated()) {
    return next();
  }
  next();

  // if they aren't redirect them to the home page
  res.redirect('/login');
  return;
}

module.exports = isLoggedIn;