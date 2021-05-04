const config = require('../config/auth.config');
const db = require('../models');
const User = db.user;
const Role = db.role;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    });
    user.save((err, user) => {
        if(err) return res.status(500).send({message: err});
        if(req.body.roles) {
            Role.find({
                name : { $in: req.body.roles }
            }, (err, roles) => {
                if(err) return res.status(500).send({message: err});
                user.roles = roles.map(role => role._id);
                user.save((err)=>{
                    if(err) return res.status(500).send({message: err});
                    res.send({message: 'Registered user successfully!'});
                });
            });
        } else {
            Role.findOne({name: 'user'}, (err, role) => {
                if(err) return res.status(500).send({message: err});
                user.roles = [role._id];
                user.save((err)=>{
                    if(err) return res.status(500).send({message: err});
                    res.send({message: 'Registered user successfully!'});
                });
            });
        }
    });
}

exports.signin = (req, res) => {
    User.findOne({username: req.body.username}).populate('roles', '-__v').exec((err, user) => {
        if(err) return res.status(500).send({message: err});
        if(!user) return res.status(404).send({message: 'User not found'});
        const isPassValid = bcrypt.compareSync(req.body.password, user.password);
        if(!isPassValid) return res.status(401).send({message: 'Invalid Password!', accessToken: null});
        const token = jwt.sign({id: user.id}, config.secret, {expiresIn: 86400});
        var authorities = [];
        for(let i = 0; i <user.roles.length; i++){
            authorities.push(`ROLE_${user.roles[i].name.toUpperCase()}`)
        }
        res.send({
            accessToken: token,
            id: user._id,
            username: user.username,
            roles: authorities,
            email:user.email
        });
    });
}