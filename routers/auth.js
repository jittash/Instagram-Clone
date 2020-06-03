const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys');
const requireLogin = require('../middleware/requireLogin'); 

router.get('/', (req, res) =>
    res.send('Hello')
)

router.get('/protected',requireLogin, (req,res) => 
    res.send('Signed in User')
)

router.post('/signup', (req, res) => {
    const { name, email, password,pic } = req.body;
    //console.log(name,email,password);
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Add all the fields" })
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(400).json({ error: "User with this email already exists" })
            }
            bcrypt.hash(password,10)
                .then(hashedPassword => {
                    //Saving user in database
                    const user = new User({
                        name,
                        email,
                        password:hashedPassword,
                        pic:pic
                    })
                    user.save()
                        .then(user => {
                            res.json({ message: "Saved Successfully" })
                        })
                        .catch(err => {
                            console.log("X");
                        })
                })

        })
        .catch(err => console.log("Y"))
})

router.post('/signin', (req,res) => {
    const { email,password } = req.body;
    if(!email||!password)
        return res.status(400).json({error:"Invalid Email or Password"});
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser)
            return res.status(400).json({error:"Invalid Email or Password"});
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                //res.json({message:"Successfully Signed in"});
                const token = jwt.sign({id:savedUser._id},JWT_SECRET);
                const { _id,name,email,followers,following,pic } = savedUser
                res.json({ token,user:{_id,name,email,followers,following,pic} })
            }
            else{
                return res.json({error:"Invalid Username or password"});
            }
        })
        .catch(err=>
            console.log(err));
    })
})

module.exports = router;

