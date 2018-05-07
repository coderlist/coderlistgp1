const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/index')
const about = require('./routes/about')
const app = express();

app.use(express.static('public', {}));
app.use(bodyParser.urlencoded({ extended :true }));

app.set('view engine', 'ejs');

app.use('/', routes);
app.use('/about', about);

app.use(function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('pages/unknown.ejs', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});

app.listen(process.env.PORT || 3000);