const express = require('express')
const app = express()
const port = 3000
const path = require('path')

app.use('/static', express.static(path.join(__dirname, 'resource')))
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')))

app.listen(port, () => console.log(`App is listening on port ${port}!`))