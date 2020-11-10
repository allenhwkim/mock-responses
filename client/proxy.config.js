module.exports = [
  {
    context: [
      '/mock-responses',
      '/use-cases',
      '/api',
      '/cms'
    ],
    target: 'http://127.0.0.1:8000',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug'
  }
];
