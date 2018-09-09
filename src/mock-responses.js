const sqlite3 = require('better-sqlite3');
const path = require('path');
const db = require(path.join(__dirname, 'get-db.js')).sqlite3;

function mockResponses(req, res, next) {
  const req_url = req.url.match(/([\/\w-.]+)/)[0];
  const sql = `SELECT * FROM mock_responses WHERE req_url = '${req_url}' AND active = 1 LIMIT 1`;
  const row = db.prepare(sql).get();

  if (row) {
    console.log('MOCK-RESPONSES : ', req.url, row.req_url);
    row.res_delay_sec && console.log('MOCK-RESPONSES : Delaying ', row.res_delay_sec, 'seconds');
    setTimeout(_ => {
      res.setHeader('Content-Type', row.res_content_type);
      res.statusCode = row.res_status;
      res.write(row.res_body);
      res.end();
    }, (row.res_delay_sec || 0) * 1000);
  } else {
    next();
  }
};

module.exports = mockResponses;