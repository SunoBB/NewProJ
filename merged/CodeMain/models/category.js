const mongoose = require('mongoose');
const CategorySchema = new mongoose.Schema({
    group: String,
    type: Array,
    isActive: Boolean,
    image: String
})

module.exports = mongoose.model('category',CategorySchema)