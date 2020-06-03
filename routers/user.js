const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model("Post")
const requireLogin = require('../middleware/requireLogin')
const User = mongoose.model("User")

//Router to see user profile
router.get('/user/:id',requireLogin,(req,res)=>{
    User.findOne({_id:req.params.id})
    .select('-password')
    .then(user=>{
        Post.find({_id:req.params.id})
        .populate('postedBy','_id name')
        .exec((err,posts)=>{
            if(err){
                return res.status(404).json({error:err})
            }
            res.json({user,posts})
        })
    }).catch(err=>{
        return res.status(404).json({error:'User not found'})
    })
})

//Route to follow user
router.put('/follow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followid,{  //id of person logged person wants to follow
        $push:{ followers:req.user._id }  //id of loggedin user
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(404).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $push:{ following:req.body.followid },    
        },{
            new:true
        }).select('-password')
        .then(result=>res.json(result))
        .catch(err=>{
            return res.status(404).json({error:err})
        })
    }
    )
})

//Route to unfollow user
router.put('/unfollow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowid,{  //id of person logged person wants to follow
        $pull:{ followers:req.user._id }  //id of loggedin user
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(404).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $pull:{ following:req.body.unfollowid },    
        },{
            new:true
        }).select('-password')
        .then(result=>res.json(result))
        .catch(err=>{
            return res.status(404).json({error:err})
        })
    }
    )
})

//Route to update profile pic
router.put('/updatepic',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},{new:true},
        (err,result)=>{
            if(err){
                return res.status(404).json({error:'pic cannot post'})
            }
            res.json(result)
    })
})

module.exports = router