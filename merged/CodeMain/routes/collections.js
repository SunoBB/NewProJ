var express = require('express');
var router = express.Router();
const Product = require('../models/product');

const productFilter = async function (sortby, type,group, brand, price_filter) {
    let filter = {};
    if (typeof type !=="undefined" && type !== "all") filter['type'] = type;
    if (typeof group !== "undefined") {
        if(group !== "all")
        {
            filter['group'] = group;
        }
    }
    if(type == "all" || group == "all") filter = {};
    if (typeof brand != "undefined") filter['brand'] = brand;
    if (typeof price_filter != "undefined"){
        const slices = price_filter.split('-')
        console.log(slices);
        if(slices.length==1)
        {
            if(slices[0].length==6){
                filter['price'] = {$lt:slices[0]}
            }
            else
            {
                filter['price'] = {$gt:slices[0]}
            }
        }
        else{
            filter['price'] =  { $lt: parseInt(slices[1]), $gt: Number(slices[0]) } ;
        }
        
    }
    console.log(filter);
    let query = Product.find(filter);
    let count = await Product.countDocuments(filter);
    switch (sortby) {
        case "popular":
            query = query.sort({ view: -1 })
            break;
        case "title-ascending":
            query = query.sort({ name: 1 });
            break;
        case "title-descending":
            query = query.sort({ name: -1 });
            break;
        case "price-ascending":
            query = query.sort({ price: 1 });
            break;
        case "price-descending":
            query = query.sort({ price: -1 });
            break;
        case "latest":
            query = query.sort({ createdAt: 1 })
            break;
        case "oldest":
            query = query.sort({ createdAt: -1 })
            break;
    }
    return { query, count };
}

router.get('/', (req, res) => {
    res.redirect('/collections/all');
})


router.get('/all', async (req, res) => {
    let type = "all";
    let pageSize = 16;
    let brand = (typeof req.query.brand !== "undefined") ? req.query.brand : "";
    let page = (typeof req.query.page !== "undefined") ? req.query.page : 1;
    let sortby = (typeof req.query.sort_by !== "undefined") ? req.query.sort_by : "";
    let price_filter =  (typeof req.query.price_filter !== "undefined")?req.query.price_filter: undefined;
    let { query, count } = (await productFilter(sortby, type, undefined,undefined,price_filter));
    query
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .collation({ locale: "vi", caseLevel: false })
        .exec((err, products) => {
            if (err) {
                res.send('Error');
            }
            else {
                res.render('collections', {
                    type: "all",
                    brand: brand,
                    productList: products,
                    current: page,
                    sortby: sortby,
                    price_filter:price_filter,
                    pages: Math.ceil(count / pageSize)
                });
            }

        })
})
router.get('/vendors', async (req, res, next) => {
    let pageSize = 16;
    let brand = (typeof req.query.brand !== "undefined") ? req.query.brand : "";
    let page = (typeof req.query.page !== "undefined") ? req.query.page : 1;
    let sortby = (typeof req.query.sort_by !== "undefined") ? req.query.sort_by : "";
    let { query, count } = (await productFilter(sortby, undefined,undefined, brand));
    query
        .skip((page - 1) * pageSize)
        .collation({ locale: "vi", caseLevel: false })
        .limit(pageSize)
        .exec((err, products) => {
            if (err) {
                res.send('Error');
            }
            else {
                let breadcrumbType = brand;
                res.render('collections', {
                    type: breadcrumbType,
                    productList: products,
                    current: page,
                    pages: Math.ceil(count / pageSize)
                });
            }
        })
})

router.get('/:productType', async (req, res, next) => {
    let pageSize = 16;
    let brand = (typeof req.query.brand !== "undefined") ? req.query.brand : undefined;
    let type = req.params.productType;
    let page = (typeof req.query.page !== "undefined") ? req.query.page : 1;
    let sortby = (typeof req.query.sort_by !== "undefined") ? req.query.sort_by : "";
    let price_filter =  (typeof req.query.price_filter !== "undefined")?req.query.price_filter: undefined;
    console.log(price_filter);
    let { query, count } = await productFilter(sortby,type,undefined, brand,price_filter);
    query.skip((page - 1) * pageSize).limit(pageSize).exec((err, products) => {
        if (count == 0) {
            next();
            return;
        }
        if (err) {
            res.send('Error');
        }
        else {
           
            res.render('collections', {
                type: type,
                productList: products,
                current: page,
                sortby: sortby,
                price_filter:price_filter,
                pages: Math.ceil(count / pageSize)
            });
        }
    })

})
router.get('/:productGroup', async (req, res,next) => {
    let brand = (typeof req.query.brand !== "undefined") ? req.query.brand : undefined;
    let group = req.params.productGroup;
    console.log(group)
    let page = (typeof req.query.page !== "undefined") ? req.query.page : 1;
    let sortby = (typeof req.query.sort_by !== "undefined") ? req.query.sort_by : "";
    let price_filter =  (typeof req.query.price_filter!== "undefined") ?req.query.price_filter: undefined;
    let pageSize = 16;
    let {query,count} = await productFilter(sortby,undefined,group ,brand, price_filter)
    console.log(group)
    query.skip((page - 1) * pageSize).limit(pageSize).exec((err, products) => {
            if (err) {
                res.send('Error');
            }
            else {
                let breadcrumbType = group;
                res.render('collections', {
                    type: breadcrumbType,
                    productList: products,
                    current: page,
                    sortby:sortby,
                    price_filter:price_filter,
                    pages: Math.ceil(count / page)
                });
            }
        })

})


module.exports = router;


