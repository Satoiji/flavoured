'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
var hbs  = require('express-handlebars');
const app = express();

const userApi = require('./bot_information/bot_routes/userRoutes.js');
const ctrlVer = require('./bot_information/bot_routes/versionRoutes.js');
const beatsRoutes = require('./routes/beatsRoutes.js');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.engine('.hbs', hbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));

app.set('view engine', '.hbs');
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', userApi);
app.use('/php', ctrlVer);
app.use('/beats', beatsRoutes);

app.get('/', function(req,res){
    res.redirect('/beats');
});

module.exports = app;