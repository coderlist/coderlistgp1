const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {verifyPassword} = require('./verify');
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
     if(!user) {return done(null,false)}
     if(verifyPassword(password,user.password)===false){ return done(null,false)}
     return done(null,user)
    }).catch(e => {return done(null,false)})
  }
  ));

  init();

module.exports = passport;
