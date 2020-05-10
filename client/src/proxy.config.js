module.exports = [
  {
    context: [
      '/mock-responses',
      '/use-cases',
      '/api'
      '/foo'
      '/bar'
    ],
    target: 'http://localhost:3331',
    secure: false,
    changeOrigin: true
  }
];
