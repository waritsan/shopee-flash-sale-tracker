const request = require('request')
const Fuse = require('fuse.js')
const sendEmail = require('./sendEmail')
const wishList = require('../models/wishListModel')
const preferences = require('../models/preferencesModel')

const flashSaleUri = 'https://shopee.co.th/api/v2/flash_sale/get_items'

function checkWishListItemsOnFlashSale() {
    getFlashSaleItems((err, flashSaleItems) => {
        if (err) return console.log('Error getFlashSaleItems: ' + err)
        if (flashSaleItems.length === 0) return console.log('Flash sale has not started yet.')
        wishList.getItems((err, wishListItems) => {
            if (err) return console.log('Error wishList.getItems: ' + err)
            if (wishListItems.length === 0) return console.log('No items in wish list.')
            const matchedItems = searchFlashSaleItems(wishListItems, flashSaleItems)
            if (matchedItems.length === 0) return console.log('No wish list items found in this flash sale.')
            console.log('Found items in flash sale: ' + matchedItems.map(item => item.name))
            const emailBody = buildEmailBody(matchedItems)
            sendEmail(JSON.stringify(emailBody, null, 2))
        })
        preferences.incrementPromotionId(err => {
            if (err) return console.log('Error incrementPromotionId: ' + err)
        })
    })
}

function buildEmailBody(items) {
    return items.map(item => {
        return {
            name: item.name,
            link: `https://shopee.co.th/shop/-i.${item.shopid}.${item.itemid}`,
            startTime: new Date(item.start_time)
        }
    })
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

function getFlashSaleItems(callback) {
    preferences.getPromotionId((err, promotionId) => {
        if (err) {
            if (err.notFound) {
                return updatePromotionId((err, items) => {
                    if (err) return callback(err)
                    callback(null, items)
                })
            }
            return callback(err)
        }
        requestFlashSaleApi(flashSaleUri + '?promotionid=' + promotionId, (err, items) => {
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
    })
}

function updatePromotionId(callback) {
    requestFlashSaleApi(flashSaleUri, (err, items) => {
        if (err) return callback(err)
        const promotionId = items.find(item => item.promotionid !== null).promotionid
        preferences.setPromotionId(promotionId, (err) => {
            if (err) return callback(err)
            callback(null, items)
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

module.exports = checkWishListItemsOnFlashSale