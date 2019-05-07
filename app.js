const express = require('express')
const bodyParser = require('body-parser')
const itemRouter = require('./routes/itemRouter')

const app = express()
const port  = process.env.PORT || 8080

app.set('json spaces', 2)
app.use(bodyParser.json())
app.use('/api/items', itemRouter)
app.listen(port, () => console.log(`Shopee flash-sale tracker is listening on port ${port}!`))