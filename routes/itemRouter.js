const express = require('express')
const Item = require('../models/itemModel')

const router = express.Router()

router.get('/', (req, res) => {
    Item.find((err, items) => {
        if (err) {
            console.log(err)
            return res.json(err)
        }
        res.json(items)
    })
})

router.post('/', (req, res) => {
    const item = new Item(req.body)
    item.save(err => {
        if (err) {
            console.log(err)
            return res.json(err)
        }
        res.json(item)
    })
})

router.delete('/:id', (req, res) => {
    Item.findById(req.params.id, err => {
        if (err) {
            console.log(err)
            return res.json(err)
        }
        res.json({'message': 'Item deleted successfully!'})
    })
})

module.exports = router