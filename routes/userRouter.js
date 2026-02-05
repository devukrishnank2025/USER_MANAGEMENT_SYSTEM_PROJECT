const express = require('express');
const userRoute = express();
const upload = require('../multerFile/multer');
const {loadRegister,registrationUser,verifyUser,loginLoad,homeLoad,loginVerifyUser}= require('../controllers/userController');
const session = require('express-session');
const config = require('../config/secretconfig');
const { checkSession, isLogin } = require('../middleware/auth');
const nocache =require('nocache');


userRoute.use(nocache());
userRoute.use(session({
    secret: config.secretSection,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000*60*60*24 }
}));

userRoute.get('/registration',isLogin,loadRegister);

userRoute.post('/registration',upload.single('image'),registrationUser);

userRoute.get('/verify',verifyUser);

userRoute.get ('/login',isLogin,loginLoad);
userRoute.post ('/login',loginVerifyUser);


userRoute.get('/home',checkSession,homeLoad)

module.exports=userRoute;