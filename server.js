require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const {routes} = require('./routes/index')
const { createUser } = require('./server/controllers/users');
const {pool} = require('./server/db/database');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);


const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
    store: new pgSession({
        pool,
        tableName: 'session'
    }),
    secret: process.env.FOO_COOKIE_SECRET,
    resave: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
}))

app.use('/', routes)


module.exports = app;
