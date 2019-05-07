const request = require('request')
const Fuse = require('fuse.js')
const sendEmail = require('./sendEmail')
const Item = require('./items')

// const flashSaleUri = 'https://shopee.co.th/api/v2/flash_sale/get_items?promotionid=2000018014'
const flashSaleUri = 'https://shopee.co.th/api/v2/flash_sale/get_items'

Item.getItems(items => {
    console.log(items)
})

// request.get(flashSaleUri, (err, _, body) => {
//     if (err) return console.log(err)
//     const flashSaleItems = JSON.parse(body).data.items
//     const options = {
//         shouldSort: true,
//         threshold: 0.3,
//         keys: ['name']
//     }
//     const fuse = new Fuse(flashSaleItems, options)
//     Item.getItems(myItems => {
//         myItems.forEach(myItem => {
//             const myItemValue = JSON.parse(myItem.value)
//             const foundItems = fuse.search(myItemValue.name)
//             foundItems.forEach(foundItem => {
//                 const itemInfo = {
//                     name: foundItem.name,
//                     link: `https://shopee.co.th/${foundItem.name}-i.${foundItem.shopid}.${foundItem.itemid}`,
//                     startTime: new Date(foundItem.start_time)
//                 }
//                 sendEmail(JSON.stringify(itemInfo, null, 2))
//             })
//         })
//     })
// })