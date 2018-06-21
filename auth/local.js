const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const verifyPassword = require('./verify');
const {findByUsername} = require('../helperFunctions/query/queryHelper')
const { resetFailedLogins, setSuccessfulLoginTime, setLastFailedLoginTime, addOneToFailedLogins } = require('../server/models/users').user;
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
    if(!user) {
      return done(null,false, {message: "Invalid Username or password"})
    }
    if(verifyPassword.verifyPassword(password,user.password)===false) { 
      addOneToFailedLogins(user)
      .then(() => {
        setLastFailedLoginTime(user)
        .then(() => {
          return done(null,false, {message: "Invalid Username or password"});
        });
      }).catch(e => {console.log("there was an a catch error", e); return done(null,false, {message: "Invalid Username or password"})});
    } 
    else {// does this need to be asynchronous?
      setSuccessfulLoginTime(user)
      .then(data => {
        resetFailedLogins(user)
      })
      .then(data => { 
        return done(null,user);
      }).catch(e => {
        console.log("there was an a catch error", e); 
        return done(
          null,
          false, 
          {message: "Invalid Username or password"})})
    }
  }).catch(e => {
    console.log("there was an a catch error", e); 
    return done(
      null,
      false, 
      {message: "System Error"})})
}))


  init();

module.exports = passport;
