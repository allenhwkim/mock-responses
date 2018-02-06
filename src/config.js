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
config.proxyUrls = require(path.resolve(config.proxyUrls));

// set customUrls
config.customUrls = require(path.resolve(config.customUrls));
for (var pattern in config.customUrls) {
  let value = config.customUrls[pattern];
  if (typeof value === 'string') { // e.g., "api/hello": "hello.json"
    //convert string to responses object with single active one
    config.customUrls[pattern] = {
      "responses": [ {"name": "Unnamed", "url": value, "active": true} ]
    }
  }
}


module.exports = config;
