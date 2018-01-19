'use strict;'
var fs = require('fs');
var url = require('url');
var ejs = require('ejs');

var config = require(__dirname + '/config.js');

var renderHTML = function(res, templatePath) {
  var template = ''+fs.readFileSync(__dirname + '/admin-ui/' + templatePath);
  var html = ejs.render(template, {config});
  res.setHeader('Content-Type', 'text/html');
  res.write(html);
  res.end();
}

var adminUIMiddleware = function(req, res, next) {
  if (req.url.match(/^\/developer/)) {
    let reqUrl = url.parse(req.url, true);
    console.log('DEVELOPER-URL MIDDLEWARE', reqUrl.href);

    switch(reqUrl.pathname) {
      case '/developer.html':
        renderHTML(res, 'index.ejs.html'); break;
      case '/developer/custom-urls.html':
        renderHTML(res, 'custom-urls.ejs.html'); break;
      case '/developer/proxy-urls.html':
        renderHTML(res, 'proxy-urls.ejs.html'); break;
      case '/developer/api/config':
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(config)); 
        res.end();
        break;
      case '/developer/api/activate':
        let responses = config.customUrls[reqUrl.query.pattern].responses;
        responses.forEach(resp => {
          if (resp.condition === reqUrl.query.condition) {
            if (resp.name === reqUrl.query.name) {
              resp.active = true;
            } else {
              delete resp.active;
            }
          }
        })
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(responses, null, '  '));
        res.end();
        break;
    }

  } else { // not matching to custom url, continue
    next();
  }
};

module.exports = adminUIMiddleware;
