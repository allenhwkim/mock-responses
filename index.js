const sqlite3 = require('better-sqlite3');
const bodyParser = require('body-parser');
const path = require('path');

const db = require(path.join(__dirname, 'src', 'get-db.js')).sqlite3;

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
const adminUI = require(path.join(__dirname, 'src', 'admin-ui.js'));

const mockResponses = require(path.join(__dirname, 'src', 'mock-responses.js'));

const proxyResponses = require(path.join(__dirname, 'src', 'proxy-responses.js'));

module.exports = [].concat(
  bodyParser.json(),
  adminUI, 
  mockResponses,
  proxyResponses
);
