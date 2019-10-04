#!/usr/bin/env node

var connect = require('connect');
var http = require('http');
var mockResponses = require(__dirname + '/../index.js')('./demo/mock-responses.sqlite3');

var app = connect();
mockResponses.forEach(mw => app.use(mw))

http.createServer(app).listen(3000);
// http://localhost:3000/developer.html
