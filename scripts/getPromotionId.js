const mongoose = require('mongoose')
const Preference = require('../models/preferenceModel')

const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopee'

mongoose.connect(mongodbUri, { useNewUrlParser: true })

function getPromotionId() {
    Preference.findOne({ name: 'promotionid' }, (err, preference) => {
        if (err) return callback(err)
        callback(preference.value)
    })  
}

getPromotionId((err, preference) => {
    if (err) return console.error(err)
    console.log(preference)
})