const request = require('request')
const Fuse = require('fuse.js')
const mongoose = require('mongoose')
const Item = require('../models/itemModel')
const Preference = require('../models/preferenceModel')
const sendEmail = require('./sendEmail')

const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopee'
const flashSaleUri = 'https://shopee.co.th/api/v2/flash_sale/get_items'

function lookForSaleItem(callback) {
    connectToDb(err => {
        if (err) return callback(err)
        getFlashSaleItems((err, flashSaleItems) => {
            if (err) return callback(err)
            if (flashSaleItems.length === 0) return callback(new Error('Flash sale has not started yet.'))
            Item.find((err, myItems) => {
                if (err) return callback(err)
                if (myItems.length === 0) return callback(new Error('No items in wish list.'))
                const matchedItems = searchFlashSaleItems(myItems, flashSaleItems)
                if (matchedItems.length === 0) return callback(new Error('No items of interest in this flash sale.'))
                console.log('Found items in flash sale: ' + matchedItems.map(item => item.name))
                const emailBody = buildEmailBody(matchedItems)
                sendEmail(JSON.stringify(emailBody, null, 2))
            })
            Preference.findOne({ name: 'promotionId' }, (err, preference) => {
                if (err) return console.error(err)
                preference.value++
                preference.save()
            })
        })
    })
}

function connectToDb(callback) {
    mongoose.connect(mongodbUri, { useNewUrlParser: true })
    callback(null)
    const db = mongoose.connection
    db.on('error', () => callback(new Error('DbConnectionError')))
    db.once('open', () => callback(null, db))
}

function getFlashSaleItems(callback) {
    Preference.findOne({ name: 'promotionId' }, (err, preference) => {
        if (err) return callback(err)
        if (!preference) {
            updatePromotionId((err, items) => {
                if (err) return callback(err)
                callback(null, items)
            })
        } else {
            requestFlashSaleApi(flashSaleUri + '?promotionid=' + preference.value, (err, items) => {
                if (err) {
                    if (err.message === 'FlashSaleExpiredError') {
                        return updatePromotionId((err, items) => {
                            if (err) return callback(err)
                            callback(null, items)
                        })
                    }
                    return callback(err)
                }
                callback(null, items)
            })
        }
    })
}

function updatePromotionId(callback) {
    requestFlashSaleApi(flashSaleUri, (err, items) => {
        if (err) return callback(err)
        const promotionId = items.find(item => item.promotionid !== null).promotionid
        Preference.findOne({ name: 'promotionId' }, (err, preference) => {
            if (err) return callback(err)
            if (!preference) preference = new Preference({ name: 'promotionId' })
            preference.value = promotionId
            preference.save()
        })
    })
}

function requestFlashSaleApi(uri, callback) {
    request.get(uri, (err, _, body) => {
        if (err) return callback(err)
        const data = JSON.parse(body).data
        if (!data) return callback(new Error('FlashSaleExpiredError'))
        callback(null, data.items)
    })
}

function searchFlashSaleItems(items, flashSaleItems) {
    const fuse = new Fuse(flashSaleItems, {
        shouldSort: true,
        threshold: 0.3,
        keys: ['name']
    })
    var matchedItems = []
    items.forEach(item => {
        const result = fuse.search(item.name)
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

module.exports = lookForSaleItem