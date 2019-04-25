const request = require('request').defaults({ jar: true })
const cheerio = require('cheerio')
const fs = require('fs')

const flashSaleUri = 'https://shopee.co.th/api/v2/flash_sale/get_items?promotionid=2000017717'

request.get(flashSaleUri, (err, _, body) => {
    if (err) return console.log(err)
    writeFile(body)
})

function writeFile(data) {
    fs.writeFile('./flash_sale.json', data, err => {
        if (err) console.log(err)
    })
}