module.exports = {
  dbPath: './demo/mock-responses.sql',
  // ssl: true,
  // sslKeyPath: './demo/server.key'
  // sslCertPath: './demo/server.cert'
  port: 3331,
  cookie: 'MY_SESSION=123456789; Path=/',
  clientPath: '../,
  headers: [
    'Access-Control-Allow-Headers=Content-Type, Authorization, X-Requested-With'
  ],
};
