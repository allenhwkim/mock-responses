#!/usr/bin/env node

'use strict';

var browserSync = require('browser-sync');
var mockResponses = require(__dirname + '/../index.js');

browserSync.init({
  logLevel: 'debug',
  host: 'localhost', // e.g. localhost.mysite.com
  port: 3000,
  startPath: '/',
  ui:  { port:  3001 },
  open: 'external',
  browser: 'default',
  server: {
    baseDir: __dirname,
    middleware: mockResponses
  },
  https: true
});

