To get username
username.sync()

# mock-responses
Intentionally NOT-real API server for front-end development
[Introduction](https://medium.com/allenhwkim/fake-it-until-make-it-mock-responses-9a9eb3361312)

### Start server(NestJS) for production
```
$ cd server 
$ npm i
$ npm run build
$ cd dist/server && node main.js
```
### Start server(NestJS) for development
$ cd server && npm i && ts-node src/main.ts

### Start Client(Angular9)
$ cd client
$ npm i
$ npm run build
$ cd dist/client && open index.html

### Configuration File
Update mock-responses.config.js for detailed setup.
 * dbPath: required, mock-responses .sql file (get this from [demo](https://github.com/allenhwkim/mock-responses/blob/master/demo/mock-responses.sql))
 * ssl: optional, false in default. If true, the server starts in ssl mode.
 * sslKeyPath: optional, ssl key file path. If not defined, it uses a defaul key file.
 * sslCertPath: optional, ssl dert. file path. If not defined, it uses a defaul cert file.
 * port: optional, default 3331. port number for server
 * cookie: optional, sring. if set, all mock responses reply with this cookie.
 * headers: optional, array, if set, all mock resonses reply with this headers.
```
module.exports = {
  dbPath: './mock-server/mock-responses.sql',
  ssl: true,
  port: 9200,
  cookie: 'MY_SESSION=ACCTNBR=123456789; Path=/',
  headers: [
    'Access-Control-Allow-Headers=Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
  ]
};
```
