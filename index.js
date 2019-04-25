const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')

const flashSaleUri = 'https://shopee.co.th/api/v2/flash_sale/get_items?promotionid=2000017717'

request.get(flashSaleUri, (err, _, body) => {
    if (err) return console.log(err)
    writeFile(body)
    const items = JSON.parse(body).data.items;
    items.forEach(item => {
        console.log(item.name)
    });

})

function writeFile(data) {
    fs.writeFile('./flash_sale.json', data, err => {
        if (err) console.log(err)
    })
}