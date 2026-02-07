const isLogin =async(req,res,next)=>{
    if(req.session.user_id){
        next();
    }else{
        res.redirect('/admin');

    }
}
const isLogout =async(req,res,next)=>{
    if(req.session.user_id){
        res.redirect('admin/home');
    }else{
        next();
    }
    
}
module.exports={isLogin,isLogout}