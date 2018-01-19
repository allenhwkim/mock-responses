var adminUI    = require(__dirname + '/src/admin-ui.js');
var customUrls = require(__dirname + '/src/custom-urls.js');
var proxyUrls  = require(__dirname + '/src/proxy-urls.js');
var config = require(__dirname + '/src/config.js');
var bodyParser = require('body-parser');

module.exports = { 
  config: config,
  middlewares: [].concat(adminUI, bodyParser.json(), customUrls, proxyUrls)
}
