module.exports = {
  get config() {
    return require(__dirname + '/src/config.js');
  },
  get middlewares() {
    var adminUI    = require(__dirname + '/src/admin-ui.js');
    var customUrls = require(__dirname + '/src/custom-urls.js');
    var proxyUrls  = require(__dirname + '/src/proxy-urls.js');
    var bodyParser = require('body-parser');
    return [].concat(adminUI, bodyParser.json(), customUrls, proxyUrls);
  }
}
