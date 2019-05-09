const request = require('request')
const Fuse = require('fuse.js')
const sendEmail = require('./sendEmail')
const wishList = require('../models/wishListModel')
const preferences = require('../models/preferencesModel')

const flashSaleUri = 'https://shopee.co.th/api/v2/flash_sale/get_items'

function getFlashSaleItems() {
    preferences.getPromotionId((err, promotionId) => {
        if (err) return console.log('Error getPromotionId: ' + err)
        const nextPromotionid = parseInt(promotionId) + 1
        const nextFlashSaleUrl = flashSaleUri + '?promotionid=' + nextPromotionid
        request.get(nextFlashSaleUrl, (err, _, body) => {
            if (err) return console.log('Error getFlashSaleUrl: ' + err)
            const data = JSON.parse(body).data
            if (!data) {
                // TODO
                // getCurrentPromotionIdFromShopee((err, promotionId) => {
                //     callShoppeFlashSaleApi((err, items) => {

                //     })
                // })
            }
            if (data.total > 0) {
                preferences.setPromotionId(nextPromotionid, err => {
                    if (err) return console.log('Error setCurrentPromotionId: ' + err)
                    const fuse = new Fuse(data.items, {
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
            }
        })
    })
}

function getCurrentPromotionIdFromShopee(callback) {

}

function callShoppeFlashSaleApi(callback) {

}

module.exports = getFlashSaleItems