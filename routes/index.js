<<<<<<< HEAD
const express = require('express');
const routes = express.Router();
const {getAllUsers,createUser} = require('./../server/controllers/users');
const {createPage} = require('./../server/controllers/pages');


/** use database controller CRUD function 
 * with routes
 */

routes.get('/users', getAllUsers);

routes.post('/users', createUser);

routes.post('/pages', createPage)

module.exports = {
  routes
}
=======
const routes = require('express').Router();

// basic //

routes.get('/', (req, res) => {
  res.status(200).render('pages/index.ejs');
  return;
});

routes.get('/about', (req, res) => {
    res.status(200).render('pages/about.ejs');
    return;
});

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
  res.status(200).render('pages/users/forgotPassword.ejs');
  return;
});

// pages //

routes.get('/content/manage-page', (req, res) => {
  res.status(200).render('pages/content/createEditPage.ejs');
  return;
});

routes.get('/content/manage-all-pages', (req, res) => {
  res.status(200).render('pages/content/manageAllPages.ejs');
  return;
});

// unknown //

routes.all('*', (req, res) => {
  res.status(200).render('pages/unknown.ejs', { url: req.url });
  return;
});

module.exports = routes;
>>>>>>> develop
