const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Category = require('../models/category');
const path = require('path');
const multer = require('multer');
const upload = multer({dest:'./public/uploads/product'});

router.get('',function(req,res,next){
    let page = (typeof req.query.page != 'undefined')?req.query.page:1;
    console.log(page);
    let pageSize = 10;
    Product.find().skip((page-1)*pageSize).limit(pageSize).exec((err,products)=>{
        Product.countDocuments((err,count)=>{   
            if(err) return next(err);
            res.render('partials/product/table',{
                products:products,
                current:page,
                pages:Math.ceil(count/pageSize)
            })
        })
    })
})


router.get('/add',async function(req,res,next){
    var categories = await Category.find();
    res.render("partials/product/add",{categories:categories});
})

router.post('/add', async function(req,res,next){
    let check = await Product.count({productCode:req.body.productCode}).exec();
    if(check!==0)
    {
        res.send('Mã sản phẩm đã tồn tại');
    }
    else
    {
        let product = new Product({
            name: req.body.name,
            productCode: req.body.productCode,
            quantity: req.body.quantity,
            price: req.body.price,
            images: req.body.images,
            features:req.body.features,
            discount: req.body.discount,
            type:req.body.type,
            group:req.body.group,
            brand: req.body.brand,
            colors:req.body.colors,
            options:req.body.options,
            description: req.body.description,
            view: 0
        });
        product.save().then(result => {
            console.log(result);
            console.log(product);
            res.send('upload suscess !')
        }).catch(err=>{
            console.log(err);
            res.send('upload Failed !')
        })
    }
})
// router.post('/add', async function(req,res,next){

//         res.json(req.body);
// })
router.get('/detail/:productCode', async function(req,res,next){
    var categories = await Category.find();
    let productCode = req.params.productCode;
    let product = await Product.findOne({productCode:productCode});
    res.render("partials/product/detail",{product:product,categories:categories});
})
router.put('/update/:productCode', async function(req,res){
    let productCode = req.params.productCode;
    let product = await Product.findOne({ productCode: productCode });
    try {
        await Product.updateOne({ productCode: productCode }, {
            $set: {
                productCode:req.body.productCode,
                name: req.body.name,
                quantity: req.body.quantity,
                price: req.body.price,
                images: req.body.images,
                features:req.body.features,
                type:req.body.type,
                brand: req.body.brand,
                group:req.body.group,
                discount: req.body.discount,
                colors:req.body.colors,
                brand:req.body.brand,
                description: req.body.description
            }
        })
        res.send('update suscess');
    } catch (error) {
        res.send('update failed !');
    }
})

router.get('/getAllProducts', async function(req,res,next){
    try {
        const product = await Product.find();
        res.json(product);
    } catch (error) {
        res.json(error);
    }
})
router.get('/getAllImage', async function(req,res,next){
    try {
        const product = await Product.find();
        res.render('upload',{product:product});
    } catch (error) {
        res.json(error);
    }
})
router.get('/delete/:productCode',async function(req,res){
    try {
        // var product = await Product.findOne({ productCode: productCode });
        let productCode = req.params.productCode;
      var p = await Product.remove({ productCode: productCode });
        res.redirect('/product');
    } catch (error) {
        res.redirect('/product');
    }
})
router.get('/deleteAll',async function(req,res){
    try {
        await Product.deleteMany({});
        res.send('delete suscess !');
    } catch (error) {
        res.json(error);
    }
    
})
module.exports = router;