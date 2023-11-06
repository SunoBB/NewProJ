const mongoose = require('mongoose');
const HeaderSchema = new mongoose.Schema({
    group: {
        name: String,
        alias: String,
        link : String,
    },
    type: Array
});

module.exports = mongoose.model('header',HeaderSchema);