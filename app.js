const express = require('express')
const bodyParser = require('body-parser')
const itemRouter = require('./routes/itemRouter')
const preferencesRouter = require('./routes/preferenceRouter')
const CronJob =  require('cron').CronJob
const lookForSaleItems = require('./helpers/lookForSaleItems')
const connectToDb = require('./helpers/connectToDb')

const app = express()
const port  = process.env.PORT || 8080

connectToDb(err => {
    if (err) console.log(err.message)
})
app.set('json spaces', 2)
app.use(bodyParser.json())
app.use('/api/items', itemRouter)
app.use('/api/preferences', preferencesRouter)
app.listen(port, () => console.log(`Shopee flash-sale tracker is listening on port ${port}!`))

const job = new CronJob('0 10 * * * *', () => {
    lookForSaleItems(err => {
        if (err) console.log(err.message)
    })
})
job.start()