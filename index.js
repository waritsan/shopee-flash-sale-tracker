const request = require('request')

const flashSaleUri = 'https://shopee.co.th/flash_sale?promotionId=2000017641'

request.get(flashSaleUri, (err, _, body) => {
    if (err) return console.log(err)
    console.log(body)
})