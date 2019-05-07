const express = require('express')
const level = require('level')
const wishList = require('../wishList')

const router = express.Router()

router.get('/', (_, res) => {
    wishList.getItems(items => {
        res.json(items)
    })
})

module.exports = router