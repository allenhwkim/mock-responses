# mock-responses

NodeJS http request handling middleware, a mock server, with admin UI.

Is your back-end api not ready, too slow, or unstable? You don't have to wait for that by mocking all back-end responses using `mock-responses`.

Compatible with [connect](https://github.com/senchalabs/connect), [express](https://github.com/strongloop/express), [browser-sync](https://github.com/BrowserSync/browser-sync) and [many more](#compatible-servers).

![image](https://user-images.githubusercontent.com/1437734/44070798-cd75a576-9f53-11e8-86f7-d902393aa35e.png)

## TL;DR

Add the middleware to your code before you start the server.

```javascript
var express = require('express');
var httpRequestMiddleware = require('mock-responses');

var app = express();
app.use(httpRequestMidleware);
app.listen(3000);
```

## Install

  ```javascript
  $ npm install --save-dev mock-responses
  ```

## Getting Started
  ### 1. Start your development server with mock-responses middleware
  #### `express` example
  ```
  const express = require('express');
  const path = require('path');
  const mockResponses = require(__dirname + '/../index.js');

  const app = express()
  mockResponses.forEach(mw => app.use(mw))

  app.listen(3000, () => console.log('Example app listening on port 3000!'))
  ```
  
  ### 2. Visit admin UI `/developer#mock-responses` to manage mock or proxy responses.
  ```
  https://localhost:3000/developer#mock-responses
  ```
  proxy-url options can be found [here](https://github.com/chimurai/http-proxy-middleware#http-proxy-options)
  
  ### DONE!!
  
## Compatible servers
`mock-responses` is compatible with the following servers:

* [connect](https://www.npmjs.com/package/connect)
* [express](https://www.npmjs.com/package/express)
* [browser-sync](https://www.npmjs.com/package/browser-sync)
* [lite-server](https://www.npmjs.com/package/lite-server)
* [grunt-contrib-connect](https://www.npmjs.com/package/grunt-contrib-connect)
* [grunt-browser-sync](https://www.npmjs.com/package/grunt-browser-sync)
* [gulp-connect](https://www.npmjs.com/package/gulp-connect)
* [gulp-webserver](https://www.npmjs.com/package/gulp-webserver)
* [webpack-dev-server](https://github.com/webpack/webpack-dev-server)

## License

The MIT License (MIT)

Copyright (c) 2018 Allen Kim
