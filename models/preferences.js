const level = require('level')
const db = level('preferences-db')

const currentPromotionIdKey = 'currentPromotionIdKey'

function getCurrentPromotionId(callback) {
    db.get(currentPromotionIdKey, (err, value) => {
        if (err) return callback(err)
        callback(null, value)
    })
}

function setCurrentPromotionId(value, callback) {
    db.put(currentPromotionIdKey, value, err => {
        if (err) return callback(err)
        callback(null)
    })
}

module.exports = {
    getCurrentPromotionId,
    setCurrentPromotionId
}