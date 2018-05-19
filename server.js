require('dotenv').config()
if(!process.env.NODE_ENV) {
  process.env.NODE_ENV = "development";
}
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/index')
const logger = require('morgan')
const app = express();
const validator = require('express-validator');
// const flash = require('connect-flash');
const session = require('express-session');
const uuidv1 = require('uuid/v1');

passport.use(new Strategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));

app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.static('assets', {}));
app.use(bodyParser.urlencoded({ extended :true }));
app.use(session({
    genid: function(req) {
    return uuidv1() // use UUIDs for session IDs
      },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }
));
// app.use(flash);
app.use(validator());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);

app.listen(process.env.PORT || 3000);

module.exports = app;
