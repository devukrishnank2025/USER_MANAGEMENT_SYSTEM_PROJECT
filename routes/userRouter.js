const express = require('express');
const userRoute = express();
const upload = require('../multerFile/multer');
const {loadRegister,registrationUser,verifyUser}= require('../controllers/userController');



userRoute.get('/registration',loadRegister);

userRoute.post('/registration',upload.single('image'),registrationUser);

userRoute.get('/verify',verifyUser)

module.exports=userRoute;