const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model("Post")
const requireLogin = require('../middleware/requireLogin')

//Router to get all posts in feed
router.get('/allPost',requireLogin,(req,res)=>{
    Post.find()
    //Populate user to expand posted by,Second arg populates only the id and name of user
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .then(posts=>{
        res.json({posts});
    })
    .catch(err=>{
        console.log(err)
    })
})

//Router to get posts of following
router.get('/followingpost',requireLogin,(req,res)=>{

    //If postedBy in following
    Post.find({ postedBy:{$in:req.user.following}})
    
    //Populate user to expand posted by,Second arg populates only the id and name of user
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .then(posts=>{
        res.json({posts});
    })
    .catch(err=>{
        console.log(err)
    })
})

//Router to create a post
router.post('/createPost',requireLogin,(req,res)=>{
    const { title,body,url } = req.body;
    if( !title|| !body|| !url)
        return res.json({error:"Enter all fields"});
    //console.log(req.user);
    req.user.password= undefined;
    const post = new Post({
        title,
        body,
        photo:url,
        postedBy:req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>
        console.log(err));
})

//Router to see the posts of myself
router.get('/myPost',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})

//Router to like post
router.put('/like',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{ likes:req.user._id}  //Pushing userId in likes array in post model
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(404).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

//Router to unlike post
router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{ likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(404).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

//Router to comment post
router.put('/comment',requireLogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{ comments:comment}  //Pushing comment object in comments array in 'post' model
    },{
        new:true
    })
    .populate('comments.postedBy','_id name')
    .populate('postedBy','_id name')
    .exec((err,result)=>{
        if(err){
            return res.status(404).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

//Router to delete post
router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findOne({ _id:req.params.postId })
    .populate('postedBy','_id')
    .exec((err,post)=>{
        if(err || !post){
            return res.status(404).json({ error:err })
        }
        //Delete only when user is login
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
        }
    })
})

module.exports = router;