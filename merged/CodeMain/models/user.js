const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        email:{type:String,required:true},
        password: {type:String,required:true},
        firstname: String,
        lastname: String,
        credential:{type:String,default:""},
        phone:{type:String,default:""},
        address: {
            country:{type:String,default:""},
            city:{type:String,default:""},
            zipcode:{type:String,default:""},
            district:{type:String,default:""},
            street:{type:String,default:""}
        },
        shippingAddress:{
            city:{type:String,default:""},
            zipcode:{type:String,default:""},
            district:{type:String,default:""},
            street: {type:String,default:""}
        },
        cart:[{
            productCode: {type:String,default:""},
            productname: {type:String,default:""},
            quantity: {type:Number,default:""},
            price: {type:Number,default:""},
            image:{type:String,default:""}
        }],
        orders:[{type:mongoose.Schema.Types.ObjectId,ref:'outbill'}]
    }, 
    {timestamps:true}
)

module.exports = mongoose.model('user',UserSchema)