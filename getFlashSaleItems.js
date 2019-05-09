const request = require('request')
const Fuse = require('fuse.js')
const sendEmail = require('./helpers/sendEmail')
const wishList = require('./models/wishListModel')
const preferences = require('./models/preferencesModel')

// const flashSaleUri = 'https://shopee.co.th/api/v2/flash_sale/get_items?promotionid=2000018014'
const flashSaleUri = 'https://shopee.co.th/api/v2/flash_sale/get_items'

function getFlashSaleItems() {
    preferences.getCurrentPromotionId((err, currentPromotionid) => {
        if (err) return console.log('Error getCurrentPromotionId: ' + err)
        const nextPromotionid = parseInt(currentPromotionid) + 1
        const nextFlashSaleUrl = flashSaleUri + '?promotionid=' + nextPromotionid
        request.get(nextFlashSaleUrl, (err, _, body) => {
            if (err) return console.log('Error getFlashSaleUrl: ' + err)
            if (JSON.parse(body).data.total > 0) {
                preferences.setCurrentPromotionId(nextPromotionid, err => {
                    if (err) return console.log('Error setCurrentPromotionId: ' + err)
                    const flashSaleItems = JSON.parse(body).data.items
                    const options = {
                        shouldSort: true,
                        threshold: 0.3,
                        keys: ['name']
                    }
                    const fuse = new Fuse(flashSaleItems, options)
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

getFlashSaleItems()