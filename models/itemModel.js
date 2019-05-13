const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: String,
    price: Number
})

module.exports = mongoose.model('Item', schema)