'use strict;'
const fs = require('fs');
const url = require('url');
const ejs = require('ejs');
const path = require('path');
const db = require(path.join(__dirname, 'get-db.js')).sqlite3;

function getHTML(templatePath, data) {
  const contents = fs.readFileSync(path.join(__dirname, 'admin-ui', templatePath), 'utf8');
  const html = ejs.render(contents, data);
  return html;
}

function getMockResponses(cond={}) {
  let sql = `SELECT * FROM mock_responses WHERE 1 `;
  sql += cond.active ? `AND active = $cond.active `: '';
  sql += cond.req_url ? `AND req_url LIKE '%${cond.req_url}%' `: '';
  return db.prepare(sql).all();
}

function getMockResponse(id) {
  const sql = `SELECT * FROM mock_responses WHERE id = ?`;
  return db.prepare(sql).get(id);
}

function insertMockResponse(data) {
  data.name = data.name || 'Unnamed';
  data.req_method = data.req_method || 'GET';
  try {
    data.res_body = JSON.stringify(JSON.parse(data.res_doby), null, '  '); 
  } catch(e) {}
  const sql = `
    INSERT INTO mock_responses(name, active, req_url, req_method, 
      res_status, res_content_type, res_body) VALUES 
      (
       '${data.name}', ${data.active}, '${data.req_url}', '${data.req_method}',
       ${data.res_status}, '${data.res_content_type}', '${data.res_body}'
      )
    `;
  return db.exec(sql) ? 'inserted' : 'error';
}

function updateMockResponse(data) {
  const sql = `
    UPDATE mock_responses SET
      name = '${data.name}',
      active = ${data.active},
      req_url = '${data.req_url}',
      req_method = '${data.req_method}',
      res_status = ${data.res_status},
      res_content_type = '${data.res_content_type}',
      res_body =  '${data.res_body}'
    WHERE id = ${data.id};
    `;
  console.log('sql', sql);
  return db.exec(sql) ? 'updated' : 'error';
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
  console.log('xxxxxxxx>>>>>>>>>>>>', sql)

  return db.exec(sql) ? 'updated' : 'error';
}

function deleteProxyResponse(id) {
  const sql = `DELETE FROM proxy_responses where id=${id}`;
  return db.exec(sql) ? 'deleted' : 'error';
}

var adminUIMiddleware = function(req, res, next) {
  const reqUrl = url.parse(req.url, true);
  console.log('xxxxxxxxxxxx', reqUrl);

  if (reqUrl.pathname.match(/^\/developer/)) {
    console.log('DEVELOPER-URL MIDDLEWARE', reqUrl.pathname);
    
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
          console.log('>>>>>>>>>>>>>>>>>>>>> req.body', req.body);
          resp = updateMockResponse(req.body);
        } else if (req.method == 'DELETE') { // delete
          resp = deleteMockResponse(id);
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

      if (reqUrl.pathname === '/developer/mock-responses.html') {
        data = getMockResponses();
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