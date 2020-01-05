'use strict'

const express = require('express');
const bodyParser = require('body-parser');
var hbs  = require('express-handlebars');
const app = express();

const userApi = require('./routes/userRoutes.js');
const ctrlVer = require('./routes/versionRoutes.js');
const beatsRoutes = require('./routes/beatsRoutes.js');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.engine('.hbs', hbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));

app.set('view engine', '.hbs');

app.use('/user', userApi);
app.use('/php', ctrlVer);
app.use('/beats', beatsRoutes);

module.exports = app;