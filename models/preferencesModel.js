const level = require('level')
const db = level('preferences-db')

const promotionIdKey = 'promotionId'

function getPromotionId(callback) {
    get(promotionIdKey, callback)
}

function setPromotionId(value, callback) {
    db.put(promotionIdKey, value, err => {
        if (err) return callback(err)
        callback(null)
    })
}

function set(key, value, callback) {
    db.put(key, value, err => {
        if (err) return callback(err)
        callback(null)
    })
}

function get(key, callback) {
    db.get(key, (err, value) => {
        if (err) return callback(err)
        callback(null, value)
    })
}

function getAll(callback) {
    var preferences = []
    db.createReadStream()
        .on('data', data => {
            preferences.push(data)
        })
        .on('error', err => {
            callback(err)
        })
        .on('end', () => {
            callback(null, preferences)
        })
}

module.exports = {
    getPromotionId,
    setPromotionId,
    get,
    getAll,
    set
}