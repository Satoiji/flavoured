'use strict'

const userController = require('../bot_controllers/userController.js');

const express = require('express');
const api = express.Router();

api.get('/fill', userController.fill);

module.exports = api;