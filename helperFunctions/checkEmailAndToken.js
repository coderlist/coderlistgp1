//connect to data base and check if email and token exist inside of it.
// if they do pass user id onto the session body and pass to password entry page

// route middleware to make sure a user is logged in
function checkEmailAndToken(req, res, next) {
  // connect to db and check if token and email exist if so
     next();
  
    // if they aren't then redirect them to the home page with error
    // res.flash('info', 'There is a problem with the link. Maybe expired. Please contact your admninistrator');
    res.redirect('/');
    return;
  }
  
  module.exports = checkEmailAndToken;