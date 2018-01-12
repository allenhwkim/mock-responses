var adminUI    = require(__dirname + '/src/admin-ui.js');
var customUrls = require(__dirname + '/src/custom-urls.js');
var proxyUrls  = require(__dirname + '/src/proxy-urls.js');
var config = require(__dirname + '/src/config.js');

module.exports = { 
  config: config,
  middlewares: [adminUI, customUrls].concat(proxyUrls)
};
