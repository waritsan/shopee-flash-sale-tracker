const express = require('express')
const wishList = require('../models/wishListModel')

const router = express.Router()

router.get('/', (req, res) => {
    wishList.getItems((err, items) => {
        if (err) {
            console.log(err)
            return res.json(err)
        }
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

router.delete('/:id', (req, res) => {
    wishList.deleteItem(req.params.id, err => {
        if (err) {
            console.log(err)
            return res.json(err)
        }
        res.json({'message': 'Item deleted successfully!'})
    })
})

module.exports = router