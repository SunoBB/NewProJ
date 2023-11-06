const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const initializePassport = require('../passport-config');
const {enforceAuthentication,forwardAuthentication} = require('../middlewares/auth');
const checkAuthentication = require('../middlewares/authmiddleware');
initializePassport(
    passport, 
    async function (email){
    let user = await User.findOne({email:email}).exec();return user;},
    async function (id){
        let user = await User.findById(id).exec();
        return user;
    }
)
router.get('/login',forwardAuthentication,function(req,res,next){
    res.render('authentication/login',{layout: false});
})

router.post('/login',passport.authenticate('local',{
    failureRedirect:'/auth/login',
    failureFlash:true
}),function(req,res){
    if(req.body.remember)
    {
        req.session.cookie.maxAge = 30*24*60*60*1000;
    }
    else{
        req.session.cookie.expires = false;
    }
    console.log(req.session.passport)

    res.redirect('/');
})

router.get('/register',function(req,res,next){
    res.render('authentication/register',{layout:false,message:req.flash('message'),success:req.flash('success')});
})

router.post('/register',async function(req,res,next){
        let checkExisted = await User.count({email:req.body.email}).exec();
        console.log(checkExisted)
        if(checkExisted >0)
        {
            res.status(400).send('Email đã được đăng ký');
        }
        else{
            const hashedPassword = await bcrypt.hash(req.body.password,10);
            const user = new User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: hashedPassword
            });
            try {
                await user.save();
                res.send('Đăng ký thành công');
            }
            catch(error){
                console.log(error);
                res.status(400).send('Đã có lỗi xảy ra');
            }
        }
    }
)

router.get('/logout',function(req,res,next){
    req.logOut();
    res.redirect('/');
})
module.exports = router;