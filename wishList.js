const level = require('level')

const db = level('my-db')

// createItem({
//     name: 'AMERICAN TOURISTER'
// }, err => {
//     if (err) console.log(err)
// })

// getItems(items => {
//     console.log(items)
// })

// deleteItem('item1557029316680')

function addItem(item, callback) {
    db.put('item' + Date.now(), JSON.stringify(item), err => {
        if (err) return callback(err)
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

function removeItem(name, callback) {
    db.del(name, err => {
        if (err) return callback(err)
    })
}

module.exports = {
    addItem,
    getItems,
    removeItem
}