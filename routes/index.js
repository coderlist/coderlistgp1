const routes = require('express').Router();

routes.get('/', (req, res) => {
  res.status(200).render('pages/index.ejs');
});
routes.all('/', (req, res) => {
  res.status(400).send({ message: 'invalid verb' });
});

module.exports = routes;