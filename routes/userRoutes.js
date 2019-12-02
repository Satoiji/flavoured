'use strict'

const userController = require('../controllers/userController.js');

const express = require('express');
const api = express.Router();

api.get('/fill', userController.fill);

module.exports = api;