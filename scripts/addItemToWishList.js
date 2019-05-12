const wishListModel = require('../models/wishListModel')

const item = {
    name: process.argv[2]
}
wishListModel.createItem(item, err => {})