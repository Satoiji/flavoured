'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const userApi = require('./routes/userRoutes.js');
const ctrlVer = require('./routes/versionRoutes.js')

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/user',userApi);
app.use('/php',ctrlVer);

module.exports = app;