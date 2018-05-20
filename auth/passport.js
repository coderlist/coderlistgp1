const passport = require('passport');
const {findOne} = require('../helperFunctions/query/queryHelper');

module.exports = (user) => {
  passport.serializeUser((user, done) => {
    done(null, user.email);
  });

  passport.deserializeUser((email, done) => {
    const condition = `email = '${email}'`
    findOne('users',condition)
    .then(user => done(null, user))
    .catch(err => done(err, null))
  });

};


