const express = require('express');
const app = express();
const User =require('./models/userSchema');
const upload = require('./multerFile/multer');
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/userManagement_system')




app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static('public'));



app.set('view engine','ejs');
app.set('views','./views');




app.get('/registration',(req,res)=>{
    res.render('user/registration');
})


app.post('/registration',upload.single('image'),(req,res)=>{


    const user = new User({
        name:req.body.name,
        email:req.body.email,
        image:req.file.filename,
        password:req.body.password,
        is_admin:0
        })

        user.save();

        res.render('user/success')

})
 


app.listen('3000',()=>{
    console.log('server has started');
})