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
const DB = require(path.join(__dirname, 'src', 'database.js'));

module.exports = dbPath => {
  if (dbPath) {
    DB.sqlite3Path = dbPath;
  } else {
    const dbFile = glob.sync('{,!(node_modules|dist|coverage)**/}mock-responses.sqlite3')[0];
    console.log('[mock-responses] found sqlite3 database file, setting database path as ', dbFile);
    DB.sqlite3Path = path.join(process.cwd(), dbFile);
  }

  const adminUI = require(path.join(__dirname, 'src', 'admin-ui.js'));
  const mockResponses = require(path.join(__dirname, 'src', 'mock-responses.js'));
  const middlewares = [].concat(
    bodyParser.json(),
    adminUI, 
    mockResponses,
  );

  return middlewares
}
