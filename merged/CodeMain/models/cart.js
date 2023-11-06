const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    userId : {type:mongoose.Schema.Types.ObjectId,ref: 'user'},
    items: [{
        productCode: {type:String, ref:'products'},
        productname: String,
        type: String,
        quantity: Number,
        price: Number
    }],
    total: Number
},{timestamps:true}) 

module.exports = mongoose.model("cart",CartSchema)

