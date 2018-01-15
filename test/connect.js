var connect = require('connect');
var http = require('http');
var httpRequestMiddleware = require(__dirname + '/../index.js');

var app = connect();
httpRequestMiddleware.middlewares.forEach(mw => app.use(mw))

http.createServer(app).listen(3000);
// http://localhost:3000/developer.html