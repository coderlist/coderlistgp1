const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {verifyPassword} = require('./verify');
const {createUser} = require('../models/users')
const {findBy, findOne} = require('../../helperFunctions/queryHelper')
const options = {
  usernameField: 'email',
  passwordField: 'password'
};
let condition;
const init = require('./passport');



passport.use('local-login',new LocalStrategy(options, 
  (email, password, done) => {
    condition = `email = '${email}'`
   findBy('users',condition)
   .then(users => {
    if (users.length === 0) {
       return done(null, false, {mesage:'Incorrect Username' }); 
      }
    if (!verifyPassword(password,users[0])){
      return done(null, false, {mesage:'wrong password' }); 
    }
    return done(null, users[0]);
   }).catch((err) => {return done(err)});

}));


passport.use('local-signup',new LocalStrategy(options,
   (email, password, done) => {
   condition = `email = '${email}'`
   findBy('users',condition)
   .then(user => {
    if (user.length !== 0) {
      return done(null,false, {mesage:'user already exist' })
    }
    if (user.length === 0) { 
      user = { email,password}
     createUser(user)
     .then(user => done(null, user, {mesage:'signup successful' }))
  }
   }).catch((err) => {return done(err)});

}));

init();

module.exports = passport;
