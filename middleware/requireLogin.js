const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys');
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = (req,res,next) =>{
    const { authorization } = req.headers;
    //authorization format = Bearer token
    if(!authorization)
        return res.status(400).json({error:"You must be logged in"});
    //Getting exact token
    const token = authorization.replace("Bearer ","");
    //Token verification
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err)
            return res.status(400).json({error:"You must be logged in"});
        const { _id } = payload;
        User.findOne(_id).then(userdata=>{
            //Attaching user details in req.user
            req.user = userdata;
            next()
        })
        
    })
}