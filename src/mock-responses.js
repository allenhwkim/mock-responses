const sqlite3 = require('better-sqlite3');
const path = require('path');
const db = require(path.join(__dirname, 'database.js')).instance;

function getMockResoponse(req, res, next) {

  function serveResponse(id) {
    const row = db.prepare(`SELECT * FROM mock_responses WHERE id = ${id}`).get();
    return serveRow(row);
  }

  function serveRow(row) {
    console.log('[mock-responses] handling request', row.req_url);
    row.res_delay_sec && console.log('[mock-responses] Delaying ', row.res_delay_sec, 'seconds');
    setTimeout(_ => {
      res.setHeader('Content-Type', row.res_content_type);

      // CORS enabled
      // req.protocol does not exist for browsersync
      const origin = req.protocol ? req.protocol + '://' + req.get('host') : req.headers['origin'];
      if (origin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, OPTIONS');
        res.setHeader('Access-Control-Allow-Credentials', true);
      }

      res.statusCode = row.res_status;
      res.write(row.res_body);
      res.end();
    }, (row.res_delay_sec || 0) * 1000);
    return row;
  }

  const row = getRowByRequest(req);
  if (row) {
    if (row.res_content_type === 'text/javascript') {
      const func = new Function('serveResponse', 
        `return ${row.res_body.replace(/\\x27/g, '\'')}`);
      const result = func(serveResponse)(req, res, next);
      console.log('result', result);
      result || serveRow(row); //serveResponse is not defined
    } else if (row) {
      serveRow(row);
    }
  } else {
    next();
  }

};

function getRowByRequest(req) {
  const req_url = req.url.match(/([\/\w-.]+)/)[0];
  const sql1 = `
    SELECT * 
    FROM mock_responses 
    WHERE req_url = '${req_url}' 
      AND req_method = '${req.method}'
      AND active = 1
    LIMIT 1
  `;
  const sql2 = `
    SELECT * 
    FROM mock_responses 
    WHERE req_url = '${req_url}' 
      AND req_method IS NULL
      AND active = 1
    LIMIT 1
  `;
  return db.prepare(sql1).get() || db.prepare(sql2).get();
}

module.exports = getMockResoponse;
