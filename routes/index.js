const express = require('express');
const routes = express.Router();
const {getAllUsers, createUser} = require('./../server/controllers/users');


/* GET users listing. */
routes.get('/users', getAllUsers);

routes.post('/users', createUser);

module.exports = {
  routes
}

