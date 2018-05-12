const express = require('express');
const bodyParser = require('body-parser');
const {routes} = require('./routes/index')
const { createUser } = require('./server/controllers/users');


const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', routes)


module.exports = app;
