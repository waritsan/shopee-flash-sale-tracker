const preferences = require('./models/preferences')

preferences.getCurrentPromotionId((err, value) => {
    if (err) return console.log(err)
    console.log(value)
})