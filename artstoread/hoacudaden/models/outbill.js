const mongoose = require('mongoose');

const OutbillSchema = new mongoose.Schema({
    code: String,
    totalprice: Number,
    note:String,
    products: [{
        productCode: String,
        name:String,
        price: Number,
        color: String,
        quantity: Number,
    }],
    user: {
        name:String,
        phone:String,
        email:String
    },
    addressShip: String,
    typePay:Number, 
    status: Number // hủy bỏ - đã tiếp nhận - đang chuẩn bị hàng - đang chuyển hàng - hoàn thành 
})

module.exports = mongoose.model('outbill',OutbillSchema)