const passport = require('passport');
const {findByEmail} = require('../helperFunctions/query/queryHelper');


/**
 * @param  {} user
 * user serializer and deserializer
 * to and from session
 */

module.exports = (user) => {
  passport.serializeUser((user, done) => {
    done(null, user.email);
  });

  passport.deserializeUser((email, done) => {
    findByEmail('users',email)
    .then(user => done(null, user))
    .catch(err => done(err, null))
  });

};


