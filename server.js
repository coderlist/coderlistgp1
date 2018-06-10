require('dotenv').config();
if(!process.env.NODE_ENV) {
  process.env.NODE_ENV = "development";
}
const passport = require('./auth/local');
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/index');

const logger = require('morgan');
const {pool} = require('./server/db/database');
const flash = require('connect-flash');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const uuidv1 = require('uuid/v1');

const app = express();


app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(logger('dev'));
app.use(express.static('assets', {}));
app.use(bodyParser.urlencoded({ extended :true }));
app.use(session({
  store: new pgSession({
    pool,                
    tableName : 'user_sessions'   
  }),
  secret: process.env.COOKIE_SECRET || SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } 
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.use('/', routes);

app.listen(process.env.PORT || 3000);

module.exports = app;