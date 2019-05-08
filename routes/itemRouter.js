const express = require('express')
const level = require('level')
const wishList = require('../wishList')

const router = express.Router()

router.get('/', (req, res) => {
    wishList.getItems(items => {
        res.json(items)
    })
})

router.post('/', (req, res) => {
    wishList.createItem(req.body, err => {
        if (err) {
            console.log(err)
            return res.json(err)
        }
        res.json({'message': 'Item created successfully!'})
    })
})

router.delete('/', (req, res) => {
    wishList.deleteItem(req.body.key, err => {
        if (err) {
            console.log(err)
            return res.json(err)
        }
        res.json({'message': 'Item deleted successfully!'})
    })
})

module.exports = router