const { getNumberOfFailedLogins } = require('../server/models/users').user;
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
        console.log('data :', data);
        if (Date.now() < (data.last_failed_login + (1000 * 60 * 5)) ) {
          resetFailedLogins(req.body); // should this be add one to failed logins? (kristian)
          next();
        }
        if (data.failed_login_attempts < 10 || data.failed_login_attempts == null) {
          next();
        }
        else {
          res.status(200).redirect('/login')
          return;
        }
      })
      .catch(function(err){
        console.log(err);
      })
    
    //database request for failed times
    // if last login failure date > 5 minutes ago update db with failed logins set to 0  this.resetFailedLogins(req.body.email); next()
    // if date < 5 minutes ago and logins < 10 next();
    // if date < 5 minutes ago and logins > 10 then send req.flash('info', 'Too many unsuccesful logins. Your account has been locked. Please try again later'); res.status(200),redirect('./login');
   // remove when algorithm implemented;
  }

  resetFailedLogins(email) {
    // reset failed logins to 0
  }

  addOneToFailedLogins(email) {
    //after login failure add one to failed logins for user (if exists)
  }

}

module.exports = Logins;
