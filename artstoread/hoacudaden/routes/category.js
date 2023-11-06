var express = require('express');
var router = express.Router();
const Category = require('../models/category');

router.get('',function(req,res,next){
    let page = (typeof req.query.page != 'undefined')?req.query.page:1;
    console.log(page);
    let pageSize = 5;
    Category.find().skip((page-1)*pageSize).limit(pageSize).exec((err,categories)=>{
        Category.countDocuments((err,count)=>{   
            if(err) return next(err);
            res.render('partials/cate/table',{
                categories:categories,
                current:page,
                pages:Math.ceil(count/pageSize)
            })
        })
    })
})
router.get("/add", async function (req, res) {
    res.render('partials/cate/add');
})
router.get("/detail/:id", async function (req, res) {
    const id = req.params.id;
    const category = await Category.findOne({_id:id});
    res.render('partials/cate/detail',{category:category});
})
router.post("/add",function(req,res){
    let category = new Category({
        code: getRandomString(6),
        group: req.body.group,
        type: req.body.type,
        image: req.body.image,
        isactive: req.body.isactive
    })
    category.save().then(result => {
        console.log(result);
        res.send('upload suscess !')
    }).catch(err=>{
        console.log(err);
        res.send('upload Failed !')
    })
})
router.put("/update/:id", async function (req, res) {
    let id = req.params._id;
    try {
        await Category.updateOne({_id: id }, {
            $set: {
                group: req.body.group,
                type: req.body.type,
                image: req.body.image,
                isactive: req.body.isactive
            }
        })
        res.send('update suscess');
    } catch (error) {
        res.send('update failed !');
    }
})
router.get("/test/:code",async function(req,res){
    const code = req.params.code;
    var cate = await Category.findOne({code:code});
    res.send(cate);
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