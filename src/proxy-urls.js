'use strict';
var proxyMiddleware = require('http-proxy-middleware');
var config = require(__dirname + '/config.js');

let proxyUrls = config.proxyUrls;

let middlewares = proxyUrls
  .filter(proxy => proxy.active)
  .map(proxy => proxyMiddleware(proxy.context, proxy.options));

module.exports = middlewares;
