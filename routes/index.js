const routes = require('express').Router();

routes.get('/', (req, res) => {
  res.status(200).render('pages/index.ejs');
  return;
});

routes.all('/', (req, res) => {
  res.status(400).send({ message: 'invalid verb' }); //should we do this? I have put a note in a Trello list called "Questions and clarifications".
  return;
});

routes.get('/about', (req, res) => {
    res.render('pages/about.ejs', { url: req.url });
    return;
});

routes.all('/about', (req, res) => {
  res.status(400).send({ message: 'invalid verb' });
  return;
});   //should we do this? I have put a note in a Trello list. The name of the Trello list is "Questions and clarifications".

// users //

routes.get('/admin', (req, res) => {
  res.status(200).render('pages/admin.ejs');
  return;
});

routes.get('/login', (req, res) => {
  res.status(200).render('pages/login.ejs');
  return;
});

routes.get('/users/manage-users', (req, res) => {
  res.status(200).render('pages/users/createEditUser.ejs');
  return;
});

routes.get('/users/forgot-password', (req, res) => {
  res.render('pages/users/forgotPassword.ejs');
  return;
});

// pages //

routes.get('/content/manage-page', (req, res) => {
  res.render('pages/content/createEditPage.ejs');
  return;
});

routes.get('/content/manage-all-pages', (req, res) => {
  res.render('pages/content/manageAllPages.ejs');
  return;
});

routes.get('*', (req, res) => {
  res.render('pages/unknown.ejs', { url: req.url });
  return;
});

module.exports = routes;