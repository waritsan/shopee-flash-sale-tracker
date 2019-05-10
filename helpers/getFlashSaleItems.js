const request = require('request')
const Fuse = require('fuse.js')
const sendEmail = require('./sendEmail')
const wishList = require('../models/wishListModel')
const preferences = require('../models/preferencesModel')

const flashSaleUri = 'https://shopee.co.th/api/v2/flash_sale/get_items'

function checkIfItemsInWishListAreOnSales() {
    preferences.getPromotionId((err, promotionId) => {
        var currentPromotionId = promotionId
        if (err) {
            if (err.notFound) {
                getCurrentPromotionIdFromShopee((err, promotionId) => {
                    if (err) return console.log('Error getCurrentPromotionIdFromShopee: ' + err)
                    preferences.setPromotionId(promotionId, (err) => {
                        if (err) return console.log('Error setPromotionId: ' + err)
                        currentPromotionId = promotionId
                    })
                })
            } else {
                return console.log('Error getPromotionId: ' + err)
            }
        }
        requestFlashSaleApiWithPromotionId(currentPromotionId, (err, flashSaleItems) => {
            if (err) return console.log('Error requestFlashSaleApi: ' + err)
            // TODO process flashSaleItems
            const fuse = new Fuse(flashSaleItems, {
                shouldSort: true,
                threshold: 0.3,
                keys: ['name']
            })
            wishList.getItems(wishListItems => {
                wishListItems.forEach(wishListItem => {
                    const matchItems = fuse.search(JSON.parse(wishListItem.value).name)
                    matchItems.forEach(matchItem => {
                        const itemInfo = {
                            name: matchItem.name,
                            link: `https://shopee.co.th/shop/-i.${matchItem.shopid}.${matchItem.itemid}`,
                            startTime: new Date(matchItem.start_time)
                        }
                        sendEmail(JSON.stringify(itemInfo, null, 2))
                    })
                })
            })
        })
    })
}

function getCurrentPromotionIdFromShopee(callback) {
    // Todo
}

function requestFlashSaleApiWithPromotionId(currentPromotionId, callback) {
    const nextPromotionid = parseInt(currentPromotionId) + 1
    const nextFlashSaleUrl = flashSaleUri + '?promotionid=' + nextPromotionid
    request.get(nextFlashSaleUrl, (err, _, body) => {
        if (err) return console.log('Error getFlashSaleUrl: ' + err)
        const data = JSON.parse(body).data
        if (!data) {
            err.type = 'FlashSaleExpiredError'
            return callback(err)
        }
        if (data.total === 0) {
            err.type = 'FlashSaleNotStartedError'
            return callback(err)
        }
        preferences.setPromotionId(nextPromotionid, err => {
            if (err) {
                console.log('Error setCurrentPromotionId: ' + err)
                return callback(err)
            }
            return callback(null, data.items)
        })
    })
}

module.exports = getFlashSaleItems