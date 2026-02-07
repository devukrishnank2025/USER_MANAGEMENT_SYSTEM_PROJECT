const User = require('../models/userSchema');
const bcrypt = require('bcrypt');
const randomstring =require('randomstring');
const nodeMailer= require('nodemailer');
const config=require('../config/secretconfig')

const securePassword = async (password) => {
  try {
    const spass = await bcrypt.hash(password, 10);
    return spass;

  } catch (error) {

  }
}

const loadLogin = async (req, res) => {
    try {
        res.render('admin/login');
    } catch (error) {
        console.log(error.message);

    }
}


const sendResetMail = async (name, email, token) => {

  try {
    const transporter =
      nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: config.gEmail,
          pass: config.gPass
        }
      })
    const mailOption = {
      from: 'devukrishnan228@gmail.com',
      to: email,
      subject: 'for resetPassword',
      html: `<p>
        Hi Adimin:${name}, please click here to
        <a href="http://localhost:3000/admin/forget-password?token=${token}">reset your admin password</a>
      </p>`
    }

    const info = await transporter.sendMail(mailOption);
    console.log('mail send:' + info.response);


  } catch (error) {
    console.log(error.message);


  }
}  


const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const adminData = await User.findOne({ email: email });
        if (adminData) {
            const compare = await bcrypt.compare(password, adminData.password);

            if (compare) {
                if (adminData.is_admin === 0) {
                    res.render('admin/login', { message: 'ivalid credentials' });
                } else {
                    req.session.user_id = adminData._id;
                    res.render('admin/home');
                }
            }else{
                    res.render('admin/login', { message: 'ivalid credentials' });

            }
        }else{
                    res.render('admin/login', { message: 'ivalid credentials' });

        }
    } catch (error) {
        console.log(error.message);
    }
}
const loadHome = async (req, res) => {
    try {
        res.render('admin/home');

    } catch (error) {
    }
}
const logOut = async (req, res) => {
    try {
        req.session.user_id=false;
        res.redirect('/admin');
    } catch (error) {
        console.log(error.message);
    }
}

const forgetLoad =async(req,res)=>{
    try {
         res.render('admin/forget')
    } catch (error) {
        console.log(error.message);
        
        
    }
   
}

const forgetMail =async(req,res)=>{
    try {
        const email = req.body.email;

        const adminData = await User.findOne({email:email});

        if(adminData){
            if(adminData.is_admin===0){
                res.render('admin/forget',{message:'admin not found'})
            }else{
                const randomString =  randomstring.generate();
                const adminUpdate = await User.updateOne({email:email},{$set:{token:randomString}});
                const linkSent = await sendResetMail(adminData.name,adminData.email,randomString);

                res.render('admin/forget',{message:'reset mail sent to your email '})
            }
        }else{
            res.render('admin/forget',{message:'not found'})
        }        
    } catch (error) {
        console.log(error.message);
        
        
    }

}


const forgetPasswordLoad = async(req,res)=>{
    try {
        const token=req.query.token;
        const adminData=await User.findOne({token:token});
        if(adminData){
            res.render('admin/resetPassword',{user_id:adminData._id});
        }else{
            res.render('404',{message:'something error on admin reset'});
        }
        
    } catch (error) {
        console.log(error.message);
    }
}


const resetPassword = async(req,res)=>{
    try {
        const adminPassword =req.body.password;
        const id=req.body.user_id;
        const securepass= await securePassword(adminPassword);

        const adminData =await User.updateOne({_id:id},{$set:{password:securepass,token:''}})
        res.redirect('/admin');        
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadLogin,
    verifyLogin,
    loadHome,
    logOut,
    forgetLoad,
    forgetMail,
    forgetPasswordLoad,
    resetPassword
}