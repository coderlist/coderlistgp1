// route middleware to make sure a user is logged in
class logins {
  constructor () {
  }

  isloggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    //  Uncomment the below if statement when Passportjs is installed *************
    if (req.isAuthenticated()) {
      return next();
    }
    // if they aren't redirect them to the home page
    req.flash('info','Please log in');
    res.redirect('/login');
    return;
  }
  
  logUserOut(req, res, next) {
  // uncomment the below line when passport is installed and configured. ****8
    if (req.user) { // Handle just in case a user accesses this route while not logged in.
      req.logout() 
    }
    return next();
  }
}
