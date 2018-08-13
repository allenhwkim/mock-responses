const path = require('path');
const sqlite3 = require('better-sqlite3');
const mockResponsesDBPath = path.join(process.cwd(), 'mock-responses.sqlite3');

module.exports = {
  get path() {
    return mockResponsesDBPath;
  },
  get sqlite3() {
    return new sqlite3(mockResponsesDBPath);
  }
}