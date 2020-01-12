'use strict'

const authService = require('../service/authService');

function isAuth(req, res, next){
    if(!req.headers.authentication) return res.status(403).send({message: 'No Auth'});
    
    const token = req.headers.authentication.split(" ")[1];

    authService.decodeToken(token)
        .then(function(response){
            req.user = response;
            next()
        })
        .catch(function(response){
            res.status(response.status).send({message: response.message});
        })
}

module.exports = isAuth;