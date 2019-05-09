const level = require('level')

const db = level('wishlist-db')

// addItem({
//     name: 'AMERICAN TOURISTER'
// }, err => {
//     if (err) console.log(err)
// })

// getItems(items => {
//     console.log(items)
// })

// deleteItem('1557029316680')

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