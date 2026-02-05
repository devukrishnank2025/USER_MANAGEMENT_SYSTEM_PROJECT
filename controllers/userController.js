const User =require('../models/userSchema');
const bcrypt =require('bcrypt');
const nodeMailer=require('nodemailer');



const securePassword= async(password)=>{
  try {
    const spass = await bcrypt.hash(password,10);
    return spass;
    
  } catch (error) {
    
  }
}

const sendVerifyMail= async(name,email,user_id)=>{

  try {
    const transporter = 
    nodeMailer.createTransport({
      host:'smtp.gmail.com',
      port:587,
      secure:false,
      requireTLS:true,
      auth:{
        user:'devukrishnan228@gmail.com',
        pass:'hnxa yhcs zcmd qhqb'
      }
    })
  const mailOption={
      from:'devukrishnan228@gmail.com',
      to: email,
      subject:'for verification mail',
      html: `<p>
        Hi ${name}, please click here to
        <a href="http://localhost:3000/verify?id=${user_id}">verify</a>
      </p>`
    }

       const info = await transporter.sendMail(mailOption);
       console.log('mail send:'+info.response);
       
    
  } catch (error) {
    console.log(error.message);
    
    
  }
}

const loadRegister = async (req,res)=>{
   try {

     res.render('user/registration');

   } catch (error) {
     
    console.log(error.message);
   }
   
  }
  const registrationUser = async(req,res)=>{
  
      const spassword = await securePassword(req.body.password);
  
      const user = new User({
  
  
          name:req.body.name,
          email:req.body.email,
          image:req.file.filename,
          password:spassword,
          is_admin:0

          })
          const userData= await user.save();
          if(userData){
            sendVerifyMail(req.body.name,req.body.email,userData._id);
          }
          res.render('user/registration',{message:'the user has registered , you have to verify the email'})
  }


  const verifyUser = async(req,res)=>{
    try {
      
      const update = await User.updateOne({_id:req.query.id},{$set:{is_verified:1}})
      
      res.render('user/success');

    } catch (error) {
      console.log(error.message);
      
      
    }
  }

module.exports = {loadRegister,registrationUser,verifyUser};