const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')
const level = require('level')
const Fuse = require('fuse.js')

const flashSaleUri = 'https://shopee.co.th/api/v2/flash_sale/get_items?promotionid=2000018001'
// const flashSaleUri = 'https://shopee.co.th/api/v2/flash_sale/get_items'
const db = level('my-db')

putItemInDb({
    name: 'PS4 Pro',
    price: 20000
}, err => {
    if (err) console.log(err)
})

// deleteItem('function now() { [native code] }')

getItemsFromDb(items => {
    console.log(items)
})

// getFlashSaleItems((err, items) => {
//     if (err) return console.log(err)
//     const options = {
//         shouldSort: true,
//         keys: ['name'],
//         id: 'name'
//     }
//     const fuse = new Fuse(items, options)
//     const result = fuse.search('apple watch 4')
//     console.log(result)
// })

function getFlashSaleItems(callback) {
    request.get(flashSaleUri, (err, _, body) => {
        if (err) return callback(err)
        writeFile(body)
        const flashSaleItems = JSON.parse(body).data.items
        callback(null, flashSaleItems)
    })
}

function searchItems(items) {
    getItemsFromDb(myItems => {
        myItems.forEach(myItem => {
            myItem.value.forEach(stringToken => {
                const matchItems = items.filter(flashSaleItem => flashSaleItem.name.includes(myItem))
            })
            if (matchItems.length > 0) {
                console.log(matchItems)
            }
        })
    })
}

function writeFile(data) {
    fs.writeFile('./flash_sale.json', data, err => {
        if (err) console.log(err)
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