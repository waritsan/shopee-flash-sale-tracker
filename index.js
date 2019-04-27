const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')

const flashSaleUri = 'https://shopee.co.th/api/v2/flash_sale/get_items'

request.get(flashSaleUri, (err, _, body) => {
    if (err) return console.log(err)
    writeFile(body)
    const items = JSON.parse(body).data.items
    const matchItems = items.filter(item => item.name.includes('Toshiba'))
    console.log(matchItems)
})

function writeFile(data) {
    fs.writeFile('./flash_sale.json', data, err => {
        if (err) console.log(err)
    })
}