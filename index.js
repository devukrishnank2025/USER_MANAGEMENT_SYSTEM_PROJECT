const express = require('express');
const app = express();
const User =require('./models/userSchema');
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/userManagement_system')




app.use(express.urlencoded({extended:true}));
app.use(express.json());



app.set('view engine','ejs');
app.set('views','./views');




app.get('/registration',(req,res)=>{
    res.render('user/registration');
})


app.post('/registration',(req,res)=>{


    const user = new User({
        name:req.body.name,
        email:req.body.email,
        
        password:req.body.password,
        is_admin:0
        })

        user.save();

        res.render('user/success')

})



app.listen('3000',()=>{
    console.log('server has started');
})