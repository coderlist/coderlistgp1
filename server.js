const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/index')
const logger = require('morgan')
const app = express();
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.static('assets', {}));
app.use(bodyParser.urlencoded({ extended :true }));

app.use('/', routes);


app.listen(process.env.PORT || 3000);

module.exports = app;
