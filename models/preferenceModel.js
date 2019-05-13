const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: String,
    value: String
})

module.exports = mongoose.model('Preference', schema)