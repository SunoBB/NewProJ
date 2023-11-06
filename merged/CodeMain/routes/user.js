var express = require('express');
var router = express.Router();
var Outbill = require('../models/outbill')
var User = require('../models/user')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/info', function (req, res, next) {
  let user = req.user;
  res.render('profile', { user: user })
});
router.get('/orders', async function (req, res) {
  let user = await User.findById(req.user._id);
  await user.populate('orders');
  let orders = user.orders;
  res.render('order', { orders: orders })
})

router.post('/info', async function (req, res) {
  let userId = req.user._id;
  let phone = req.body.phone;
  let street = req.body.street;
  let district = req.body.district;
  let city = req.body.city;
  try{
    let user = await User.findById(userId).exec();
    user.address.city = city;
    user.address.district = district;
    user.address.street = street;
    user.phone = phone;
    await user.save();
    res.status(200).render('profile',{user:user,msg:'success'});
  }
  catch(error){
    console.log(error);
    res.status(400).render('profile',{user:user,msg:'error'});
  }
})
module.exports = router;
