const level = require('level')
const db = level('wishlist-db')

function createItem(item, callback) {
    db.put(Date.now(), JSON.stringify(item), err => {
        if (err) return callback(err)
        callback(null)
    })
}

function getItems(callback) {
    var items = []
    db.createReadStream()
        .on('data', data => {
            items.push(data)
        })
        .on('error', err => {
            callback(err)
        })
        .on('end', () => {
            callback(null, items)
        })
}

function deleteItem(name, callback) {
    db.del(name, err => {
        if (err) return callback(err)
        callback(null)
    })
}

module.exports = {
    createItem,
    getItems,
    deleteItem
}