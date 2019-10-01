#!/usr/bin/env node

const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const mockResponses = require('mock-responses')('./demo/mock-responses.sqlite3');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}));

// Tell express to use http-request-middlewares
mockResponses.forEach(mw => app.use(mw))

// Serve the files on port 3000.
app.listen(3000, function () {
  console.log('[mock-responses] Example app listening on port 3000!\n');
});
