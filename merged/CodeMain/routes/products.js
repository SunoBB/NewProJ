const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const getSimilarProduct =require('../middlewares/utility').getSimilarProduct;

router.get('/:productCode',getSimilarProduct,async (req,res,next)=>{
    let productCode = req.params.productCode;
    try{
        let product = await Product.findOne({productCode:productCode}).exec();
        let view = product.view + 1;
        product.view = view;
        await product.save();
        res.render('detail',{product:product})
    }
    catch(err){
        console.log(err)
        res.send('Error')
    }
    
})
router.get('/getAllProductByType/:type',async (req,res)=>{
    let type = req.params.type;
    let size = req.query.size;
    try{
        let product;
        if(size>0)
        {
            product = await Product.find({type:type}).limit(size).exec();
        }
        else{
            product = await Product.find({type:type}).exec();
        }
        console.log(product.length);
        res.json({product:product});
    }
    catch(err){
        console.log(err);
        res.send(err);
    }
})
router.get('/getAllProductByGroup/:group',async (req,res)=>{
    let group = req.params.group;
    let size = req.query.size;
    try{
        let product;
        if(size>0)
        {
            product = await Product.find({group:group}).limit(size).exec();
        }
        else{
            product = await Product.find({group:group}).exec();
        }
        res.json({product:product});
    }
    catch(err){
        console.log(err);
        res.send(err);
    }
})
module.exports = router;