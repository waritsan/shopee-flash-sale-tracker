const express = require('express')
const Preference = require('../models/preferenceModel')

const router = express.Router()

router.get('/', (req, res) => {
    Preference.find((err, preferences) => {
        if (err) {
            console.log(err)
            return res.json(err)
        }
        res.json(preferences)
    })
})

router.put('/:id', (req, res) => {
    Preference.findById(req.params.id, (err, preference) => {
        if (err) {
            console.log(err)
            return res.json(err)
        }
        preference.value = req.query.value
        preference.save(err => {
            if (err) {
                console.log(err)
                return res.json(err)
            }
            res.json({'message': `${req.params.id} updated successfully!`})
        })
    })
})

router.delete('/:id', (req, res) => {
    Preference.findById(req.params.id, (err, preference) => {
        if (err) {
            console.log(err)
            return res.json(err)
        }
        preference.remove(err => {
            if (err) {
                console.log(err)
                return res.json(err)
            }
            res.json({'message': `${req.params.id} deleted successfully!`})
        })
    })
})

module.exports = router