#!/usr/bin/env node

const express = require('express');
const path = require('path');
const opn = require('opn');
// const mockResponses = require(__dirname + '/../index.js')('./mock-responses.sqlite3');
const mockResponses = require(__dirname + '/../index.js')('./demo/mock-responses.sqlite3');

const app = express()
mockResponses.forEach(mw => app.use(mw))

app.listen(3000, () => console.log('Example app listening on port 3000!'))

opn('http://localhost:3000/developer#mock-responses');