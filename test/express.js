const express = require('express')
const httpRequestMiddleware = require(__dirname + '/../index.js');

const app = express()
httpRequestMiddleware.middlewares.forEach(mw => app.use(mw))

app.listen(3000, () => console.log('Example app listening on port 3000!'))