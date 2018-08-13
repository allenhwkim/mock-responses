#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const getDB = require(path.join(__dirname, 'src', 'get-db.js'));

if (fs.existsSync(getDB.path)) {
  console.info('DB File already exists. Skipping creating DB');
  return 0;
}

const db = getDB.sqlite3;
var rows;
 
db.exec(`
  CREATE TABLE mock_responses (
    id INTEGER PRIMARY KEY, 
    name TEXT DEFAULT 'Unnamed', 
    active INTEGER DEFAULT 1,
    req_url TEXT,
    req_method TEXT DEFAULT 'GET',
    res_status INTEGET DEFAULT 200,
    res_content_type TEXT DEFAULT 'application/json',
    res_body BLOB
  );
`);
db.exec(`
  INSERT INTO mock_responses(active, req_url, res_body) VALUES
  (true, '/api/hello', '[\n  "hello"\n]'),
  (true, '/api/world', '[\n  "world"\n]'),
  (true, '/api/foo', '{\n  "foo": "this is foo.json One"\n}'),
  (false, '/api/foo', '{\n  "foo": "this is foo.json Two"\n}'),
  (false, '/api/foo', '{\n  "foo": "this is foo.json Three"\n}');
`);

rows = db.prepare("SELECT * FROM mock_responses").all();
console.log(require('util').inspect(rows));

db.exec(`
  CREATE TABLE proxy_responses (
    id INTEGER PRIMARY KEY, 
    active INTEGER DEFAULT 1,
    context TEXT,
    options BLOG
  );
`);

db.exec(`
  INSERT INTO proxy_responses(active, context, options) VALUES
  (true, '["/api/**"]', '{ "logLevel": "debug", "target": "https://www.rogers.com", "secure": false, "autoRewrite": true, "changeOrigin": true }');
`);

rows = db.prepare("SELECT * FROM proxy_responses").all();
console.log(require('util').inspect(rows));

db.close();
