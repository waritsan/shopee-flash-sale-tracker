const request = require('request')
const Fuse = require('fuse.js')
const Item = require('../models/itemModel')
const Preference = require('../models/preferenceModel')
const sendEmail = require('./sendEmail')
const connectToDb = require('./connectToDb')

const flashSaleUri = 'https://shopee.co.th/api/v2/flash_sale/get_items'

function lookForSaleItem(callback) {
    connectToDb((err) => {
        if (err) return callback(err)
        getFlashSaleItems((err, flashSaleItems) => {
            if (err) return callback(err)
            if (flashSaleItems.length === 0) return callback(new Error('Flash sale has not started yet.'))
            Preference.findOne({ name: 'promotionId' }, (err, preference) => {
                if (err) return console.error(err)
                preference.value++
                preference.save(err => {
                    if (err) return callback(err)
                })
            })
            Item.find((err, myItems) => {
                if (err) return callback(err)
                if (myItems.length === 0) return callback(new Error('No items in wish list.'))
                const matchedItems = searchFlashSaleItems(myItems, flashSaleItems)
                if (matchedItems.length === 0) return callback(new Error('No items of interest in this flash sale.'))
                console.log('Found items in flash sale: ' + matchedItems.map(item => item.name))
                const emailBody = buildEmailBody(matchedItems)
                sendEmail(JSON.stringify(emailBody, null, 2))
            })
        })
    })
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
            requestFlashSaleApi(flashSaleUri + '?promotionid=' + preference.value, (err, data) => {
                if (err) {
                    if (err.message === 'FlashSaleExpired') {
                        updatePromotionId((err, items) => {
                            if (err) return callback(err)
                            return callback(null, items)
                        })
                    } else return callback(err)
                } else callback(null, data.items)
            })
        }
    })
}

function updatePromotionId(callback) {
    requestFlashSaleApi(flashSaleUri, (err, data) => {
        if (err) return callback(err)
        const items = data.items
        const promotionId = items.find(item => item.promotionid !== null).promotionid
        Preference.findOne({ name: 'promotionId' }, (err, preference) => {
            if (err) return callback(err)
            if (!preference) preference = new Preference({ name: 'promotionId' })
            preference.value = promotionId
            preference.save(err => {
                if (err) return callback(err)
                callback(null, items)
            })
        })
    })
}

function requestFlashSaleApi(uri, callback) {
    request.get(uri, (err, _, body) => {
        if (err) return callback(err)
        const jsonBody = JSON.parse(body)
        if (jsonBody.error) return callback(new Error('FlashSaleExpired'))
        callback(null, jsonBody.data)
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
        const startTime = new Date(item.start_time * 1000)
        return {
            name: item.name,
            link: `https://shopee.co.th/shop/-i.${item.shopid}.${item.itemid}`,
            startTime: startTime.toLocaleString('default', { timeZone: 'Asia/Bangkok' })
        }
    })
}

module.exports = lookForSaleItem