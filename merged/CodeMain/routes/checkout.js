const express = require('express');
const router = express.Router();
const OutBill = require('../models/outbill');
const User = require('../models/user');

router.get('/', async function(req,res,next){
    res.render('checkout');
})
router.post('/add', async function (req, res) {
    var id = req.session.passport;
    var cart = [];
    var email ;
    if (id != undefined) {
        id = id.user;
        var user = await User.findById(id);
        email = user.email;
        cart = user.cart;
    }
    else {
        var cookie = req.cookies.cart;
        if (cookie != undefined) {
            cart = JSON.parse(cookie);
        }
    }
    console.log("cart ->>>>>>>" +cart)
    let outbill = new OutBill({
      code: getRandomString(6),
      totalprice: req.body.totalprice,
      note: req.body.note,
      products: cart,
      customer: id!=undefined?id:null,
      creator: id!=undefined?email:'anonymous',
      addressShip: req.body.addressShip,
      typePay: req.body.typePay,
      status: 1
    });
     try {
        let order = await outbill.save();
        console.log(order)
        if(id!=undefined){
                try {
                    await User.updateOne({ _id: id }, {
                        $set: {
                            cart: []
                        }
                    }).exec()
                    let user = await User.findById(req.user._id).exec();
                    user.orders.push(order._id);
                    await user.save();
                    res.send("add suscess!");
                } catch (error) {
                    console.log(error)
                    res.send(error);
                }
              }
              else {
                res.clearCookie('cart');
                res.send("add suscess!");
              }
     } catch (error) {
        console.log(error);
          res.send('upload Failed !')
     }
  })
  function getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }
module.exports = router;