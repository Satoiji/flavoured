const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    username: String,
    avatar: {type: String, default: 'https://gravatar.com/avatar/?s=200&d=retro'},
    password: {type: String, select: false},
    signupDate: {type: Date, default: Date.now()},
    lastLogin: Date
});

UserSchema.pre('save', function(next){
    let user = this;
    if(!user.isModified('password')) return next();
    bcrypt.genSalt(10, function(err, salt){
        if(err) return next();
        bcrypt.hash(user.password, salt,  null, function(err, hash){
            if(err) return next();
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.gravatar = function(){
    if(!this.email) return 'https://es.gravatar.com/avatar?s=200&d=retro';

    const md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return 'https://gravatar.com/avatar/'+md5+'?s=200&d=retro';
}

module.exports = mongoose.model('web_user', UserSchema);
