'use strict'

const beatsController = require('../controllers/beatsController.js');

const express = require('express');
const api = express.Router();

api.get('/', beatsController.index);

module.exports = api;