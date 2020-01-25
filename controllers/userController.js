'use strict';

const User = require('../models/userModel');
const service = require('../service/authService');

function signUp(req, res){
    const user = new User({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    user.save(function(err){
        if(err) res.status(500).send({message: 'Error al almacenar'});

        return res.status(200).send({authentication: service.createToken(user)});
    });
}

function signIn(req, res){
    User.find({email: req.body.email}, function(err, user){
        if(err) return res.status(500).send({message: err});
        if(!user) return res.status(404).send({message: 'User not found'});

        req.user = user;
        res.status(200).send({
            message: 'Logged in',
            authentication: service.createToken(user)
        });
    });
}

module.exports = {
    signUp,
    signIn
}