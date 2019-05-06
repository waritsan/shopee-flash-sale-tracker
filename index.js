const request = require('request')
const level = require('level')
const Fuse = require('fuse.js')
const sendEmail = require('./sendEmail')

// const flashSaleUri = 'https://shopee.co.th/api/v2/flash_sale/get_items?promotionid=2000018014'
const flashSaleUri = 'https://shopee.co.th/api/v2/flash_sale/get_items'
const db = level('my-db')

// putItemInDb({
//     name: 'AMERICAN TOURISTER'
// }, err => {
//     if (err) console.log(err)
// })

// deleteItem('item1557029316680')

// getItemsFromDb(items => {
//     console.log(items)
// })

getFlashSaleItems((err, items) => {
    if (err) return console.log(err)
    searchItems(items)
})

function getFlashSaleItems(callback) {
    request.get(flashSaleUri, (err, _, body) => {
        if (err) return callback(err)
        const flashSaleItems = JSON.parse(body).data.items
        callback(null, flashSaleItems)
    })
}

function searchItems(items) {
    const options = {
        shouldSort: true,
        threshold: 0.3,
        keys: ['name']
    }
    const fuse = new Fuse(items, options)
    getItemsFromDb(myItems => {
        myItems.forEach(myItem => {
            const myItemValue = JSON.parse(myItem.value)
            const foundItems = fuse.search(myItemValue.name)
            foundItems.forEach(foundItem => {
                const itemInfo = {
                    name: foundItem.name,
                    link: `https://shopee.co.th/${foundItem.name}-i.${foundItem.shopid}.${foundItem.itemid}`,
                    startTime: new Date(foundItem.start_time)
                }
                sendEmail(JSON.stringify(itemInfo, null, 2))
            })
        })
    })
}

function putItemInDb(item, callback) {
    db.put('item' + Date.now(), JSON.stringify(item), err => {
        if (err) return callback(err)
    })
}

function getItemsFromDb(callback) {
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
    })
}