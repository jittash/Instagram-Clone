const express = require('express');
const app = express()
const mongoose = require('mongoose');
const { MONGOURI } = require('./config/keys');

mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
mongoose.connection.on('connected',()=>console.log("We are connected to Mongo"));
mongoose.connection.on('error',(err)=>console.log(err));

//Include schemas
require('./models/user');
require('./models/post');

//Parse all the incoming requests before it reaches the route handler
app.use(express.json());
//Use the routers
app.use(require('./routers/auth'));
app.use(require('./routers/post'));
app.use(require('./routers/user'));

//Code to work when we are on production side
if(process.env.NODE_ENV === "production"){
    //Serve the static files
    app.use(express.static('client/build'))
    const path = require('path')
    //'*' - If client makes any request,we will send index.html file containing entire react application.
    //      It contains all the logic of front end - which component to be served on which route.
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

const hostname = "127.0.0.1";
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server Running on http://${hostname}:${PORT}`));