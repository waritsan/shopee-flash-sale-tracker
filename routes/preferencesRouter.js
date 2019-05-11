const express = require('express')
const preferences = require('../models/preferencesModel')

const router = express.Router()

router.get('/promotionid', (req, res) => {
    preferences.getCurrentPromotionId((err, value) => {
        if (err) {
            console.log(err)
            return res.json(err)
        }
        res.json(value)
    })
})

router.get('/', (req, res) => {
    preferences.getAll((err, data) => {
        if (err) {
            console.log(err)
            return res.json(err)
        }
        res.json(data)
    })
})

router.put('/:id', (req, res) => {
    preferences.set(req.params.id, req.query.value, err => {
        if (err) {
            console.log(err)
            return res.json(err)
        }
        res.json({'message': `${req.params.id} updated successfully!`})
    })
})

router.delete('/:id', (req, res) => {
    preferences.deletePreference(req.params.id, err => {
        if (err) {
            console.log(err)
            return res.json(err)
        }
        res.json({'message': `${req.params.id} deleted successfully!`})
    })
})

module.exports = router