'use strict'

const mongoose = require('mongoose');
const app = require('./app.js')
const config = require('./config.js');

mongoose.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, res){
    if  (err) return console.log("Database connection error");

    app.listen(config.port, () => {
        console.log('Page up');
    });
});