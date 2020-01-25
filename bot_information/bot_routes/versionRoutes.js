'use strict'

const controller = require('../bot_controllers/vController.js');

const express = require('express');
const api = express.Router();

//api.get('/test', userController.getUser);
api.get('/restart', controller.restart);
api.get('/update', controller.gitpull);
api.get('/put', controller.gitpush);

module.exports = api;