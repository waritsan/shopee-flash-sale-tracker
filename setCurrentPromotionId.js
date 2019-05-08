const preferences = require('./models/preferences')

preferences.setCurrentPromotionId(2000018050, err => {
    if (err) return console.log(err)
    preferences.getCurrentPromotionId((err, value) => {
        if (err) return console.log(err)
        console.log(value)
    })
})

// preferences.getCurrentPromotionId((err, value) => {
//     if (err) return console.log(err)
//     console.log(value)
// })