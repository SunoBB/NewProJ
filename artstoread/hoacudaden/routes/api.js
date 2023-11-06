const express = require('express');
const router = express.Router();
const Product = require('../models/product');
router.get('/product/:page',function(req,res,next){
    let page = req.params.page || 1;
    let pageSize = 10;

})