const sqlite3 = require('better-sqlite3');
const bodyParser = require('body-parser');
const path = require('path');
const glob = require('glob');

// GET     /developer/mock-responses.html
// GET     /developer/mock-responses/new.html
// GET     /developer/mock-responses/:id/edit.html
// GET     /developer/api/mock-responses
// POST    /developer/api/mock-responses
// GET     /developer/api/mock-responses/:id
// PUT     /developer/api/mock-responses/:id
// DELETE  /developer/api/mock-responses/:id
// GET     /developer/proxy-resposes.html
// GET     /developer/proxy-kresponses/new.html
// GET     /developer/proxy-responses/:id/edit.html
// GET     /developer/api/proxy-responses
// POST    /developer/api/proxy-responses
// GET     /developer/api/proxy-responses/:id
// PUT     /developer/api/proxy-responses/:id
// DELETE  /developer/api/proxy-responses/:id
const db = require(path.join(__dirname, 'src', 'database.js'));

module.exports = dbPath => {
  if (dbPath) {
    db.path = dbPath;
  } else {
    const dbFile = glob.sync('{,!(node_modules|dist|coverage)**/}mock-responses.sqlite3')[0];
    console.log('[mock-responses] found sqlite3 database file, setting database path as ', dbFile);
    db._dbPath = path.join(process.cwd(), dbFile);
  }

  const adminUI = require(path.join(__dirname, 'src', 'admin-ui.js'));
  const mockResponses = require(path.join(__dirname, 'src', 'mock-responses.js'));
  const proxyResponses = require(path.join(__dirname, 'src', 'proxy-responses.js'));
  const middlewares = [].concat(
    bodyParser.json(),
    adminUI, 
    mockResponses,
    proxyResponses
  );

  return middlewares
}
