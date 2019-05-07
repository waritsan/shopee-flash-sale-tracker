const request = require('request')
const Fuse = require('fuse.js')
const sendEmail = require('./sendEmail')
const wishList = require('./wishList')

// const flashSaleUri = 'https://shopee.co.th/api/v2/flash_sale/get_items?promotionid=2000018014'
const flashSaleUri = 'https://shopee.co.th/api/v2/flash_sale/get_items'

function getFlashSaleItems() {
    request.get(flashSaleUri, (err, _, body) => {
        if (err) return console.log(err)
        const flashSaleItems = JSON.parse(body).data.items
        const options = {
            shouldSort: true,
            threshold: 0.3,
            keys: ['name']
        }
        const fuse = new Fuse(flashSaleItems, options)
        wishList.getItems(wishListItems => {
            wishListItems.forEach(wishListItem => {
                const matchItems = fuse.search(wishListItem.value.name)
                matchItems.forEach(matchItem => {
                    const itemInfo = {
                        name: matchItem.name,
                        link: `https://shopee.co.th/${matchItem.name}-i.${matchItem.shopid}.${matchItem.itemid}`,
                        startTime: new Date(matchItem.start_time)
                    }
                    sendEmail(JSON.stringify(itemInfo, null, 2))
                })
            })
        })
    })
}

getFlashSaleItems()