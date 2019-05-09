const level = require('level')
const db = level('preferences-db')

const currentPromotionIdKey = 'currentPromotionIdKey'

function getCurrentPromotionId(callback) {
    get(currentPromotionIdKey, callback)
}

function setCurrentPromotionId(value, callback) {
    db.put(currentPromotionIdKey, value, err => {
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
    getCurrentPromotionId,
    setCurrentPromotionId,
    get,
    getAll,
    set
}