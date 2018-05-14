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