const { getNumberOfFailedLogins, resetFailedLogins } = require('../server/models/users').user;
class Logins {
  constructor () {
  }

  isLoggedIn(req, res, next) {
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

  failedLoginsCheck(req, res, next) {
    return getNumberOfFailedLogins(req.body)
      .then(function (data){
        if (data.length === 0) {
          console.log('Invalid username or password');
          req.flash('info', 'Invalid username or password');
          res.status(200).redirect('/login')
          return;
        }
        if (Date.now() > (Date.parse(data[0].last_failed_login) + (1000 * 60 * 5)) ) {
          resetFailedLogins(req.body);
          return next();
        }   
        else if (data[0].failed_login_attempts < 10 || data[0].failed_login_attempts === null) {
          console.log('login attempt allowed');
          return next();
        }
        else {
          console.log('too many failed login attempts');
          req.flash('info', 'Too many failed login attempts. Please try later');
          res.status(200).redirect('/login')
          return;
        }
      })
      .catch(function(err){
        console.log(err);
      })  
  }
}

module.exports = Logins;
