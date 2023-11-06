var express = require('express');
var router = express.Router();
const OutBill = require('../models/outbill');
const Product = require('../models/product');

/* GET users listing. */
router.get('/',async function (req, res, next) {
  let page = (typeof req.query.page != 'undefined')?req.query.page:1;
    console.log(page);
    let pageSize = 6;
    OutBill.find().skip((page-1)*pageSize).limit(pageSize).exec((err,outbills)=>{
        OutBill.countDocuments((err,count)=>{   
            if(err) return next(err);
            res.render('partials/bill/table',{
              outbills:outbills,
                current:page,
                pages:Math.ceil(count/pageSize)
            })
        })
    })
});
router.get('/add', async function (req, res) {
  let getAllProducts = await Product.find();
  res.render("partials/bill/add", { products: getAllProducts });
})
router.post('/add', async function (req, res) {
  let outbill = new OutBill({
    code: getRandomString(6),
    totalprice: req.body.totalprice,
    note: req.body.note,
    products: req.body.products,
    user: req.body.user,
    addressShip: req.body.addressShip,
    typePay: req.body.typePay,
    status: 1
  });
  outbill.save().then(result => {
    console.log(result);
    res.send('upload suscess !')
  }).catch(err => {
    console.log(err);
    res.send('upload Failed !')
  })
})
router.get("/detail/:code",async function(req,res){
  const code = req.params.code;
  let getAllProducts = await Product.find();
  var bill = await OutBill.findOne({code:code});
  res.render("partials/bill/detail",{bill:bill,products:getAllProducts});
})
router.put("/update/:code",async function(req,res){
  const code = req.params.code;
  // var bill = await OutBill.findOne({code:code});
  try {
    await OutBill.updateOne({ code: code }, {
        $set: {
          code:code,
          totalprice: req.body.totalprice,
          note: req.body.note,
          products: req.body.products,
          user: req.body.user,
          addressShip: req.body.addressShip,
          typePay: req.body.typePay,
          status: req.body.state
        }
    })
    res.send('update suscess');
} catch (error) {
    res.send('update failed !');
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
