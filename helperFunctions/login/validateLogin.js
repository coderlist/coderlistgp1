function validateLogin (req, res, next) {
  req.checkBody('username', "Enter a valid email address.").trim().isEmail();
  req.checkBody('password', "Enter a password.").trim().isLength({min: 1});
  if (req.validationErrors() === false){  //do not log validation errors in their total as it can potentially contain user passwords
    //send data to database for authentication passport
    next(); 
  }
  else {
    // req.flash('error', 'Invalid Username or Password');
    res.status(201).json({message: "Invalid Username Or Password"});
  }
}

module.exports = validateLogin;