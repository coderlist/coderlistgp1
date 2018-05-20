const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const {verifyPassword} = require('./verify');
const {findByUsername} = require('../helperFunctions/query/queryHelper')
const options = {
  usernameField: 'email',
  passwordField: 'password'
};
let condition;
const init = require('./passport');

init();


passport.use(new Strategy(options,
  (email,password,done) => {
    findByUsername('users',email)
    .then(user => {
     if(false) {return done(null,false)}
     if(!verifyPassword(password, user)){return done(null,false)}
     return done(null,user)
     console.log(user)
    })
  }
  ));




module.exports = passport;
