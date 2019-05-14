const mongoose = require('mongoose')

const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopee'

function connectToMongoDb(callback) {
    mongoose.connect(mongodbUri, { useNewUrlParser: true })
    const db = mongoose.connection
    db.on('error', callback(new Error('Connection error')))
    db.once('open', () => callback(null, db))
}

module.exports = connectToMongoDb