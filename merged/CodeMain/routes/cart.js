const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Product = require('../models/product');

router.get('/', async function (req, res) {

    // var json = JSON.parse(req.cookies.cart);
    // res.send(req.cookies.cart);


    var id = req.session.passport;
    var cart = [];
    if (id != undefined) {
        id = id.user;
        var user = await User.findById(id);
        cart = user.cart;
    }
    else {
        var cookie = req.cookies.cart;
        if (cookie != undefined) {
            cart = JSON.parse(cookie);
        }
        else {
            var value = JSON.stringify(cart);
            res.cookie('cart', value, { maxAge: 900000, httpOnly: true });
        }
    }

    res.sendStatus = 200;
    res.render('cart', { cart: cart });
})
router.post('/addOrUpdate', async function (req, res) {
    var id = req.session.passport;
    var product = await Product.findOne({ productCode: String(req.body.code) });
    var item = {
        productCode: req.body.code,
        productname: product.name,
        quantity: req.body.quantity,
        price: product.price,
        image: product.images[0]
    };

    if (id == undefined) {
        var cartJson = [];
        var cookie = req.cookies.cart;
        if (cookie == undefined || cookie == "") {
            cartJson.push(item);
            cartJson = JSON.stringify(cartJson);
        } else {
            var oldJson = JSON.parse(cookie);
            var check = true;
            oldJson.forEach(element => {
                if (element.productCode == req.body.code) {
                    // element.quantity=parseInt(element.quantity)+parseInt(req.body.quantity);
                    element.quantity = req.body.typechange === 0 ? parseInt(element.quantity) + parseInt(req.body.quantity) : req.body.quantity;
                    if(element.quantity>product.quantity) {
                        res.status(200).send("1");
                    }
                    check = false;
                    return;
                }
            });
            if (check) {
                if(req.body.quantity>product.quantity) {
                    res.send("1");
                }
                oldJson.push(item);
            }
            // cartJson = cookie + "," + item;
            cartJson = JSON.stringify(oldJson);
        }
        // cartJson = "["+cartJson+"]";
        res.clearCookie('cart');
        res.cookie('cart', cartJson, { maxAge: 900000, httpOnly: true });
        res.send("add suscess!");

    }
    else {
        id = id.user;
        var user = await User.findOne({ _id: id });
        var carts = user.cart;
        var check = false;
        carts.forEach(element => {
            if (element.productCode == req.body.code) {
                element.quantity += parseInt(req.body.quantity);
                element.quantity = req.body.typechange === 0 ? element.quantity + parseInt(req.body.quantity) : parseInt(req.body.quantity);
                if(element.quantity>product.quantity) {
                    res.send("1");
                }
                check = true;
                return;
            }
        });
        if (check == false) {
            if(req.body.quantity>product.quantity) {
                res.send("1");
            }
            carts.push(item);
        }
        // console.log("----> cart :"+carts)
        try {
            await User.updateOne({ _id: id }, {
                $set: {
                    cart: carts
                }
            }).exec()
            res.send("add suscess!");
        } catch (error) {
            console.log(error)
            res.send(error);
        }
    }
})
router.delete("/delete/:productCode", async function (req, res) {
    const code = req.params.productCode;
    var id = req.session.passport;
    if (id == undefined) {
        var cookie = req.cookies.cart;
        var oldJson = JSON.parse(cookie);
        oldJson = oldJson.filter(function (item) {
            return item.productCode !== code;
        })
        // cartJson = cookie + "," + item;
        cartJson = JSON.stringify(oldJson);
        res.clearCookie('cart');
        res.cookie('cart', cartJson, { maxAge: 900000, httpOnly: true });
        res.send("ok");
    }
    else {
        id = id.user;
        var user = await User.findOne({ _id: id });
        var carts = user.cart;
        carts = carts.filter(function (item) {
            return item.productCode !== code;
        })
        // console.log("----> cart :"+carts)
        try {
            await User.updateOne({ _id: id }, {
                $set: {
                    cart: carts
                }
            }).exec()
            res.send("add suscess!");
        } catch (error) {
            console.log(error)
            res.send(error);
        }
    }
}
)
// router.get('/buynow/:productcode',async function(req,res){
//     const productcode = req.params.productcode;

// })
module.exports = router;