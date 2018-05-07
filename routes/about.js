const about = require('express').Router();

about.get('/', (req, res) => {
  res.status(200).render('pages/about');
});
about.all('/', (req, res) => {
  res.status(400).send({ message: 'invalid verb' });
});

module.exports = about;