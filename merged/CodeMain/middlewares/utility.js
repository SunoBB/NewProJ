const Header = require('../models/header');
const Category = require('../models/category');
const Product = require('../models/product');
const User = require('../models/user');
module.exports = {
    getHeaderData: async function (req, res, next) {
        let data = await Header.find().exec();
        res.locals.header = data;
        next();
    },
    getCategories: async function (req, res, next) {
        let data = await Category.find().exec();
        res.locals.categories = data;
        next();
    },
    getSimilarProduct: async function (req, res, next) {
        let productCode = req.params.productCode;
        let product = await Product.find({ productCode: productCode });
        let similarProducts = await Product.find({ type: product[0].type }).where("productCode").ne(product[0].productCode).limit(4).exec();
        res.locals.similarProducts = similarProducts;
        next();
    },
    getBrands: async function (req, res, next) {
        let data = await Product.distinct("brand");
        res.locals.brand = data;
        next();
    },
    getCartDisplay: async function (req, res, next) {
        var id = req.session.passport;
        var customerCart = [];
        if (id == undefined) {
            var cookie = req.cookies.cart;
            if (cookie != undefined) {
                customerCart = JSON.parse(cookie);
            }
            else {
                var value = JSON.stringify(customerCart);
                res.cookie('cart', value, { maxAge: 900000, httpOnly: true });
            }
        }
        else {
            id = id.user;
            if (id == undefined) {
                var cookie = req.cookies.cart;
                if (cookie != undefined) {
                    customerCart = JSON.parse(cookie);
                }
                else {
                    var value = JSON.stringify(customerCart);
                    res.cookie('cart', value, { maxAge: 900000, httpOnly: true });
                }
            }
            else {
                var user = await User.findOne({ _id: id });
                customerCart = user.cart;
            }

        }
        res.locals.customerCart = customerCart;
        next();
    }
}