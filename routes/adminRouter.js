const express =require('express');
const adminRoute=express.Router();
const session= require('express-session');
const config=require('../config/secretconfig');
const nocache = require('nocache');
const { loadLogin,verifyLogin,
    loadHome,
    logOut,
    forgetLoad,
    forgetMail,
    forgetPasswordLoad,
    resetPassword
} =require('../controllers/adminController');

adminRoute.use(express.json());
adminRoute.use(express.urlencoded({extended:true}));

adminRoute.use(nocache());
adminRoute.use(session({
    secret: config.secretSection,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));



adminRoute.get('/',loadLogin);
adminRoute.post('/',verifyLogin);
adminRoute.get('/home',loadHome);
adminRoute.get('/logout',logOut);
adminRoute.get('/forget',forgetLoad)
adminRoute.post('/forget',forgetMail);
adminRoute.get('/forget-password',forgetPasswordLoad)
adminRoute.post('/forget-password',resetPassword)


module.exports= adminRoute;