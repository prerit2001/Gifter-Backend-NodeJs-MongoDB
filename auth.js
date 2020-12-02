const express = require('express');
const Router = express.Router();
const User = require('./schema.js');
const Post = require('./wishschema.js');
const Message = require('./MessageSchema');
const Follow = require('./FollowSchema');
const bcrypt = require('bcryptjs');
const shortid = require('shortid');
const jwt = require('jsonwebtoken');

Router.post('/signup',(req,res)=>{
    User.findOne({Email: req.body.Email})
    .exec(async (error, user) => {
        if(user) return res.status(400).json({
            message: 'Already Created' 
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
                const _id = data._id;
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


Router.post('/myallpost',(req,res)=>{
    Post.find({postedBy: req.body._id})
    .populate("Posted By","_id Name")
    .then(mypost => {
        return res.json(mypost);
    })
    .catch(error=>{
        return res.json(error);
    })
})


Router.get('/user/:id',(req,res)=>{
    // console.log(req.params.id);
    User.findOne({_id:req.params.id})
    .then(user=>{
         Post.find({postedBy:req.params.id})
         .populate("Posted By","_id Name")
         .exec((err,posts)=>{
             if(err){
                 return res.status(422).json({error:err})
             }
             res.json({user,posts})
         })
    }).catch(err=>{
        return res.status(404).json(err)
    })
});



Router.post('/follow',(req,res)=>{
        
        const {
            To,
            From
        } = req.body;
        
    
        const _follow = new Follow({
           To,
           From
        });

        _follow.save((error, data) => {
            if(error){
                return res.status(400).json({
                    message: error
                });
            }
            if(data){
                return res.status(201).json({
                   data
                })
            }
        });

    
});

Router.post('/unfollow',(req,res)=>{
        
        const {
            To,
            From
        } = req.body;
        
        Follow.find({To: To,From: From})
        .deleteMany((error, data) => {
            if(error){
                return res.status(400).json({
                    message: error
                });
            }
            if(data){
                return res.status(201).json({
                   data
                })
            }
        });

    
});

Router.post('/checkfollow',(req,res)=>{
        
    const {
        To,
        From
    } = req.body;

    const query = { To: To, From: From };
    
    Follow.countDocuments({ To: To, From: From }, function(err, result) {
        if (err) {
          res.send(err);
        } else {
          res.json(result);
        }
      });



});


Router.post('/userfollower',(req,res)=>{

    
    Follow.countDocuments({ To: req.body.id}, function(err, result) {
        if (err) {
          res.send(err);
        } else {
          res.json(result);
        }
      });



});
Router.post('/userfollowing',(req,res)=>{

    
    Follow.countDocuments({ From: req.body.id}, function(err, result) {
        if (err) {
          res.send(err);
        } else {
          res.json(result);
        }
      });



});

Router.post('/findmail',(req,res)=>{
    let mailPattern = new RegExp("^"+req.body.Mail)

    User.find({Email: {$regex:mailPattern}})
    .then(user => {
        return res.json(user);
    })
    .catch(error=>{
        return res.json(error);
    })
})

Router.post('/finduser',(req,res)=>{
   

    User.find({_id: req.body.finduser})
    .then(user => {
        console.log(user);
        return res.json(user);
        
    })
    .catch(error=>{
        return res.json(error);
    })
})

Router.post('/detailUserFollower',(req,res)=>{
    // console.log(req.params.id);
    var fff;
    Follow.find({To :req.body._id})
    .then(user=>{
        // console.log(user);
        // user.map(item =>{
        //     User.find({_id : item.From})
        //     .then((follower)=>{
        //       //  fff += JSON.stringify(follower); 
        //          return res.json(follower)
        //     }).catch(err=>{
        //         return res.status(405).json(err)
        //     })
        // })
         
        console.log(user);
       return res.json(user);
    }).catch(err=>{
        return res.status(405).json(err)
    })
});

Router.post('/sendmessage',(req,res)=>{
        
    const {
        To,
        From,
        message
    } = req.body;
    
    //console.log(message)

    const _Mesage = new Message({
       To,
       From,
       message
    });

    _Mesage.save((error, data) => {
        if(error){
            return res.status(400).json({
                message: error
            });
        }
        if(data){
            return res.status(201).json({
               data
            })
        }
    });


});
Router.post('/findallmessages',(req,res)=>{
    Message.find({To :req.body.id}).sort({"createdAt": -1})
    .then(user=>{
         return res.status(200).json(user)
    }).catch(err=>{
        return res.status(405).json(err)
    })
});

module.exports = Router;