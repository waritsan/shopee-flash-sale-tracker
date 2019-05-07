const express = require('express')
const level = require('level')

const router = express.Router()
const db = level('my-db')

router.get('/', (req, res) => {

})