const express = require('express');
const Router = express.Router();
const User = require('./schema.js');
const Post = require('./wishschema.js');
const bcrypt = require('bcryptjs');
const shortid = require('shortid');
const jwt = require('jsonwebtoken');

Router.post('/signup',(req,res)=>{
    User.findOne({Email: req.body.Email})
    .exec(async (error, user) => {
        if(user) return res.status(400).json({
            message: 'Already Created' + user
        })
        
        const {
            Name,
            Moto,
            Phone,
            Age,
            Email,
            Password
        } = req.body;
        
        const hash_password = await bcrypt.hashSync(Password, 10);
        // const hash_password = Password;

        const _user = new User({
            Name,
            Moto,
            Phone,
            Age,
            Email,
            hash_password,
            username: shortid.generate()
        });

        _user.save((error, data) => {
            if(error){
                return res.status(400).json({
                    message: error
                });
            }
            if(data){
                const token = jwt.sign({_id : data._id}, 'MERNSECRET', {expiresIn: '3h'});
                return res.status(201).json({
                    token,
                    user: {
                        _id,Name, Moto, Phone, Age, Email
                    }
                })
            }
        });

    })
});

Router.post('/signin',(req,res)=>{
    User.findOne({Email: req.body.Email})
    .exec(async (error,user)=> {
        if(error) return res.status(400).json({error});
        if(user){
            if(user.authenticate(req.body.Password)){
                const token = jwt.sign({_id : user._id}, 'MERNSECRET', {expiresIn: '3h'});
                const {
                    _id,
                    Name,
                    Moto,
                    Phone,
                    Age,
                    Email
                } = user;
                res.status(200).json({
                    token,
                    user: {
                        _id,Name, Moto, Phone, Age, Email
                    }
                })
            }
            else{
                return res.status(400).json({
                    message: 'Invalid Password'
                })
            }
        }
        else{
            return res.status(400).json({message: 'Invalid Credential - Server Timed Out'})
        }
    })
});


Router.post('/postdata',(req,res)=>{
    
    const {
        Title,
        Heading,
        Priority,
        Pic,
        Category,
        Subject,
        postedBy
    } = req.body 

    const post = new Post({
        Title,
        Heading,
        Priority,
        Pic,
        Category,
        Subject,
        postedBy
    });

    post.save().then(result=>{
        return res.status(200).json({post: result})
    })
    .catch(err=>{
        return res.status(400).json(err);
    })
});


module.exports = Router;