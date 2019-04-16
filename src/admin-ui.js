'use strict;'
const fs = require('fs');
const url = require('url');
const ejs = require('ejs');
const path = require('path');
const db = require(path.join(__dirname, 'database.js')).instance;
const username = require('username').sync();

// --------------------------  Migration start -----------------------
//  . add res_delay_sec column
try {
  db.exec('select res_delay_sec from mock_responses limit 1');
} catch(e) {
  db.exec('ALTER TABLE mock_responses ADD COLUMN res_delay_sec integer');
}

//  . add created_at, created_by, updated_at, updated_by columns
try {
  db.exec('select created_at from mock_responses limit 1');
} catch(e) {
  db.exec('ALTER TABLE mock_responses ADD COLUMN created_at INTEGER');
  db.exec('ALTER TABLE mock_responses ADD COLUMN created_by string');
  db.exec('ALTER TABLE mock_responses ADD COLUMN updated_at INTEGER');
  db.exec('ALTER TABLE mock_responses ADD COLUMN updated_by string');
}

try {
  db.exec(`UPDATE mock_responses SET req_method = NULL WHERE req_method = ''`);
} catch(e) {}
// --------------------------  Migration end   -----------------------

// Parse a cookie header
function parseCookies(str) {
  var obj = {};
  var pairs = (str||'').split(/; */);

  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i];
    var eq_idx = pair.indexOf('=');

    // skip things that don't look like key=value
    if (eq_idx < 0) {
      continue;
    } else {
      var key = pair.substr(0, eq_idx).trim()
      var val = pair.substr(++eq_idx, pair.length).trim();
      ('"' == val[0]) && (val = val.slice(1, -1));
      obj[key] = val;
    }
  }

  return obj;
}

function getHTML(templatePath, data) {
  const contents = fs.readFileSync(path.join(__dirname, 'admin-ui', templatePath), 'utf8');
  const html = ejs.render(contents, data);
  return html;
}

function isFunc(code) {
  try {
    new Function(`return ${code}`);
  } catch(e) {
    console.error('[mock-responses] function error', e, code);
    return false;
  }
  return true;
}

function getMockResponses(key) {
  let sql = `SELECT * FROM mock_responses`;
  if (key !== 'undefined') {
    sql += ` WHERE name like '%${key}%' OR req_url like '%${key}%' OR res_body like '%${key}%' `;
  }
  sql += ' ORDER BY req_url, updated_at DESC';
  return db.prepare(sql).all();
}

function getMockResponse(id) {
  const sql = `SELECT * FROM mock_responses WHERE id = ?`;
  return db.prepare(sql).get(id);
}

function insertMockResponse(data) {
  try {
    data.res_body = JSON.stringify(JSON.parse(data.res_doby), null, '  '); 
  } catch(e) {}

  const createdAt = new Date().getTime();

  const reqMethod = data.req_method ? `'${data.req_method}'` : 'NULL'; 

  const reqName = data.name ? `'${data.name}'` : 'NULL';
  const resDelaySec = data.res_delay_sec ? data.res_delay_sec : 'NULL';
  data.res_content_type === 'text/javascript' && isFunc(data.res_body);
  const resBody = data.res_body.replace(/'/g,'\'\'');
  const sql = `
    INSERT INTO mock_responses(name, active, req_url, req_method, 
      res_status, res_delay_sec,
      res_content_type, res_body,
      created_at, created_by, updated_at, updated_by
      ) VALUES 
      (
       ${reqName}, ${data.active}, '${data.req_url}', ${reqMethod},
       ${data.res_status}, ${resDelaySec},
      '${data.res_content_type}', '${resBody}',
       ${createdAt}, '${username}', ${createdAt}, '${username}'
      )
    `;
        
  return db.exec(sql) ? 'inserted' : 'error';
}

function updateMockResponse(data) {
  const updatedAt = new Date().getTime();
  const reqMethod = data.req_method ? `'${data.req_method}'` : 'NULL'; 
  const reqName = data.name ? `'${data.name}'` : 'NULL';
  const resDelaySec = data.res_delay_sec ? data.res_delay_sec : 'NULL';
  data.res_content_type === 'text/javascript' && isFunc(data.res_body);
  const resBody = data.res_body.replace(/'/g,'\'\'');
  const sql = `
    UPDATE mock_responses SET
      name = ${reqName},
      active = ${data.active},
      req_url = '${data.req_url}',
      req_method = ${reqMethod},
      res_status = ${data.res_status},
      res_delay_sec = ${resDelaySec},
      res_content_type = '${data.res_content_type}',
      res_body =  '${resBody}',
      updated_at = ${updatedAt},
      updated_by = '${username}'
    WHERE id = ${data.id};
    `;
  return db.exec(sql) ? 'updated' : 'error';
}

function activateMockResponse(id) {
  const data = getMockResponse(id);
  const deactivateSql = `UPDATE mock_responses SET active = 0 WHERE id <> ${id} AND req_url = '${data.req_url}'`;
  const active = data.active ? 0 : 1; 
  const activateSql = `UPDATE mock_responses SET active = ${active} WHERE id = ${id}`;

  return db.exec(deactivateSql) 
    && db.exec(activateSql) ? 'activated' : 'error';
}

function deleteMockResponse(id) {
  const sql = `DELETE FROM mock_responses where id=${id}`;
  return db.exec(sql) ? 'deleted' : 'error';
}

function getProxyResponses() {
  let sql = `SELECT * FROM proxy_responses WHERE 1 `;
  return db.prepare(sql).all();
}

function getProxyResponse(id) {
  const sql = `SELECT * FROM proxy_responses WHERE id = ?`;
  return db.prepare(sql).get(id);
}

function insertProxyResponse(data) {
  const sql = `
    INSERT INTO proxy_responses(active, context, options) 
    VALUES (${data.active}, '${data.context}', '${data.options}')
    `;
  return db.exec(sql) ? 'inserted' : 'error';
}

function updateProxyResponse(data) {
  const sql = `
    UPDATE proxy_responses
    SET active = ${data.active},
        context = '${data.context}',
        options = '${data.options}'
    WHERE id = ${data.id};
    `;

  return db.exec(sql) ? 'updated' : 'error';
}

function deleteProxyResponse(id) {
  const sql = `DELETE FROM proxy_responses where id=${id}`;
  return db.exec(sql) ? 'deleted' : 'error';
}

var adminUIMiddleware = function(req, res, next) {
  const reqUrl = url.parse(req.url, true);

  if (reqUrl.pathname.match(/^\/developer/)) {
    console.log('[mock-resonses]', reqUrl.pathname);
    
    const id = (reqUrl.pathname.match(/\/([0-9]+)\/?/) || [])[1];
    let html;

    // API responses
    if (reqUrl.pathname.match(/^\/developer\/api\//)) {
      let resp, sql;
      if (reqUrl.pathname.match(/mock-responses$/)) {
        if (req.method == 'POST') { // create
          resp = insertMockResponse(req.body);
        } else {                    // list
          resp = getMockResponses();
        }
      } else if (reqUrl.pathname.match(/mock-responses\/[0-9]+$/)) {
        if (req.method == 'GET') {           // read
          resp = getMockResponse(id);
        } else if (req.method == 'PUT') {    // update
          resp = updateMockResponse(req.body);
        } else if (req.method == 'DELETE') { // delete
          resp = deleteMockResponse(id);
        }
      } else if (reqUrl.pathname.match(/mock-responses\/[0-9]+\/activate$/)) {
        if (req.method == 'PUT') {    // update
          resp = activateMockResponse(id);
        }
      }

      if (reqUrl.pathname.match(/proxy-responses$/)) {
        if (req.method == 'POST') { // create
          resp = insertProxyResponse(req.body);
        } else {                    // list
          resp = getProxyResponses();
        }
      } else if (reqUrl.pathname.match(/proxy-responses\/[0-9]+$/)) {
        if (req.method == 'GET') {           // read
          resp = getProxyResponse(id);
        } else if (req.method == 'PUT') {    // update
          resp = updateProxyResponse(req.body);
        } else if (req.method == 'DELETE') { // delete
          resp = deleteProxyResponse(id);
        }
      }

      if (resp) {
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(resp)); 
        res.end();
      } else {
        next();
      }
    }

    // html responses 
    if (!reqUrl.pathname.match(/^\/developer\/api\//)) {
      let sql, ejsPath, data;
      const cookies = parseCookies(req.headers.cookie);
      if (cookies['mock-responses'] === undefined) {
        html = 'Unauthorized login';
      } else if (reqUrl.pathname === '/developer/mock-responses.html') {
        data = getMockResponses(reqUrl.query.q);
        html = getHTML('mock-responses.ejs.html', {data}); 
      } else if (reqUrl.pathname === '/developer/mock-responses/new.html') {
        html = getHTML('mock-new.ejs.html'); 
      } else if (reqUrl.pathname.match(/^\/developer\/mock-responses\/[0-9]+\/edit\.html/)) {
        data = id ? getMockResponse(id) : undefined;
        ejsPath = data ? 'mock-edit.ejs.html' : 'error.ejs.html';
        html = getHTML(ejsPath, {data}); 
      } else if (reqUrl.pathname === '/developer/proxy-responses.html') {
        data = getProxyResponses();
        html = getHTML('proxy-responses.ejs.html', {data}); 
      } else if (reqUrl.pathname === '/developer/proxy-responses/new.html') {
        html = getHTML('proxy-new.ejs.html'); 
      } else if (reqUrl.pathname.match(/^\/developer\/proxy-responses\/[0-9]+\/edit\.html/)) {
        data = id ? getProxyResponse(id) : undefined;
        ejsPath = data ? 'proxy-edit.ejs.html' : 'error.ejs.html';
        html = getHTML(ejsPath, {data}); 
      } else if (reqUrl.pathname === '/developer') {
        html = getHTML('index.html'); 
      } else {
        html = '404 Not Found';
      }
      if (html) {
        res.setHeader('Content-Type', 'text/html');
        res.write(html);
        res.end();
      } else {
        next();
      }
    }

  } else { // not matching to custom url, continue
    next();
  }
};

module.exports = adminUIMiddleware;
