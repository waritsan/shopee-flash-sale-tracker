const request = require('request')
const Fuse = require('fuse.js')
const mongoose = require('mongoose')
const Item = require('../models/itemModel')
const Preference = require('../models/preferenceModel')
const sendEmail = require('./sendEmail')

const flashSaleUri = 'https://shopee.co.th/api/v2/flash_sale/get_items'
const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopee'

function lookForSaleItem() {
    connectToDb(err => {
        if (err) return console.error(err)
        getFlashSaleItems((err, flashSaleItems) => {
            if (err) return console.error(err)
            if (flashSaleItems.length === 0) return console.log('Flash sale has not started yet.')
            Item.find((err, myItems) => {
                if (err) return console.error(err)
                if (myItems.length === 0) return console.log('No items in wish list.')
                const matchedItems = searchFlashSaleItems(myItems, flashSaleItems)
                if (matchedItems.length === 0) return console.log('No interested items in this flash sale.')
                console.log('Found items in flash sale: ' + matchedItems.map(item => item.name))
                const emailBody = buildEmailBody(matchedItems)
                sendEmail(JSON.stringify(emailBody, null, 2))
            })
            Preference.updateOne({ name: 'promotionid' }, ) // TODO
        })
    })
}

function connectToDb(callback) {
    const db = mongoose.connection
    db.on('error', callback(new Error('Connection error')))
    db.once('open', () => callback(null, db))
}

function getFlashSaleItems(callback) {
    Preference.findOne({ name: 'promotionid' }, (err, preference) => {
        if (err) return callback(err)
        preference.value // TODO
    })

    // preferences.getPromotionId((err, promotionId) => { // TODO
    //     if (err) {
    //         if (err.notFound) {
    //             return updatePromotionId((err, items) => { // TODO
    //                 if (err) return callback(err)
    //                 callback(null, items)
    //             })
    //         }
    //         return callback(err)
    //     }
    //     requestFlashSaleApi(flashSaleUri + '?promotionid=' + promotionId, (err, items) => {
    //         if (err) {
    //             if (err.message === 'FlashSaleExpiredError') {
    //                 return updatePromotionId((err, items) => {
    //                     if (err) return callback(err)
    //                     callback(null, items)
    //                 })
    //             }
    //             return callback(err)
    //         }
    //         callback(null, items)
    //     })
    // })
}

function searchFlashSaleItems(wishListItems, flashSaleItems) {
    const fuse = new Fuse(flashSaleItems, {
        shouldSort: true,
        threshold: 0.3,
        keys: ['name']
    })
    var matchedItems = []
    wishListItems.forEach(wishListItem => {
        const result = fuse.search(JSON.parse(wishListItem.value).name)
        if (result.length > 0) {
            matchedItems = matchedItems.concat(result)
        }
    })
    return matchedItems
}

function buildEmailBody(items) {
    return items.map(item => {
        return {
            name: item.name,
            link: `https://shopee.co.th/shop/-i.${item.shopid}.${item.itemid}`,
            startTime: (new Date(0)).setUTCSeconds(item.start_time)
        }
    })
}

module,exports = lookForSaleItem