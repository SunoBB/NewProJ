const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
    userId: {type:String, ref:'users'},
    items: [{
        productCode: String,
        price: Number,
        quantity: Number
    }],
    status: String,
    shippingAddress:{
        city:{type:String,default:""},
        zipcode:{type:String,default:""},
        district:{type:String,default:""},
        street: {type:String,default:""}
    },
    shippingFee: Number,
    total: Number,
    
},{timestamps:true})

module.exports = mongoose.model('order',OrderSchema)