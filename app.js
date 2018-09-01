const express = require('express')
const app = express()
const router = require('./process/process')
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(router)

const PORT = process.env.PORT || 3001

// Disable following response headers for security purposes
app.disable('etag')
app.disable('x-powered-by')

app.listen(PORT, () => {
  console.log('Server started. Listening on port ' + PORT)
})
