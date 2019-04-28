const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')

const flashSaleUri = 'https://shopee.co.th/api/v2/flash_sale/get_items?promotionid=2000017728'
const myItemNames = ['Seagate', 'Cherilon']

request.get(flashSaleUri, (err, _, body) => {
    if (err) return console.log(err)
    writeFile(body)
    const flashSaleItems = JSON.parse(body).data.items
    myItemNames.forEach(myItemName => {
        const matchItems = flashSaleItems.filter(flashSaleItem => flashSaleItem.name.includes(myItemName))
        if (matchItems.length > 0) {
            console.log(matchItems)
        }
    })
})

function writeFile(data) {
    fs.writeFile('./flash_sale.json', data, err => {
        if (err) console.log(err)
    })
}

