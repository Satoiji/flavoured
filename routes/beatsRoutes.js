'use strict'

const beatsController = require('../controllers/beatsController.js');
const userController = require('../controllers/userController.js');
const auth = require('../middleware/authMiddleware');

const express = require('express');
const api = express.Router();

api.get('/', beatsController.index);
// api.get('/profile', auth, beatsController.profile);
// api.post('/login', userController.signIn);
// api.post('/signup', userController.signUp);

module.exports = api;