const express = require('express');
const router = express.Router();
const Product = require('../models/product')

router.get('/',async function(req,res){
    let page = (typeof req.query.page !="undefined")?req.query.page:1;
    let pageSize = 16;
    let name = req.query.q;
    try{
        let count = await Product.countDocuments({$text:{$search:name,$caseSensitive:false}});
        let products = await Product.find({$text:{$search:name,$caseSensitive:false}})
        res.render('search',
        {   
            layout:true,
            products:products,
            query:name,
            current:page,
            pages: Math.ceil(count/pageSize)
        })
    }
    catch(err)
    {
        console.log(err);
        res.send('Error');
    }
})

module.exports = router;