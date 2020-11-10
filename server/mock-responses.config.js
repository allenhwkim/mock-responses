module.exports = {
  dbPath: './mock-responses.sql',
  // ssl: true,
  // sslKeyPath: './demo/server.key'
  // sslCertPath: './demo/server.cert'
  port: 8000,
  cookie: 'PLAY_SESSION=ACCTNBR=123456789; Path=/',
  headers: [
    'Access-Control-Allow-Headers=Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Ocp-Apim-Subscription-Key, requestId, flow',
    'Access-Control-Allow-Methods=GET,POST,PATCH,DELETE,PUT'
  ],
};
