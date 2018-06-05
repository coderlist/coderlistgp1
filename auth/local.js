const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {findByUsername} = require('../helperFunctions/query/queryHelper')
const options = {
  usernameField: 'email',
  passwordField: 'password'
};
const init = require('./passport');



/**
 * Passport local Strategy configuration 
 * with custom option <usernameField>
 */



passport.use(new LocalStrategy(options,
  (email,password,done) => {
    findByUsername('users',email) 
    .then(user => {
      console.log('verify fnunction :', verifyPassword);
     if(!user) {
      return done(null,false, {message: "Invalid Username or password"})}
     if(verifyPassword(password,user.password)===false) { 
        let user = {email : email};
        addOneToFailedLogins(email);
        setLastFailedLoginTime(user);
         return done(null,false);
      }  // does this need to be asynchronous?
     return done(null,user);

    }).catch(e => {return done(null,false, {messages: "Invalid Username or password"})})
  }
  ));

  init();

module.exports = passport;
