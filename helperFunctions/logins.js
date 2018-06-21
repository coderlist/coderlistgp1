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
    req.logout();
    return next();
  }

  failedLoginsCheck(req, res, next) {
    return getNumberOfFailedLogins(req.body)
      .then(function (data){
        if (data.length === 0) { // handles invalid username
          console.log('Invalid username or password');
          req.flash('info', 'Invalid username or password');
          res.status(200).redirect('/login')
          return;
        }
        if (Date.now() > (Date.parse(data[0].last_failed_login) + (1000 * 60 * 5)) ) { // if last login was greater than five minutes ago reset login count to 0 on users db entry and then allow a login
          resetFailedLogins(req.body);
          console.log('login attempt allowed');
          return next();
        }   
        else if (data[0].failed_login_attempts < 10 || data[0].failed_login_attempts === null) { // if failed logins is less than ten all login attempt
          console.log('login attempt allowed');
          return next();
        }
        else {
          console.log('too many failed login attempts'); // if failed login attempts is greater than 10 and last login is less than 5 minutes ago then exit from route and do not allow a login attempt
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
