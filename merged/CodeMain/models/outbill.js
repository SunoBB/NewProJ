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
    customer: {type:mongoose.Schema.Types.ObjectId,ref:'user'},
    creator: String,
    addressShip: String,
    typePay:Number, 
    status: Number // hủy bỏ - đã tiếp nhận - đang chuẩn bị hàng - đang chuyển hàng - hoàn thành 
}
,{timestamps:true})
module.exports = mongoose.model('outbill',OutbillSchema)