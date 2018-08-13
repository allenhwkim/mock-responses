const sqlite3 = require('better-sqlite3');
const path = require('path');
const db = require(path.join(__dirname, 'get-db.js')).sqlite3;

function mockResponses(req, res, next) {
  const sql = `SELECT * FROM mock_responses WHERE req_url = ? AND active = 1 LIMIT 1`;
  const row = db.prepare(sql).get(req.url);

  if (row) {
    console.log('CUSTOM-URL MIDDLEWARE', req.url, row.req_url);
    res.setHeader('Content-Type', row.res_content_type);
    res.statusCode = row.res_status;
    res.write(row.res_body);
    res.end();
  } else {
    next();
  }
};

module.exports = mockResponses;