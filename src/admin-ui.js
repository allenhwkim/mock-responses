'use strict;'
const fs = require('fs');
const url = require('url');
const ejs = require('ejs');
const path = require('path');
const DB = require(path.join(__dirname, 'database.js'));

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

var adminUIMiddleware = function(req, res, next) {
  const reqUrl = url.parse(req.url, true);
  if (reqUrl.pathname.match(/^\/developer/)) {
    console.log('[mock-responses]', reqUrl.pathname);
        
    const id = (reqUrl.pathname.match(/\/([0-9]+)\/?/) || [])[1];
    let html;

    // UI API responses
    if (reqUrl.pathname.match(/^\/developer\/api\//)) {
      let resp, sql;
      if (reqUrl.pathname.match(/mock-responses$/)) {
        if (req.method == 'POST') { // create
          resp = DB.insertMockResponse(req.body);
        } else {                    // list
          resp = DB.getMockResponses();
        }
      } else if (reqUrl.pathname.match(/mock-responses\/[0-9]+$/)) {
        if (req.method == 'GET') {           // read
          resp = DB.getMockResponse(id);
        } else if (req.method == 'PUT') {    // update
          console.log('..........................', req.body);
          resp = DB.updateMockResponse(req.body);
        } else if (req.method == 'DELETE') { // delete
          resp = DB.deleteMockResponse(id);
        }
      } else if (reqUrl.pathname.match(/mock-responses\/[0-9]+\/activate$/)) {
        if (req.method == 'PUT') {    // update
          resp = DB.activateMockResponse(id);
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

    // UI html responses 
    if (!reqUrl.pathname.match(/^\/developer\/api\//)) {
      let sql, ejsPath, data;
      const cookies = parseCookies(req.headers.cookie);
      if (cookies['mock-responses'] === undefined) {
        html = getHTML('unauthorized.ejs.html');
      } else if (reqUrl.pathname === '/developer/mock-responses.html') {
        data = DB.getMockResponses(reqUrl.query.q);
        html = getHTML('mock-responses.ejs.html', {data}); 
      } else if (reqUrl.pathname === '/developer/mock-responses/new.html') {
        html = getHTML('mock-new.ejs.html'); 
      } else if (reqUrl.pathname.match(/^\/developer\/mock-responses\/[0-9]+\/edit\.html/)) {
        data = id ? DB.getMockResponse(id) : undefined;
        ejsPath = data ? 'mock-edit.ejs.html' : 'error.ejs.html';
        html = getHTML(ejsPath, {data}); 
      } else if (reqUrl.pathname === '/developer') {
        html = getHTML('index.html'); 
      } else if (reqUrl.pathname.match(/^\/developer\/[0-9a-zA-Z]+\/batch.html/)) {
        data = DB.getUniqueNames();
        html = getHTML('activate-by-name.ejs.html', {data});
      } else if (reqUrl.pathname.match(/^\/developer\/activate/)) {
        const name = (reqUrl.pathname.match(/^\/developer\/activate\/([0-9a-zA-Z\-]+)/) || [])[1];
        DB.activateByName(name);
        html = 'successfully activated';
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
