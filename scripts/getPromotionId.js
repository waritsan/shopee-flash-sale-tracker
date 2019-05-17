const mongoose = require('mongoose')
const Preference = require('../models/preferenceModel')

const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopee'

mongoose.connect(mongodbUri, { useNewUrlParser: true })

function getPromotionId(callback) {
    Preference.findOne({ name: 'promotionId' }, (err, preference) => {
        if (err) return callback(err)
        callback(preference)
    })
}

getPromotionId((err, preference) => {
    if (err) return console.error(err)
    if (!preference) return console.log('Promotionid not found')
    console.log(preference.value)
})