var express = require('express');
var router = express.Router();
const User = require('../models/user');
const Header = require('../models/header')
const checkAuthenticated = require('../middlewares/authmiddleware');

/* GET home page. */
router.get('/', async (req, res) =>{
  // console.log(req.session);
  // console.log(req.session.id);
  console.log(req.user);
  
  // var id = req.session.passport;
  //       var customerCart =[];
  //       if (id == undefined) {
  //           var cookie = req.cookies.cart;
  //           if (cookie != undefined) {
  //             customerCart = JSON.parse(cookie);
  //            }
  //            else {
  //             var value = JSON.stringify(customerCart);
  //             res.cookie('cart', value, { maxAge: 900000, httpOnly: true });
  //         }
  //       }
  //       else {
  //           id = id.user;
  //           var user = await User.findOne({ _id: id });
  //           customerCart = user.cart;
            
  //       }
  res.render('index', { title: 'Express'});
});

router.get('/hdrender', async (req,res)=>{
    try{
      let header = await Header.find().exec();
      res.render("partials/header",{layout:false,header:header})
    }
    catch(err){
      console.log(err);
      res.status(400).send('error');
    }
})
module.exports = router;
