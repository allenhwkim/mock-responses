'use strict';

var browserSync = require('browser-sync');
var httpRequestMiddleware = require(__dirname + '/../index.js');

browserSync.init({
  // logLevel: 'debug',
  // host: 'localhost', // e.g. localhost.mysite.com
  // port: 4000,
  // startPath: '/',
  // ui:  { port:  4001 },
  // open: 'external',
  browser: 'default',
  server: {
    baseDir: __dirname,
    middleware: httpRequestMiddleware.middlewares
  },
  https: httpRequestMiddleware.config.https
});

