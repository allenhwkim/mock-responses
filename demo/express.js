#!/usr/bin/env node

const express = require('express');
const path = require('path');
const mockResponses = require(__dirname + '/../index.js');

const app = express()
mockResponses.forEach(mw => app.use(mw))

app.listen(3000, () => console.log('Example app listening on port 3000!'))
