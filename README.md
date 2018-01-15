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

  ### 1. Create mock responses and write `custom-urls.json`
  ```
  {
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

  ### 2. Optional, create `proxy-urls.json`
  ```
  [
    {
      "active": true,
      "context": ["/api/**"],
      "options": {
        "logLevel": "debug",
        "target": "https://www.rogers.com",
        "secure": false,
        "autoRewrite": true,
        "changeOrigin": true
      }
    }
  ] 
  ```

  ### 3. Update `config.json`
  ```
  {
    "name": "my package",
    "version": "0.1.0",
    ...
    httpRequestMiddleware: {
      "basePath": "./dist",
      "customUrls": "./config/custom-urls.json",
      "proxyUrls": "./config/proxy-urls.json
    }
  }
  ```

  ### 4. Start your development server with middleware
  ```
  var browserSync = require('browser-sync');
  var httpRequestMiddleware = require('http-request-middleware');

  browserSync.init({
    host: 'localhost', // e.g. localhost.mysite.com
    port: 3000,
    browser: 'default',
    server: {
      baseDir: __dirname,
      middleware: httpRequestMiddleware.middlewares
    }
  });
  ```

  ### 4. Visit admin UI.
  ```
  https://localhost:3000/developer.html
  ```

## Configuration Example at `package.json`
```
{
  "name": "eclipse",
  "version": "0.2.7",
  ...
  "httpRequestMiddleware": {
    "basePath": "builds/dist",
    "customUrls": "gulp-tasks/browser-sync/custom-urls.json",
    "proxyUrls": "gulp-tasks/browser-sync/proxy-urls.json",
    "https": {
      "key": "gulp-tasks/browser-sync/apache.key",
      "cert": "gulp-tasks/browser-sync/apache.crt"
    },
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
