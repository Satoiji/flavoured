'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const userApi = require('./routes/userRoutes.js');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/user',userApi);

module.exports = app;