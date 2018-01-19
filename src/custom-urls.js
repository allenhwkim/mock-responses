/**
 * provides feature of url hijacking, and serve static file
 */
'use strict;'
var path = require('path');
var mime = require('mime');
var fs = require('fs');
var url = require('url');
var httpProxy = require('http-proxy');

var config = require(__dirname + '/config.js');

function isMatching(req, customUrl) {
  if (customUrl.active && !customUrl.condition) {
    return true;
  }
  if (customUrl.active && customUrl.condition) {
    let urlParsed = url.parse(req.url, true);
    let params = Object.assign({}, urlParsed.query, req.body);
    let fn = new Function('req', 'params', `return ${customUrl.condition}`);
    return fn(req, params);
  }
  return false;
}

/**
 * find the matching custom url for the current request. If not found return null
 */
function getCustomUrl(req) {
  for (var pattern in config.customUrls) {
    var regExp = new RegExp(pattern);
    if (req.url.match(regExp)) {
      for(var i=0; i < config.customUrls[pattern].responses.length; i++) {
        let customUrl = config.customUrls[pattern].responses[i];
        if (isMatching(customUrl)) {
          return customUrl;
          break;
        }
      }
    }
  }
  return null;
};

// hijack url and serve static file or function
function customUrlsMiddleware(req, res, next) {

  var customUrl = getCustomUrl(req);

  if (customUrl) {
    console.log('CUSTOM-URL MIDDLEWARE', req.url, customUrl.url);

    if (customUrl.url.match(/^http/)) {

      var options = {
        target: url.parse(customUrl.url),
        ignorePath: true, secure: false,
        autoRewrite: true, changeOrigin: true
      };
      var proxy = httpProxy.createProxyServer({});

      proxy.web(req, res, options, error => {
        console.log(error);
      })

    } else {


      let filePath = customUrl.url;
      if (!customUrl.url.match(/^\//)) { // not abs. path, prefix basePath
        filePath = path.join(config.basePath, filePath);
      }

      if (!res.getHeader('Content-Type')) {
        res.setHeader('Content-Type', mime.lookup(filePath));
      }
      res.statusCode = customUrl.statusCode || 200;

      // if file not found, it will error out
      res.write(fs.readFileSync(filePath));
      res.end();
    }

  } else {
    next();
  }
};

module.exports = customUrlsMiddleware;
