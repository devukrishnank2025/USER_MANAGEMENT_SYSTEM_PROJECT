const User = require('../models/userSchema');
const bcrypt = require('bcrypt');
const nodeMailer = require('nodemailer');
const randomstring = require('randomstring');
const config = require('../config/secretconfig')



const securePassword = async (password) => {
  try {
    const spass = await bcrypt.hash(password, 10);
    return spass;

  } catch (error) {

  }
}

const sendVerifyMail = async (name, email, user_id) => {

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
      subject: 'for verification mail',
      html: `<p>
        Hi ${name}, please click here to
        <a href="http://localhost:3000/verify?id=${user_id}">verify</a>
      </p>`
    }

    const info = await transporter.sendMail(mailOption);
    console.log('mail send:' + info.response);


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
        Hi ${name}, please click here to
        <a href="http://localhost:3000/forget-password?token=${token}">reset your password</a>
      </p>`
    }

    const info = await transporter.sendMail(mailOption);
    console.log('mail send:' + info.response);


  } catch (error) {
    console.log(error.message);


  }
}

const loadRegister = async (req, res) => {
  try {

    res.render('user/registration');

  } catch (error) {

    console.log(error.message);
  }

}
const registrationUser = async (req, res) => {

  const spassword = await securePassword(req.body.password);

  const user = new User({


    name: req.body.name,
    email: req.body.email,
    image: req.file.filename,
    password: spassword,
    is_admin: 0

  })
  const userData = await user.save();
  if (userData) {
    sendVerifyMail(req.body.name, req.body.email, userData._id);
  }
  res.render('user/registration', { message: 'the user has registered , you have to verify the email' })
}


const verifyUser = async (req, res) => {
  try {

    const update = await User.updateOne({ _id: req.query.id }, { $set: { is_verified: 1 } })

    res.render('user/success');

  } catch (error) {
    console.log(error.message);


  }
}

const loginLoad = async (req, res) => {
  try {
    res.render('user/login');

  } catch (error) {
    console.log(error.message);


  }
}

const loginVerifyUser = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const checkUser = await User.findOne({ email: email });

    if (checkUser) {
      const checkPass = await bcrypt.compare(password, checkUser.password);

      if (checkPass) {
        if (checkUser.is_verified === 0) {
          res.render('user/login', { message: 'please verify your ac using email...' });
        } else {
          req.session.user_id = checkUser._id;
          res.redirect('/home');
        }
      } else {
        res.render('user/login', { message: 'invalid credential...' });

      }
    } else {
      res.render('user/login', { message: 'invalid credential...' });

    }

  } catch (error) {
    console.log(error.message);


  }

}

const homeLoad = async (req, res) => {
  try {

    const userData=await User.findOne({_id:req.session.user_id});

    if(userData){
      res.render('pages/home',{user:userData});
    }else{
      res.render('404',{message:'cannot get the user'});
    }
    
  } catch (error) {
    console.log(error.message);

  }
}

const logoutUser = async (req, res) => {
  try {
    req.session.user_id = false;
    res.redirect('/login')
  } catch (error) {
    console.log(error.message);
  }
}


const forgetLoad = async (req, res) => {
  try {
    res.render('user/forget');
  } catch (error) {
    console.log(error.message);
  }
}

const forgetVerify = async (req, res) => {
  try {
    const email = req.body.email;
    const checkEmail = await User.findOne({ email: email });
    if (checkEmail) {
      const randomString = randomstring.generate();
      const updateUser = await User.updateOne({email:checkEmail.email}, { $set: { token: randomString } });
      sendResetMail(checkEmail.name, checkEmail.email, randomString);
      if(updateUser){
        res.render('user/forget', { message: 'reset link sucessfully sent...' });
      }else{
        res.render('404',{message:'token not setting'})
      }
      
    } else {
      res.render('user/forget', { message: 'account is not found.. please check email' });

    }

  } catch (error) {
    console.log(error.message);

  }
}


const resetPasswordLoad = async (req, res) => {
  try {
    const token = req.query.token;
    const userData = await User.findOne({ token: token });
    console.log(userData);
    
    
    if (userData) {
      res.render('user/resetPage', { user_id: userData._id });
    } else {
      res.render('404', { message: 'cannot load your page'});
    }

  } catch (error) {
    console.log(error.message);

  }

}

const resetPassword = async (req, res) => {
  try {
    const user_id = req.body.userId;
    const password = req.body.password;
    const securepassword = await securePassword(password);
    const userData = await User.updateOne({ _id: user_id }, { $set: { password: securepassword } });
    if (userData) {
      const deleteToken= await User.updateOne({_id:user_id},{$unset:{token:''}});
      res.render('user/login', { message: 'password reset done....' })
    } else {
      res.render('404', { message: "can't getting that" });
    }


  } catch (error) {
    console.log(error.message);
    console.log('here is the error');


  }
}
const secondUserVerification= async(req,res)=>{
  try {
    res.render('user/verification');

  } catch (error) {
    
  }
}

const secondUserVerificationLink = async(req,res)=>{
  const email= req.body.email;
  const userData= await User.findOne({email:email});
  if(userData){
    sendVerifyMail(userData.name,userData.email,userData._id);

    res.render('user/verification',{message :'please check your email verification has been sent'});
  }else{
    res.render('user/verification',{message:'cant send the email user not found'});
  }
}
const editUserLoad =async(req,res)=>{
  const id= req.query.id;
  const userData = await User.findOne({_id:id});
  if(userData){
    res.render('pages/edit',{user:userData});
  }
}

const editUser = async(req,res)=>{
  if(req.file){
    const userData= await User.updateOne({_id:req.body.user_id},{$set:{
      email:req.body.email,
      name:req.body.name,
      image:req.file.filename
    }})
    
    if(userData){
      res.redirect("/home")
    }else{
      res.render('404',{message:'not updated'})
    }
  }else{
    const userData= await User.updateOne({_id:req.body.user_id},{$set:{
      email:req.body.email,
      name:req.body.name
        }})
    res.redirect('/home');
  }
}


module.exports = {
  loadRegister,
  registrationUser,
  verifyUser,
  loginLoad,
  homeLoad,
  loginVerifyUser,
  logoutUser,
  forgetVerify,
  forgetLoad,
  resetPasswordLoad,
  resetPassword,
  secondUserVerification,
  secondUserVerificationLink,
  editUserLoad,
  editUser
};