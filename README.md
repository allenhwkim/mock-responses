# http-request-middleware

NodeJS http request handling middleware with admin UI.

Is your back-end api not ready, too slow, or unstable? You don't have to wait for that by mocking all back-end responses using `http-request-middleware`.

Compatible with [connect](https://github.com/senchalabs/connect), [express](https://github.com/strongloop/express), [browser-sync](https://github.com/BrowserSync/browser-sync) and [many more](#compatible-servers).

![image](https://user-images.githubusercontent.com/1437734/34921357-fd4a5be4-f94e-11e7-8273-a3c94d3b38c9.png)

## TL;DR

Add the middleware to your code before you start the server.

```javascript
var express = require('express');
var httpRequestMiddleware = require('http-request-middleware');

var app = express();
app.use(httpRequestMidleware.middlewares);
app.listen(3000);
```

## Install

  ```javascript
  $ npm install --save-dev http-request-middleware
  ```

## Getting Started

  ### 1. Create mock responses and list to `custom-urls.json`
  ```
  {
    "/api/hello": "hello.json",
    "/api/world": "world.json",
    "/api/foo": {
      "responses": [ 
        {"name": "case 1", "url": "api-responses/foo.json", "active": true},
        {"name": "case 2", "url": "api-responses/foo2.json"},
        {"name": "case 3", "url": "api-responses/foo3.json"}
      ]
    },
    "/api/bar": {
      "responses": [ 
        {"name": "case 1", "url": "api-responses/bar.json", "active": true},
        {"name": "case 2", "url": "api-responses/bar2.json"},
        {"name": "case 3", "url": "api-responses/bar3.json"}
      ]
    }
  }
  ```
  
  ### 2. Optionally, create `proxy-urls.json` to use proxy features.
  ```
  [
    {
      "active":true,
      "context": [
        "api/foo"
      ],
      "options": {
        "logLevel": "debug",
        "target": "https://www.yourServer.com",
        "secure": false,
        "autoRewrite": true,
        "changeOrigin": true
      }
    }
  ]
  ```
  proxy-url options can be found [here](https://github.com/chimurai/http-proxy-middleware#http-proxy-options)
  
  ### 3. Update `package.json` with the configuration files
  ```
  {
    "name": "my package",
    "version": "0.1.0",
    ...
    httpRequestMiddleware: {
      "basePath": "./dist",
      "customUrls": "./custom-urls.json",
      "proxyUrls": "./proxy-urls.json
    }
  }
  ```

  ### 4. Start your development server with http-request-middleware
  #### `browser-sync` example
  ```
  var browserSync = require('browser-sync');
  var httpRequestMiddleware = require('http-request-middleware');

  browserSync.init({
    logLevel: 'debug',
    host: 'localhost.rogers.com', // e.g. localhost.mysite.com
    port: 3000,
    startPath: '/',
    ui:  { port:  3001 },
    open: 'external',
    browser: 'default',
    server: {
      baseDir: __dirname,
      middleware: httpRequestMiddleware.middlewares
    },
    https: true
  });
  ```
  #### [`connect` example](test/connect.js)
  #### [`express` example](test/express.js)

  ### 5. Visit admin UI `/developer.html` to manage custom urls and/or proxy urls.
  ```
  https://localhost:3000/developer.html
  ```

## Configuration

|Option|Description|
|--|--|
|basePath| the base path that .json files are located. e.g. 'builds/dist'
|customUrls| the file path of custom urls configuration file .g. './custom-urls.json'
|proxyUrls| Optional, the file path of proxy urls configuration file .g. './proxy-urls.json'
|headUrls| Optional, the list of HTML header files
|navigationLinks| list of html links to be seen on the side bar of admin UI.

### `package.json` Example
```
{
  "name": "eclipse",
  "version": "0.2.7",
  ...
  "httpRequestMiddleware": {
    "basePath": "builds/dist",
    "customUrls": "gulp-tasks/browser-sync/custom-urls.json",
    "proxyUrls": "gulp-tasks/browser-sync/proxy-urls.json",
    "headUrls": [
      "https://fonts.googleapis.com/icon?family=Material+Icons",
      "https://unpkg.com/font-awesome@4.7.0/css/font-awesome.css",
      "https://unpkg.com/mce/dist/themes/blue.css",
      "https://unpkg.com/mce/dist/mce.min.css",
      "https://unpkg.com/mce/dist/mce.min.js"
    ],
    "navigationlinks": [
      "<mce-nav-item href='https://example.com/my-document' icon='fa-book'>Documents</mce-nav-item>",
      "<mce-nav-item href='/web/consumer/developer' icon='link'>Links</mce-nav-item>"
    ]
  }
}
```

### Custom File Configuration Example
```
'use strict';
var httpRequestMiddleware = require('http-request-middleware');

httpRequestMiddleware.config.basePath = './api-responses'; // where .json(s) exists
httpRequestMiddleware.config.customUrls = require('./custom-urls.json');
httpRequestMiddleware.config.proxyUrls = require('./proxy-urls.json');
```

## Compatible servers
`http-request-middleware` is compatible with the following servers:

* [connect](https://www.npmjs.com/package/connect)
* [express](https://www.npmjs.com/package/express)
* [browser-sync](https://www.npmjs.com/package/browser-sync)
* [lite-server](https://www.npmjs.com/package/lite-server)
* [grunt-contrib-connect](https://www.npmjs.com/package/grunt-contrib-connect)
* [grunt-browser-sync](https://www.npmjs.com/package/grunt-browser-sync)
* [gulp-connect](https://www.npmjs.com/package/gulp-connect)
* [gulp-webserver](https://www.npmjs.com/package/gulp-webserver)

## License

The MIT License (MIT)

Copyright (c) 2018 Allen Kim
