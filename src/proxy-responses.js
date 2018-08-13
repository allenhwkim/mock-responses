const sqlite3 = require('better-sqlite3');
const path = require('path');
const proxyMiddleware = require('http-proxy-middleware');

const db = require(path.join(__dirname, 'get-db.js')).sqlite3;

const sql = `SELECT * FROM proxy_responses WHERE active=1`;
const proxyResponses = db.prepare(sql).all().map(row => 
  proxyMiddleware(JSON.parse(row.context), JSON.parse(row.options))
);

module.exports = proxyResponses;