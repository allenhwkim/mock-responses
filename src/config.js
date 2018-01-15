var path = require('path');

//<-- your own confile dir
var defaultConfig = require(__dirname + '/default-configs/config.json');
defaultConfig.customUrls = __dirname + '/default-configs/custom-urls.json';
defaultConfig.proxyUrls  = __dirname + '/default-configs/proxy-urls.json';
defaultConfig.https = {
    key: __dirname + '/default-configs/ssl.key',
    cert: __dirname + '/default-configs/ssl.crt'
  };

// to get the current directory package.json
var packageJson = require(path.resolve(path.join('.', 'package.json')));
var userConfig = packageJson.httpRequestMiddleware;

var config = Object.assign({}, defaultConfig, userConfig);
config.customUrls = require(config.customUrls);
config.proxyUrls = require(config.proxyUrls);

module.exports = config;
