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
    else {
    req.flash('error','This page is unavailable as you are not logged in. Please log in');
    res.status(200).redirect('/login');
    return;
    }
  }
  
  logUserOut(req, res, next) {
    req.logout();
    return next();
  }

  failedLoginsCheck(req, res, next) {
    return getNumberOfFailedLogins(req.body)
      .then(function (data){
        if (data.length === 0) { // handles invalid username
          console.log('Invalid username or password');
          req.flash('error', 'Invalid username or password');
          res.status(200).redirect('/login')
          return;
        }
        if (Date.now() > (Date.parse(data[0].last_failed_login) + (1000 * 60 * 5)) ) { // if last login was greater than five minutes ago reset login count to 0 on users db entry and then allow a login
          resetFailedLogins(req.body);
          console.log('login attempt allowed');
          next();
          return;
        }   
        else if (data[0].failed_login_attempts < 10 || data[0].failed_login_attempts === null) { // if failed logins is less than ten all login attempt
          console.log('login attempt allowed');
          next();
          return;
        }
        else {
          console.log('too many failed login attempts'); // if failed login attempts is greater than 10 and last login is less than 5 minutes ago then exit from route and do not allow a login attempt
          req.flash('error', 'Too many failed login attempts. Please try later');
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
