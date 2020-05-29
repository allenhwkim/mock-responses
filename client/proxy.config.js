module.exports = [
  {
    context: [
      '/mock-responses',
      '/use-cases',
      '/api',
      '/cms'
    ],
    target: 'http://localhost:3331',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug'
  }
];
