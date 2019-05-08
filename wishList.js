const level = require('level')

const db = level('my-db')

// addItem({
//     name: 'AMERICAN TOURISTER'
// }, err => {
//     if (err) console.log(err)
// })

// getItems(items => {
//     console.log(items)
// })

// removeItem('item1557029316680')

function createItem(item, callback) {
    db.put('item' + Date.now(), JSON.stringify(item), err => {
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
        .on('end', () => {
            callback(items)
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