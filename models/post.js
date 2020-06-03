const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
    title:{
        type:String
    },
    body:{
        type:String
    },
    photo:{
        type:String,
    },
    postedBy:{
        type:ObjectId,
        ref:"User"    
    },
    //Likes Array to store id of users who liked the post
    likes:[{
        type:ObjectId,
        ref:"User"
    }],
    //Comments Array to store comments
    comments:[{
        text:String,
        postedBy:{
            type:ObjectId,
            ref:'User'
        }
    }]
})
mongoose.model("Post",postSchema);