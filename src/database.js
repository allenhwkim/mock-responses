const path = require('path');
const sqlite3 = require('better-sqlite3');

module.exports = {
  _dbPath: null,
  get path() {
    return this._dbPath;
  },
  get instance() {
    const instance = new sqlite3(this._dbPath);
    return instance;
  },
  set path(dbPath) {
    console.log('[mock-responses] setting sqlite3 dabase path', dbPath);
    this._dbPath = path.resolve(dbPath);
  }
}
